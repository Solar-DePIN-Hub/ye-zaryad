import { useEffect, useMemo, useState } from "react";
import { ActionList } from "./components/ActionList";
import { BatteryChart } from "./components/BatteryChart";
import { KitEditor } from "./components/KitEditor";
import { PlanTimeline } from "./components/PlanTimeline";
import { ScheduleInput } from "./components/ScheduleInput";
import { Warnings } from "./components/Warnings";
import { parseSchedule } from "./domain/parseSchedule";
import { simulate } from "./domain/simulate";
import type { KitItem } from "./domain/types";
import { floorToStep, minutesOfDay } from "./domain/time";
import { readNow } from "./state/clock";
import { loadPlan, savePlan } from "./state/store";
import { strings } from "./strings";

export function App() {
  const saved = useMemo(() => loadPlan(), []);
  const [scheduleText, setScheduleText] = useState(saved?.scheduleText ?? "");
  const [items, setItems] = useState<KitItem[]>(saved?.items ?? []);
  const [checked, setChecked] = useState<string[]>(saved?.checkedActionIds ?? []);
  const fixedNow = useMemo(() => new URLSearchParams(window.location.search).has("now"), []);
  const [today, setToday] = useState(() => readNow(window.location.search));

  useEffect(() => {
    if (fixedNow) return;
    const timer = window.setInterval(() => setToday(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [fixedNow]);

  useEffect(() => {
    savePlan({
      version: 1,
      scheduleText,
      items,
      checkedActionIds: checked,
    });
  }, [scheduleText, items, checked]);

  const parsed = useMemo(() => parseSchedule(scheduleText), [scheduleText]);
  const nowMin = floorToStep(minutesOfDay(today));
  const result = useMemo(
    () => simulate({ nowMin, blocks: parsed.blocks, items }),
    [nowMin, parsed.blocks, items],
  );
  const ready = parsed.blocks.length > 0 && items.length > 0;

  function toggleChecked(id: string) {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <p className="eyebrow">{strings.eyebrow}</p>
        </div>
        <h1>{strings.appName}</h1>
        <p className="tagline">{strings.tagline}</p>
      </header>
      <ScheduleInput
        text={scheduleText}
        onText={setScheduleText}
        blocks={parsed.blocks}
        errors={parsed.errors}
        nowMin={nowMin}
      />
      <KitEditor items={items} onChange={setItems} />
      <Warnings hasSchedule={parsed.blocks.length > 0} hasKit={items.length > 0} result={ready ? result : null} />
      {parsed.blocks.length > 0 && <PlanTimeline result={result} items={items} />}
      {items.some((item) => item.capacityWh > 0) && parsed.blocks.length > 0 && (
        <BatteryChart result={result} items={items} />
      )}
      <ActionList
        actions={ready ? result.actions : []}
        checked={checked}
        onToggle={toggleChecked}
        today={today}
        hasOutage={parsed.blocks.length > 0}
      />
      <p className="footer">{strings.footer}</p>
      <p className="footer">{strings.offlineReady}</p>
    </main>
  );
}
