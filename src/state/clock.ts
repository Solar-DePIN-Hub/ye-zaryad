/** Reads an optional `?now=` test hook. `09:30` or a full ISO timestamp. */
export function readNow(search: string, fallback = new Date()): Date {
  const value = new URLSearchParams(search).get("now");
  if (!value) return fallback;
  const short = value.match(/^(\d{1,2}):(\d{2})$/);
  if (short) {
    const date = new Date(fallback);
    date.setHours(Number(short[1]), Number(short[2]), 0, 0);
    return date;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}
