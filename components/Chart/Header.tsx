"use client";

import { Timeframe } from "./types";
import { TIMEFRAMES } from "./constants";

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
    <div className="flex items-center h-11 bg-[#131722] border-b border-[#2a2e39] text-[#d1d4dc] text-xs px-3 gap-3">
      <button
        onClick={onSearchClick}
        className="flex items-center gap-1.5 text-[#9ba0aa] hover:text-white hover:bg-[#1e222d] rounded px-1.5 py-1"
        aria-label="Search symbols"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <button
        onClick={onSearchClick}
        className="text-white font-semibold text-sm hover:text-[#5b8def]"
      >
        {symbol}
      </button>

      <div className="h-5 w-px bg-[#2a2e39]" />

      <div className="flex items-center gap-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              timeframe === tf.value
                ? "text-white bg-[#2a2e39]"
                : "text-[#9ba0aa] hover:text-white hover:bg-[#1e222d]"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={onReplayClick}
        className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
          replayActive
            ? "bg-[#2962ff] text-white"
            : "text-[#9ba0aa] hover:text-white hover:bg-[#1e222d]"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        {replayActive ? "Exit Replay" : "Replay"}
      </button>
    </div>
  );
}
