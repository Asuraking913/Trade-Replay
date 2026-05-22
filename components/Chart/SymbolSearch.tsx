"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WATCHLIST_SECTIONS } from "./constants";
import { WatchlistItem } from "./types";

interface SymbolSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: WatchlistItem) => void;
}

export default function SymbolSearch({ open, onClose, onSelect }: SymbolSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems = useMemo(
    () => WATCHLIST_SECTIONS.flatMap((s) => s.items),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((i) => i.symbol.toLowerCase().includes(q));
  }, [query, allItems]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[480px] max-h-[480px] bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#2a2e39]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9ba0aa]">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pairs..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#9ba0aa]"
          />
          <button
            onClick={onClose}
            className="text-[10px] text-[#9ba0aa] hover:text-white bg-[#2a2e39] px-1.5 py-0.5 rounded"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#9ba0aa]">No pairs found</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={`${item.symbol}-${i}`}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#2a2e39]"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: item.iconColor }}
                >
                  {item.iconLabel}
                </div>
                <span className="text-sm text-white">{item.symbol}</span>
                <div className="flex-1" />
                <span className="text-xs text-white font-mono tabular-nums">{item.last}</span>
                <span
                  className={`text-xs font-mono tabular-nums w-16 text-right ${
                    item.isPositive ? "text-[#26a69a]" : "text-[#ef5350]"
                  }`}
                >
                  {item.changePercent}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
