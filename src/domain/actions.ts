import type { ChargeAction } from "./simulate";
import { strings } from "../strings";
import { dateAtAbsMinute, formatClock, formatDuration } from "./time";
import { buildIcs, type IcsEvent } from "./ics";

export function actionHeadline(action: ChargeAction): string {
  if (action.startNow && !action.fullByOutage) return strings.chargeNow(action.name);
  return strings.chargeBy(action.name, formatClock(action.deadlineMin));
}

export function actionDetail(action: ChargeAction): string {
  const duration = formatDuration(action.needsMinutes);
  const outage = formatClock(action.outageStartMin);
  return action.fullByOutage
    ? strings.needsFull(duration, outage)
    : strings.needsShort(duration, outage);
}

export function actionsToIcs(actions: ChargeAction[], today: Date): string {
  const events: IcsEvent[] = actions.map((action) => {
    const start = dateAtAbsMinute(today, action.deadlineAbs);
    const end = new Date(start.getTime() + 15 * 60 * 1000);
    const summary = actionHeadline(action);
    return {
      uid: `${action.id}-${action.deadlineAbs}@ye-zaryad`,
      summary,
      description: actionDetail(action),
      start,
      end,
    };
  });
  return buildIcs(events, today);
}
