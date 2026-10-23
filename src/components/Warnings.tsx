import type { SimResult } from "../domain/simulate";
import { formatClock } from "../domain/time";
import { strings } from "../strings";

interface Props {
  hasSchedule: boolean;
  hasKit: boolean;
  result: SimResult | null;
}

export function Warnings({ hasSchedule, hasKit, result }: Props) {
  if (!hasSchedule) {
    return (
      <section className="alert idle" aria-labelledby="warn-title">
        <strong id="warn-title">{strings.warningTitle}</strong>
        <p>{strings.needHours}</p>
      </section>
    );
  }
  if (!hasKit || !result) {
    return (
      <section className="alert idle" aria-labelledby="warn-title">
        <strong id="warn-title">{strings.warningTitle}</strong>
        <p>{strings.needKit}</p>
      </section>
    );
  }
  if (!result.hasOutage || (result.allClear && result.deaths.length === 0)) {
    return (
      <section className="alert ok" aria-labelledby="warn-title">
        <strong id="warn-title">{strings.warningTitle}</strong>
        <p>{result.hasOutage ? strings.allClear : strings.needHours}</p>
      </section>
    );
  }

  const first = result.chargeFirst;
  // If the power is already off, charging advice only applies once it is back.
  const offNow = result.steps.length > 0 && !result.steps[0].gridOn;
  const back = offNow ? result.steps.find((step) => step.gridOn) : undefined;
  const time = first ? formatClock(first.atMin) : "";
  const seen = new Set<string>();
  if (first) seen.add(first.becauseId);
  const others = [...result.deaths]
    .sort((a, b) => a.offsetMin - b.offsetMin)
    .filter((death) => {
      if (seen.has(death.itemId)) return false;
      seen.add(death.itemId);
      return true;
    });

  return (
    <section className="alert bad" role="alert" aria-labelledby="warn-title">
      <strong id="warn-title">{strings.warningTitle}</strong>
      {offNow && <p>{back ? strings.offNow(formatClock(back.clockMin)) : strings.offAllDay}</p>}
      {first && (
        <p>
          {strings.runsOut(first.becauseName, time)}{" "}
          {offNow ? (back ? strings.chargeFirstWhenBack(first.name) : null) : strings.chargeFirst(first.name)}
        </p>
      )}
      {others.map((death) => (
        <p key={`${death.itemId}-${death.offsetMin}`}>{strings.alsoRunsOut(death.name, formatClock(death.atMin))}</p>
      ))}
    </section>
  );
}
