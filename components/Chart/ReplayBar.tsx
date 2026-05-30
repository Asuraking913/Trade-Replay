"use client";

interface ReplayBarProps {
  isPlaying: boolean;
  isSelecting: boolean;
  onPlayPause: () => void;
  onClip: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
}

const SPEEDS = [1, 2, 4];

export default function ReplayBar({
  isPlaying,
  isSelecting,
  onPlayPause,
  onClip,
  onStop,
  speed,
  onSpeedChange,
}: ReplayBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-bg-elev border border-border rounded-md shadow-lg px-1 py-1">
      {isSelecting && (
        <>
          <button
            onClick={onClip}
            className="flex items-center gap-1.5 px-2.5 h-8 text-xs font-medium text-text-strong hover:bg-bg-hover rounded"
            aria-label="Clip to selection"
            title="Clip chart to the selected start"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            Clip
          </button>
          <div className="h-5 w-px bg-border" />
        </>
      )}

      <button
        onClick={onPlayPause}
        className="w-8 h-8 flex items-center justify-center text-text-strong hover:bg-bg-hover rounded"
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

      <div className="h-5 w-px bg-border" />

      {SPEEDS.map((s) => (
        <button
          key={s}
          onClick={() => onSpeedChange(s)}
          className={`px-2 h-8 text-xs font-medium rounded transition-colors ${
            speed === s
              ? "text-text-strong bg-bg-hover"
              : "text-text-muted hover:text-text-strong hover:bg-bg-hover"
          }`}
        >
          {s}x
        </button>
      ))}

      <div className="h-5 w-px bg-border" />

      <button
        onClick={onStop}
        className="px-2.5 h-8 text-xs font-medium text-text-muted hover:text-text-strong hover:bg-bg-hover rounded"
      >
        Exit
      </button>
    </div>
  );
}
