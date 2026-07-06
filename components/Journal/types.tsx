export type Direction = "long" | "short";

export interface JournalEntry {
  id: string;
  createdAt: number;
  symbol: string;
  direction: Direction;
  entry: number | null;
  stop: number | null;
  target: number | null;
  confidence: number;
  setups: string[];
  emotion: string | null;
  thesis: string;
}

export interface EmotionOption {
  key: string;
  label: string;
  emoji: string;
}
