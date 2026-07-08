import { Direction, JournalEntry } from "./types";
import { STORAGE_KEY } from "./constants";

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function riskReward(
  direction: Direction,
  entry: number | null,
  stop: number | null,
  target: number | null
): number | null {
  if (entry == null || stop == null || target == null) return null;
  const risk = direction === "long" ? entry - stop : stop - entry;
  const reward = direction === "long" ? target - entry : entry - target;
  if (risk <= 0 || reward <= 0) return null;
  return reward / risk;
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Show prices with thousands separators and at most 2 decimals, so raw
// values like 570.30788412 render as 570.31 instead of a long tail.
export function fmtPrice(v: number): string {
  return v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
