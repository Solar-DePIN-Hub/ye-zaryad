import type { OutageBlock } from "./parseSchedule";
import type { KitItem } from "./types";
import { floorToStep, MINUTES_PER_DAY, STEP_MIN } from "./time";

export interface Death {
  itemId: string;
  name: string;
  atMin: number;
  offsetMin: number;
  reason: "own-battery" | "no-supply";
}

export interface ChargeAction {
  id: string;
  itemId: string;
  name: string;
  needsMinutes: number;
  outageStartAbs: number;
  outageStartMin: number;
  deadlineAbs: number;
  deadlineMin: number;
  startNow: boolean;
  fullByOutage: boolean;
}

export interface OutageReport {
  startMin: number;
  endMin: number;
  offsetStart: number;
  offsetEnd: number;
  deaths: Death[];
  minSocById: Record<string, number>;
  survives: boolean;
}

export interface StepPoint {
  offsetMin: number;
  clockMin: number;
  gridOn: boolean;
  socById: Record<string, number>;
}

export interface ChargeFirst {
  itemId: string;
  name: string;
  becauseId: string;
  becauseName: string;
  atMin: number;
}

export interface SimResult {
  nowMin: number;
  hasOutage: boolean;
  allClear: boolean;
  deaths: Death[];
  chargeFirst: ChargeFirst | null;
  reports: OutageReport[];
  steps: StepPoint[];
  actions: ChargeAction[];
}

interface Runtime {
  item: KitItem;
  energyWh: number;
}

