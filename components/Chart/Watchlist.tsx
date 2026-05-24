"use client";

import { useEffect, useState } from "react";
import { WatchlistItem, WatchlistSection } from "./types";

interface WatchlistProps {
  sections: WatchlistSection[];
  activeSymbol: string;
  onSelect: (item: WatchlistItem) => void;
  loading?: boolean;
}

export default function Watchlist({
  sections,
  activeSymbol,
  onSelect,
  loading,
}: WatchlistProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const s of sections) {
        if (next[s.name] === undefined) next[s.name] = s.expanded;
      }
      return next;
    });
  }, [sections]);

  return (
    <div className="flex flex-col h-full bg-bg text-text">
      <div className="px-3 py-2 border-b border-border text-sm font-medium text-text-strong">
        Watchlist
      </div>

      <div className="grid grid-cols-[1fr_70px_70px] px-3 py-1.5 text-[10px] text-text-muted border-b border-border">
        <div>Symbol</div>
        <div className="text-right">Last</div>
        <div className="text-right">Chg%</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-3 py-4 text-[11px] text-text-muted">Loading…</div>
        )}
        {!loading && sections.length === 0 && (
          <div className="px-3 py-4 text-[11px] text-text-muted">No symbols</div>
        )}
        {sections.map((section) => {
          const open = expanded[section.name] ?? section.expanded;
          return (
            <div key={section.name}>
              <button
                onClick={() =>
                  setExpanded((p) => ({ ...p, [section.name]: !open }))
                }
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-text-muted hover:bg-bg-elev uppercase tracking-wide"
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ transform: open ? "rotate(90deg)" : "none" }}
                >
                  <path d="M8 5l8 7-8 7V5z" />
                </svg>
                {section.name}
              </button>
              {open &&
                section.items.map((item, i) => (
                  <WatchlistRow
                    key={`${section.name}-${item.symbol}-${i}`}
                    item={item}
                    active={item.symbol === activeSymbol}
                    onClick={() => onSelect(item)}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WatchlistRow({
  item,
  active,
  onClick,
}: {
  item: WatchlistItem;
  active: boolean;
  onClick: () => void;
}) {
  const color = item.isPositive ? "text-up" : "text-down";
  return (
    <button
      onClick={onClick}
      className={`w-full grid grid-cols-[1fr_70px_70px] items-center px-3 py-2 text-[11px] hover:bg-bg-elev ${
        active ? "bg-bg-elev" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: item.iconColor }}
        >
          {item.iconLabel}
        </div>
        <span className="text-text-strong truncate">{item.symbol}</span>
      </div>
      <div className="text-right text-text-strong font-mono tabular-nums">{item.last}</div>
      <div className={`text-right font-mono tabular-nums ${color}`}>{item.changePercent}</div>
    </button>
  );
}
