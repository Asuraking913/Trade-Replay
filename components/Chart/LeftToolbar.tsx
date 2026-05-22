"use client";

import { DRAWING_TOOLS } from "./constants";
import { DrawingTool } from "./types";

interface LeftToolbarProps {
  activeTool: DrawingTool | null;
  onSelectTool: (tool: DrawingTool | null) => void;
  onClearAll: () => void;
}

export default function LeftToolbar({ activeTool, onSelectTool, onClearAll }: LeftToolbarProps) {
  return (
    <div className="flex flex-col w-10 bg-[#131722] border-r border-[#2a2e39] py-2 gap-0.5 items-center">
      {DRAWING_TOOLS.map((tool) => {
        const active = activeTool === tool.id;
        return (
          <button
            key={tool.id}
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
        );
      })}

      <div className="w-6 h-px bg-[#2a2e39] my-1" />

      <button
        onClick={onClearAll}
        title="Clear drawings"
        className="w-9 h-9 flex items-center justify-center text-[#9ba0aa] hover:text-white hover:bg-[#1e222d] rounded"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  );
}

function ToolIcon({ tool }: { tool: DrawingTool }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (tool) {
    case "trend":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="20" y2="4" />
          <circle cx="4" cy="20" r="1.5" fill="currentColor" />
          <circle cx="20" cy="4" r="1.5" fill="currentColor" />
        </svg>
      );
    case "horizontal":
      return (
        <svg {...common}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case "rect":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" />
        </svg>
      );
    case "fib":
      return (
        <svg {...common}>
          <line x1="3" y1="5" x2="21" y2="5" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="3" y1="14" x2="21" y2="14" />
          <line x1="3" y1="19" x2="21" y2="19" />
        </svg>
      );
    case "long":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="6" fill="rgba(38,166,154,0.3)" />
          <rect x="5" y="14" width="14" height="6" fill="rgba(239,83,80,0.3)" />
          <line x1="5" y1="12" x2="19" y2="12" strokeDasharray="2 2" />
        </svg>
      );
    case "short":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="6" fill="rgba(239,83,80,0.3)" />
          <rect x="5" y="14" width="14" height="6" fill="rgba(38,166,154,0.3)" />
          <line x1="5" y1="12" x2="19" y2="12" strokeDasharray="2 2" />
        </svg>
      );
  }
}
