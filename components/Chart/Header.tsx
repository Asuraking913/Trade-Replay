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
  onOpenTools: () => void;
  onOpenWatchlist: () => void;
}

export default function Header({
  symbol,
  timeframe,
  onTimeframeChange,
  replayActive,
  onReplayClick,
  onSearchClick,
  onOpenTools,
  onOpenWatchlist,
}: HeaderProps) {
  return (
    <div className="flex items-center h-11 bg-bg border-b border-border text-text text-xs px-2 sm:px-3 gap-2 sm:gap-3">
      <button
        onClick={onOpenTools}
        className="md:hidden flex items-center justify-center w-7 h-7 text-text-muted hover:text-text-strong hover:bg-bg-hover rounded"
        aria-label="Open tools"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

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
        className="text-text-strong font-semibold text-sm hover:text-line whitespace-nowrap"
      >
        {symbol}
      </button>

      <div className="h-5 w-px bg-border" />

      <div className="flex items-center gap-1 overflow-x-auto">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded transition-colors ${
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
        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded text-xs font-medium transition-colors ${
          replayActive
            ? "bg-accent text-white"
            : "text-text-muted hover:text-text-strong hover:bg-bg-elev"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span className="hidden sm:inline">{replayActive ? "Exit Replay" : "Replay"}</span>
      </button>

      <button
        onClick={onOpenWatchlist}
        className="lg:hidden flex items-center justify-center w-7 h-7 text-text-muted hover:text-text-strong hover:bg-bg-hover rounded"
        aria-label="Open watchlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="currentColor" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="4" cy="18" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
