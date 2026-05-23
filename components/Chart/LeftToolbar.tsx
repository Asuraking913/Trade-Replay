"use client";

import { useState } from "react";
import { DRAWING_TOOLS } from "./constants";
import { DrawingTool, LineStyle } from "./types";
import LineStylePopover from "./LineStylePopover";

interface LeftToolbarProps {
  activeTool: DrawingTool | null;
  onSelectTool: (tool: DrawingTool | null) => void;
  onClearAll: () => void;
  trendStyle: LineStyle;
  horizontalStyle: LineStyle;
  onStyleChange: (tool: "trend" | "horizontal", style: LineStyle) => void;
}

type StylePopoverTarget = { tool: "trend" | "horizontal"; rect: DOMRect } | null;

export default function LeftToolbar({
  activeTool,
  onSelectTool,
  onClearAll,
  trendStyle,
  horizontalStyle,
  onStyleChange,
}: LeftToolbarProps) {
  const [stylePopover, setStylePopover] = useState<StylePopoverTarget>(null);

  return (
    <div className="flex flex-col w-10 bg-[#131722] border-r border-[#2a2e39] py-2 gap-0.5 items-center">
      {DRAWING_TOOLS.map((tool) => {
        const active = activeTool === tool.id;
        const hasStyle = tool.id === "trend" || tool.id === "horizontal";
        return (
          <div key={tool.id} className="relative">
            <button
              onClick={() => onSelectTool(active ? null : tool.id)}
              title={tool.label}
              className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
                active
                  ? "bg-[#2962ff] text-white"
                  : "text-[#9ba0aa] hover:text-white hover:bg-[#1e222d]"
              }`}
            >
              <ToolIcon tool={tool.id} />
            </button>
            {hasStyle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const btn = e.currentTarget.parentElement?.querySelector("button");
                  const rect = btn?.getBoundingClientRect();
                  if (rect)
                    setStylePopover({
                      tool: tool.id as "trend" | "horizontal",
                      rect,
                    });
                }}
                className="absolute bottom-0 right-0 w-3 h-3 flex items-center justify-center text-[#9ba0aa] hover:text-white"
                title="Line style"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                  <path d="M0 0 L8 0 L4 6 Z" />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      <div className="w-6 h-px bg-[#2a2e39] my-1" />

      <button
        onClick={onClearAll}
        title="Clear drawings"
        className="w-9 h-9 flex items-center justify-center text-[#9ba0aa] hover:text-white hover:bg-[#1e222d] rounded"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>

      {stylePopover && (
        <LineStylePopover
          anchorRect={stylePopover.rect}
          style={stylePopover.tool === "trend" ? trendStyle : horizontalStyle}
          onChange={(s) => onStyleChange(stylePopover.tool, s)}
          onClose={() => setStylePopover(null)}
        />
      )}
    </div>
  );
}

function ToolIcon({ tool }: { tool: DrawingTool }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (tool) {
    case "trend":
      return (
        <svg {...common}>
          <line x1="5" y1="19" x2="19" y2="5" />
          <circle cx="5" cy="19" r="2" fill="currentColor" stroke="none" />
          <circle cx="19" cy="5" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "horizontal":
      return (
        <svg {...common}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "rect":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="1" />
          <circle cx="4" cy="6" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="20" cy="18" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "fib":
      return (
        <svg {...common} strokeWidth={1.8}>
          <line x1="3" y1="5" x2="21" y2="5" stroke="#9ba0aa" />
          <line x1="3" y1="9" x2="21" y2="9" stroke="#ef5350" />
          <line x1="3" y1="13" x2="21" y2="13" stroke="#ffeb3b" />
          <line x1="3" y1="17" x2="21" y2="17" stroke="#26a69a" />
          <line x1="3" y1="21" x2="21" y2="21" stroke="#9ba0aa" />
        </svg>
      );
    case "long":
      return (
        <svg {...common} strokeWidth={1.5}>
          <rect x="4" y="4" width="16" height="8" fill="rgba(38,166,154,0.45)" stroke="#26a69a" />
          <rect x="4" y="12" width="16" height="6" fill="rgba(239,83,80,0.4)" stroke="#ef5350" />
          <path
            d="M12 21 L12 14 M9 17 L12 14 L15 17"
            stroke="#26a69a"
            strokeWidth={2}
            fill="none"
          />
        </svg>
      );
    case "short":
      return (
        <svg {...common} strokeWidth={1.5}>
          <rect x="4" y="6" width="16" height="6" fill="rgba(239,83,80,0.4)" stroke="#ef5350" />
          <rect x="4" y="12" width="16" height="8" fill="rgba(38,166,154,0.45)" stroke="#26a69a" />
          <path
            d="M12 3 L12 10 M9 7 L12 10 L15 7"
            stroke="#ef5350"
            strokeWidth={2}
            fill="none"
          />
        </svg>
      );
  }
}
