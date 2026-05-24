"use client";

import { useEffect, useRef } from "react";
import { LinePattern, LineStyle, LineWidth } from "./types";

interface LineStylePopoverProps {
  style: LineStyle;
  onChange: (style: LineStyle) => void;
  onClose: () => void;
  anchorRect: DOMRect;
}

const PATTERNS: { id: LinePattern; dash: string }[] = [
  { id: "solid", dash: "" },
  { id: "dashed", dash: "5 3" },
  { id: "dotted", dash: "1.5 3" },
];

const WIDTHS: LineWidth[] = [1, 2, 3];

export default function LineStylePopover({
  style,
  onChange,
  onClose,
  anchorRect,
}: LineStylePopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const top = anchorRect.top + anchorRect.height / 2 - 60;
  const left = anchorRect.right + 6;

  return (
    <div
      ref={ref}
      className="fixed z-[100] bg-bg-elev border border-border rounded-md shadow-2xl p-2"
      style={{ top, left }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="text-[10px] text-text-muted mb-1.5 px-1 uppercase tracking-wide">Pattern</div>
      <div className="flex gap-1 mb-2">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange({ ...style, pattern: p.id })}
            className={`w-12 h-7 flex items-center justify-center rounded border transition-colors ${
              style.pattern === p.id
                ? "border-accent bg-accent-soft"
                : "border-border hover:border-bg-hover"
            }`}
            title={p.id}
          >
            <svg width="32" height="6" viewBox="0 0 32 6">
              <line
                x1="2"
                y1="3"
                x2="30"
                y2="3"
                stroke="currentColor"
                className="text-text-strong"
                strokeWidth={2}
                strokeDasharray={p.dash || undefined}
                strokeLinecap="round"
              />
            </svg>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-text-muted mb-1.5 px-1 uppercase tracking-wide">Thickness</div>
      <div className="flex gap-1">
        {WIDTHS.map((w) => (
          <button
            key={w}
            onClick={() => onChange({ ...style, width: w })}
            className={`w-12 h-7 flex items-center justify-center rounded border transition-colors ${
              style.width === w
                ? "border-accent bg-accent-soft"
                : "border-border hover:border-bg-hover"
            }`}
            title={`${w}px`}
          >
            <svg width="32" height="6" viewBox="0 0 32 6" className="text-text-strong">
              <line x1="2" y1="3" x2="30" y2="3" stroke="currentColor" strokeWidth={w} strokeLinecap="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
