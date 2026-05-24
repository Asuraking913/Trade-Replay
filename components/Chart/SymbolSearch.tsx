"use client";

import { useEffect, useRef, useState } from "react";
import { WatchlistItem } from "./types";
import { searchSymbols } from "@/lib/api";

interface SymbolSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: WatchlistItem) => void;
}

export default function SymbolSearch({ open, onClose, onSelect }: SymbolSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const data = await searchSymbols(query.trim());
        if (!cancelled) {
          setResults(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, open]);

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
        className="w-[480px] max-h-[480px] bg-bg-elev border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pairs..."
            className="flex-1 bg-transparent text-sm text-text-strong outline-none placeholder:text-text-muted"
          />
          <button
            onClick={onClose}
            className="text-[10px] text-text-muted hover:text-text-strong bg-bg-hover px-1.5 py-0.5 rounded"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="px-3 py-6 text-center text-xs text-down">{error}</div>
          ) : loading && results.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-text-muted">Loading…</div>
          ) : results.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-text-muted">No pairs found</div>
          ) : (
            results.map((item, i) => (
              <button
                key={`${item.symbol}-${i}`}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-bg-hover"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: item.iconColor }}
                >
                  {item.iconLabel}
                </div>
                <span className="text-sm text-text-strong">{item.symbol}</span>
                <div className="flex-1" />
                <span className="text-xs text-text-strong font-mono tabular-nums">{item.last}</span>
                <span
                  className={`text-xs font-mono tabular-nums w-16 text-right ${
                    item.isPositive ? "text-up" : "text-down"
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
