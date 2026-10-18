import { useState } from "react";
import type { OutageReport, SimResult, StepPoint } from "../domain/simulate";
import { formatClock, MINUTES_PER_DAY, STEP_MIN } from "../domain/time";
import type { KitItem } from "../domain/types";
import { strings } from "../strings";

interface Props {
  result: SimResult;
  items: KitItem[];
}

interface Segment {
  gridOn: boolean;
  offsetStart: number;
  offsetEnd: number;
  startMin: number;
  endMin: number;
}

export function PlanTimeline({ result, items }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const segments = groupSteps(result.steps);
  const report = result.reports.find((item) => item.offsetStart === selected) ?? null;
  const band = chargeBand(result);

  return (
    <section className="panel" aria-labelledby="day-title">
      <h2 id="day-title">{strings.dayTitle}</h2>
      <div className="legend">
        <span>
          <i className="swatch" style={{ background: "rgba(61,220,151,0.7)" }} />
          {strings.gridOn}
        </span>
        <span>
          <i className="swatch" style={{ background: "#090e16", boxShadow: "inset 0 -2px 0 #ffb547" }} />
          {strings.gridOff}
        </span>
        <span>
          <i className="swatch" style={{ background: "rgba(255,181,71,0.7)" }} />
          {strings.chargeWindow}
        </span>
      </div>
      <div className="daybar-wrap">
        <div className="daybar" data-testid="daybar">
          {segments.map((segment) => {
            const width = `${((segment.offsetEnd - segment.offsetStart) / MINUTES_PER_DAY) * 100}%`;
            if (segment.gridOn) {
              return <div key={segment.offsetStart} className="seg on bar-fill" style={{ width }} />;
            }
            const pressed = selected === segment.offsetStart;
            return (
              <button
                key={segment.offsetStart}
                type="button"
                className="seg off bar-fill"
                style={{ width }}
                data-outage-segment="true"
                aria-pressed={pressed}
                aria-label={`${strings.gridOff} ${formatClock(segment.startMin)}`}
                onClick={() => setSelected(pressed ? null : segment.offsetStart)}
              />
            );
          })}
          {band && <div className="charge-band" style={{ left: `${band.left}%`, width: `${band.width}%` }} />}
          <div className="now-flag" title={strings.now} />
        </div>
      </div>
      <div className="scale" aria-hidden="true">
        {[0, 6, 12, 18, 24].map((hour) => (
          <span key={hour}>{formatClock((result.nowMin + hour * 60) % MINUTES_PER_DAY)}</span>
        ))}
      </div>
      <p className="muted">
        {strings.now}: {formatClock(result.nowMin)}
      </p>
      {report && <Breakdown report={report} items={items} />}
    </section>
  );
}

function Breakdown({ report, items }: { report: OutageReport; items: KitItem[] }) {
  return (
    <div className="breakdown">
      <h3>
        {strings.breakdownTitle}: {formatClock(report.startMin)}–{formatClock(report.endMin)}
      </h3>
      {items
        .filter((item) => item.drawW > 0)
        .map((item) => {
          const death = report.deaths.find((entry) => entry.itemId === item.id);
          return (
            <p key={item.id}>
              {death ? strings.runsOut(item.name, formatClock(death.atMin)) : strings.getsThrough(item.name)}
            </p>
          );
        })}
      {items
        .filter((item) => item.capacityWh > 0)
        .map((item) => (
          <p key={`${item.id}-soc`}>
            {strings.lowest(item.name, `${Math.round((report.minSocById[item.id] ?? 0) * 100)}%`)}
          </p>
        ))}
    </div>
  );
}

function groupSteps(steps: StepPoint[]): Segment[] {
  const segments: Segment[] = [];
  for (const step of steps) {
    const last = segments[segments.length - 1];
    const endClock = (step.clockMin + STEP_MIN) % MINUTES_PER_DAY;
    const endMin = endClock === 0 ? MINUTES_PER_DAY : endClock;
    if (last && last.gridOn === step.gridOn) {
      last.offsetEnd = step.offsetMin + STEP_MIN;
      last.endMin = endMin;
    } else {
      segments.push({
        gridOn: step.gridOn,
        offsetStart: step.offsetMin,
        offsetEnd: step.offsetMin + STEP_MIN,
        startMin: step.clockMin,
        endMin,
      });
    }
  }
  return segments;
}

function chargeBand(result: SimResult): { left: number; width: number } | null {
  if (result.actions.length === 0) return null;
  const start = Math.min(...result.actions.map((action) => action.deadlineAbs));
  const end = Math.max(...result.actions.map((action) => action.outageStartAbs));
  const leftMin = Math.max(0, start - result.nowMin);
  const rightMin = Math.min(MINUTES_PER_DAY, end - result.nowMin);
  if (rightMin <= leftMin) return null;
  return {
    left: (leftMin / MINUTES_PER_DAY) * 100,
    width: ((rightMin - leftMin) / MINUTES_PER_DAY) * 100,
  };
}