const EPS = 1e-6;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function isOutageAt(blocks: OutageBlock[], clockMin: number): boolean {
  const clock = ((clockMin % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return blocks.some((block) => clock >= block.startMin && clock < block.endMin);
}

function socOf(runtime: Runtime): number {
  if (runtime.item.capacityWh <= 0) return 0;
  return runtime.energyWh / runtime.item.capacityWh;
}

export function simulate(input: {
  nowMin: number;
  blocks: OutageBlock[];
  items: KitItem[];
}): SimResult {
  const nowMin = floorToStep(input.nowMin);
  const { blocks, items } = input;
  const runtimes: Runtime[] = items.map((item) => ({
    item,
    energyWh: Math.max(0, item.capacityWh) * clamp01(item.soc),
  }));

  const steps: StepPoint[] = [];
  const deaths: Death[] = [];
  const silenced = new Set<string>();
  let runId = -1;
  let inOutage = false;

  for (let index = 0; index < MINUTES_PER_DAY / STEP_MIN; index += 1) {
    const offset = index * STEP_MIN;
    const clock = (nowMin + offset) % MINUTES_PER_DAY;
    const gridOn = !isOutageAt(blocks, clock);

    if (gridOn) {
      inOutage = false;
      for (const runtime of runtimes) {
        if (runtime.item.capacityWh > 0 && runtime.item.chargeW > 0) {
          const gain = runtime.item.chargeW * (STEP_MIN / 60);
          runtime.energyWh = Math.min(runtime.item.capacityWh, runtime.energyWh + gain);
        }
      }
    } else {
      if (!inOutage) {
        runId += 1;
        inOutage = true;
      }
      const supplies = runtimes.filter(
        (runtime) => runtime.item.sharesPower && runtime.item.capacityWh > 0,
      );
      for (const runtime of runtimes) {
        if (runtime.item.drawW <= 0) continue;
        const key = `${runtime.item.id}:${runId}`;
        if (silenced.has(key)) continue;
        const demand = runtime.item.drawW * (STEP_MIN / 60);
        let need = demand;
        const ownBattery = runtime.item.capacityWh > 0 && !runtime.item.sharesPower;
        if (ownBattery) {
          const take = Math.min(runtime.energyWh, need);
          runtime.energyWh -= take;
          need -= take;
        }
        if (need > EPS) {
          for (const supply of supplies) {
            if (supply.item.id === runtime.item.id) continue;
            const take = Math.min(supply.energyWh, need);
            supply.energyWh -= take;
            need -= take;
            if (need <= EPS) break;
          }
        }
        if (need > EPS) {
          const unmet = Math.min(1, need / demand);
          const survived = Math.max(0, 1 - unmet);
          const dieOffset = offset + survived * STEP_MIN;
          const atMin = Math.round(nowMin + dieOffset) % MINUTES_PER_DAY;
          deaths.push({
            itemId: runtime.item.id,
            name: runtime.item.name,
            atMin,
            offsetMin: dieOffset,
            reason: ownBattery ? "own-battery" : "no-supply",
          });
          silenced.add(key);
        }
      }
    }

    const socById: Record<string, number> = {};
    for (const runtime of runtimes) socById[runtime.item.id] = socOf(runtime);
    steps.push({ offsetMin: offset, clockMin: clock, gridOn, socById });
  }

  const reports = buildReports(steps, deaths, items);
  const actions = buildActions(nowMin, blocks, items);
  const chargeFirst = pickChargeFirst(items, deaths);
  const hasOutage = steps.some((step) => !step.gridOn);

  return {
    nowMin,
    hasOutage,
    allClear: deaths.length === 0,
    deaths,
    chargeFirst,
    reports,
    steps,
    actions,
  };
}

function buildReports(steps: StepPoint[], deaths: Death[], items: KitItem[]): OutageReport[] {
  const reports: OutageReport[] = [];
  let current: StepPoint[] = [];
  const flush = () => {
    if (current.length === 0) return;
    const offsetStart = current[0].offsetMin;
    const offsetEnd = current[current.length - 1].offsetMin + STEP_MIN;
    const startMin = current[0].clockMin;
    const endClock = (current[current.length - 1].clockMin + STEP_MIN) % MINUTES_PER_DAY;
    const endMin = endClock === 0 ? MINUTES_PER_DAY : endClock;
    const segmentDeaths = deaths.filter(
      (death) => death.offsetMin >= offsetStart && death.offsetMin < offsetEnd,
    );
    const minSocById: Record<string, number> = {};
    for (const item of items) {
      if (item.capacityWh <= 0) continue;
      let min = 1;
      for (const step of current) {
        min = Math.min(min, step.socById[item.id] ?? 0);
      }
      minSocById[item.id] = min;
    }
    reports.push({
      startMin,
      endMin,
      offsetStart,
      offsetEnd,
      deaths: segmentDeaths,
      minSocById,
      survives: segmentDeaths.length === 0,
    });
    current = [];
  };

  for (const step of steps) {
    if (!step.gridOn) current.push(step);
    else flush();
  }
  flush();
  return reports;
}

function nextOutageStartAbs(nowMin: number, blocks: OutageBlock[]): number | null {
  for (let offset = STEP_MIN; offset <= MINUTES_PER_DAY; offset += STEP_MIN) {
    const abs = nowMin + offset;
    const clock = abs % MINUTES_PER_DAY;
    const prev = (abs - STEP_MIN) % MINUTES_PER_DAY;
    if (isOutageAt(blocks, clock) && !isOutageAt(blocks, prev)) return abs;
  }
  if (isOutageAt(blocks, nowMin)) return nowMin;
  return null;
}

function buildActions(nowMin: number, blocks: OutageBlock[], items: KitItem[]): ChargeAction[] {
  const outageStartAbs = nextOutageStartAbs(nowMin, blocks);
  if (outageStartAbs === null) return [];
  const actions: ChargeAction[] = [];
  for (const item of items) {
    if (item.capacityWh <= 0 || item.chargeW <= 0) continue;
    const soc = clamp01(item.soc);
    if (soc >= 0.999) continue;
    const gapWh = item.capacityWh * (1 - soc);
    const needsMinutes = Math.max(1, Math.ceil((gapWh / item.chargeW) * 60 - 1e-6));
    let remaining = needsMinutes;
    let deadlineAbs = outageStartAbs;
    for (let minute = outageStartAbs - 1; minute >= nowMin; minute -= 1) {
      const clock = ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
      if (!isOutageAt(blocks, clock)) {
        remaining -= 1;
        deadlineAbs = minute;
        if (remaining <= 0) break;
      }
    }
    const fullByOutage = remaining <= 0;
    const startNow = !fullByOutage || deadlineAbs <= nowMin;
    actions.push({
      id: `charge:${item.id}`,
      itemId: item.id,
      name: item.name,
      needsMinutes,
      outageStartAbs,
      outageStartMin: outageStartAbs % MINUTES_PER_DAY,
      deadlineAbs: fullByOutage ? deadlineAbs : nowMin,
      deadlineMin: (fullByOutage ? deadlineAbs : nowMin) % MINUTES_PER_DAY,
      startNow,
      fullByOutage,
    });
  }
  actions.sort((a, b) => a.deadlineAbs - b.deadlineAbs || a.name.localeCompare(b.name));
  return actions;
}

function pickChargeFirst(items: KitItem[], deaths: Death[]): ChargeFirst | null {
  if (deaths.length === 0) return null;
  const ordered = [...deaths].sort((a, b) => {
    const ai = items.findIndex((item) => item.id === a.itemId);
    const bi = items.findIndex((item) => item.id === b.itemId);
    if (ai !== bi) return ai - bi;
    return a.offsetMin - b.offsetMin;
  });
  const death = ordered[0];
  const item = items.find((candidate) => candidate.id === death.itemId);
  if (!item) return null;
  const canCharge = item.capacityWh > 0 && item.chargeW > 0;
  const supply = items.find((candidate) => candidate.sharesPower && candidate.capacityWh > 0);
  const target = canCharge ? item : (supply ?? item);
  return {
    itemId: target.id,
    name: target.name,
    becauseId: item.id,
    becauseName: item.name,
    atMin: death.atMin,
  };
}
