import { MINUTES_PER_DAY } from "./time";

export interface OutageBlock {
  startMin: number;
  endMin: number;
}

export interface ParseError {
  line: number;
  text: string;
}

export interface ParseResult {
  blocks: OutageBlock[];
  errors: ParseError[];
}

export const SAMPLE_SCHEDULE = "SAMPLE\n08:00–12:00\nfrom 16:00 to 20:00\n";

const TIME = String.raw`(?:24(?::00|\.00)?|(?:[01]?\d|2[0-3])(?:[:.][0-5]\d)?)`;
const RANGE_RE = new RegExp(
  String.raw`(?<![\d:.])(?:from\s+)?(${TIME})\s*(?:-|–|—|to)\s*(${TIME})(?![\d:.])`,
  "giu",
);

function parseTime(raw: string): number | null {
  const match = raw.match(/^(\d{1,2})(?:[:.](\d{2}))?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (minutes > 59) return null;
  if (hours === 24) return minutes === 0 ? MINUTES_PER_DAY : null;
  if (hours > 23) return null;
  return hours * 60 + minutes;
}

export function mergeBlocks(blocks: OutageBlock[]): OutageBlock[] {
  const sorted = blocks
    .filter((block) => block.endMin > block.startMin)
    .map((block) => ({ startMin: block.startMin, endMin: block.endMin }))
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const merged: OutageBlock[] = [];
  for (const block of sorted) {
    const last = merged[merged.length - 1];
    if (last && block.startMin <= last.endMin) {
      last.endMin = Math.max(last.endMin, block.endMin);
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}

function pushRange(target: OutageBlock[], start: number, end: number): void {
  if (end === 0 && start > 0) end = MINUTES_PER_DAY;
  if (start === MINUTES_PER_DAY || end === start) return;
  if (end < start) {
    target.push({ startMin: start, endMin: MINUTES_PER_DAY });
    if (end > 0) target.push({ startMin: 0, endMin: end });
    return;
  }
  target.push({ startMin: start, endMin: end });
}

export function parseSchedule(text: string): ParseResult {
  const found: OutageBlock[] = [];
  const errors: ParseError[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(RANGE_RE)];
    if (matches.length === 0) {
      if (line.trim() && /\d/.test(line)) {
        errors.push({ line: index + 1, text: line.trim() });
      }
      return;
    }
    let lineFailed = false;
    for (const match of matches) {
      const start = parseTime(match[1] ?? "");
      const end = parseTime(match[2] ?? "");
      if (start === null || end === null) {
        lineFailed = true;
        continue;
      }
      pushRange(found, start, end);
    }
    if (lineFailed) errors.push({ line: index + 1, text: line.trim() });
  });
  return { blocks: mergeBlocks(found), errors };
}

export function blocksToText(blocks: OutageBlock[]): string {
  return mergeBlocks(blocks)
    .map((block) => {
      const start = formatBlockTime(block.startMin);
      const end = formatBlockTime(block.endMin);
      return `${start}–${end}`;
    })
    .join("\n");
}

function formatBlockTime(min: number): string {
  if (min === MINUTES_PER_DAY) return "24:00";
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function hourFullyOut(blocks: OutageBlock[], hour: number): boolean {
  const start = hour * 60;
  const end = (hour + 1) * 60;
  return mergeBlocks(blocks).some((block) => block.startMin <= start && block.endMin >= end);
}

function subtractRange(blocks: OutageBlock[], start: number, end: number): OutageBlock[] {
  const next: OutageBlock[] = [];
  for (const block of mergeBlocks(blocks)) {
    if (block.endMin <= start || block.startMin >= end) {
      next.push(block);
      continue;
    }
    if (block.startMin < start) next.push({ startMin: block.startMin, endMin: start });
    if (block.endMin > end) next.push({ startMin: end, endMin: block.endMin });
  }
  return mergeBlocks(next);
}

export function removeBlock(blocks: OutageBlock[], block: OutageBlock): OutageBlock[] {
  return mergeBlocks(
    blocks.filter(
      (candidate) => candidate.startMin !== block.startMin || candidate.endMin !== block.endMin,
    ),
  );
}

export function toggleHour(blocks: OutageBlock[], hour: number): OutageBlock[] {
  const start = hour * 60;
  const end = (hour + 1) * 60;
  if (hourFullyOut(blocks, hour)) return subtractRange(blocks, start, end);
  return mergeBlocks([...blocks, { startMin: start, endMin: end }]);
}
