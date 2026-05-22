"use client";

interface ReplayBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
}

const SPEEDS = [1, 2, 4];

export default function ReplayBar({
  isPlaying,
  onPlayPause,
  onStop,
  speed,
  onSpeedChange,
}: ReplayBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#1e222d] border border-[#2a2e39] rounded-md shadow-lg px-1 py-1">
      <button
        onClick={onPlayPause}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#2a2e39] rounded"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      <div className="h-5 w-px bg-[#2a2e39]" />

      {SPEEDS.map((s) => (
        <button
          key={s}
          onClick={() => onSpeedChange(s)}
          className={`px-2 h-8 text-xs font-medium rounded transition-colors ${
            speed === s
              ? "text-white bg-[#2a2e39]"
              : "text-[#9ba0aa] hover:text-white hover:bg-[#2a2e39]"
          }`}
        >
          {s}x
        </button>
      ))}

      <div className="h-5 w-px bg-[#2a2e39]" />

      <button
        onClick={onStop}
        className="px-2.5 h-8 text-xs font-medium text-[#9ba0aa] hover:text-white hover:bg-[#2a2e39] rounded"
      >
        Exit
      </button>
    </div>
  );
}
