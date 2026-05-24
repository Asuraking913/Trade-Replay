"use client";

import { Timeframe } from "./types";
import { TIMEFRAMES } from "./constants";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  symbol: string;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  replayActive: boolean;
  onReplayClick: () => void;
  onSearchClick: () => void;
}

export default function Header({
  symbol,
  timeframe,
  onTimeframeChange,
  replayActive,
  onReplayClick,
  onSearchClick,
}: HeaderProps) {
  return (
    <div className="flex items-center h-11 bg-bg border-b border-border text-text text-xs px-3 gap-3">
      <button
        onClick={onSearchClick}
        className="flex items-center gap-1.5 text-text-muted hover:text-text-strong hover:bg-bg-hover rounded px-1.5 py-1"
        aria-label="Search symbols"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <button
        onClick={onSearchClick}
        className="text-text-strong font-semibold text-sm hover:text-line"
      >
        {symbol}
      </button>

      <div className="h-5 w-px bg-border" />

      <div className="flex items-center gap-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              timeframe === tf.value
                ? "text-text-strong bg-bg-hover"
                : "text-text-muted hover:text-text-strong hover:bg-bg-elev"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <ThemeToggle />

      <button
        onClick={onReplayClick}
        className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
          replayActive
            ? "bg-accent text-white"
            : "text-text-muted hover:text-text-strong hover:bg-bg-elev"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        {replayActive ? "Exit Replay" : "Replay"}
      </button>
    </div>
  );
}
