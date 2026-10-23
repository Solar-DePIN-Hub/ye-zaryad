import { strings } from "../strings";
export const MINUTES_PER_DAY = 1440;
export const STEP_MIN = 15;

export function formatClock(min: number): string {
  if (min === MINUTES_PER_DAY) return "24:00";
  const wrapped = ((Math.round(min) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function floorToStep(min: number): number {
  const wrapped = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return wrapped - (wrapped % STEP_MIN);
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatDuration(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours > 0 && minutes > 0) return `${hours} ${strings.hourShort} ${minutes} ${strings.minuteShort}`;
  if (hours > 0) return `${hours} ${strings.hourShort}`;
  return `${minutes} ${strings.minuteShort}`;
}

/** Local date at an absolute minute count from today's midnight. Values past 1440 roll into the next day. */
export function dateAtAbsMinute(today: Date, absMin: number): Date {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setMinutes(absMin);
  return start;
}
