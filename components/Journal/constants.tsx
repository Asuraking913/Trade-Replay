import { EmotionOption } from "./types";

export const STORAGE_KEY = "tradeplay-journal";

export const bodyFont = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
};

export const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

export const easeOut = [0.16, 1, 0.3, 1] as const;

// Setup tags — the trading equivalent of the reference app's "emotions" grid.
export const SETUP_TAGS = [
  "Breakout",
  "Pullback",
  "Support",
  "Resistance",
  "Trend continuation",
  "Reversal",
  "Range",
  "Liquidity grab",
  "Order block",
  "Supply/Demand",
  "News catalyst",
  "Fib retrace",
  "Moving average",
  "Double top/bottom",
];

export const EMOTIONS: EmotionOption[] = [
  { key: "calm", label: "Calm", emoji: "😌" },
  { key: "confident", label: "Confident", emoji: "😎" },
  { key: "focused", label: "Focused", emoji: "🎯" },
  { key: "excited", label: "Excited", emoji: "🤩" },
  { key: "unsure", label: "Unsure", emoji: "🤔" },
  { key: "anxious", label: "Anxious", emoji: "😬" },
  { key: "fomo", label: "FOMO", emoji: "😰" },
  { key: "revenge", label: "Revenge", emoji: "😤" },
];
