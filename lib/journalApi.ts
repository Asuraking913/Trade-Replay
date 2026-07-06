import { JournalEntry } from "@/components/Journal/types";
import { apiRequest } from "./request";

// Payload for a new entry — the server owns id / createdAt / riskReward.
export type NewJournalEntry = Omit<JournalEntry, "id" | "createdAt">;

// Server shape: prices are decimal strings, createdAt is ISO (cf. RawCandle).
interface RawEntry {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entry: string | null;
  stop: string | null;
  target: string | null;
  confidence: number;
  setups: string[];
  emotion: string | null;
  thesis: string;
  riskReward: number | null;
  createdAt: string;
}

function toEntry(r: RawEntry): JournalEntry {
  return {
    id: r.id,
    createdAt: new Date(r.createdAt).getTime(),
    symbol: r.symbol,
    direction: r.direction,
    entry: r.entry != null ? parseFloat(r.entry) : null,
    stop: r.stop != null ? parseFloat(r.stop) : null,
    target: r.target != null ? parseFloat(r.target) : null,
    confidence: r.confidence,
    setups: r.setups,
    emotion: r.emotion,
    thesis: r.thesis,
  };
}

export async function fetchEntries(): Promise<JournalEntry[]> {
  const raw = await apiRequest<RawEntry[]>("/journal/");
  return raw.map(toEntry);
}

export async function createEntry(
  input: NewJournalEntry
): Promise<JournalEntry> {
  const raw = await apiRequest<RawEntry>("/journal/", {
    method: "POST",
    body: {
      symbol: input.symbol,
      direction: input.direction,
      entry: input.entry,
      stop: input.stop,
      target: input.target,
      confidence: input.confidence,
      setups: input.setups,
      emotion: input.emotion,
      thesis: input.thesis,
    },
  });
  return toEntry(raw);
}

export async function deleteEntry(id: string): Promise<void> {
  await apiRequest<void>(`/journal/${id}/`, { method: "DELETE" });
}
