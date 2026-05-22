"use client";

import { WATCHLIST_SECTIONS } from "./constants";
import { WatchlistItem } from "./types";

interface WatchlistProps {
  activeSymbol: string;
  onSelect: (item: WatchlistItem) => void;
}

export default function Watchlist({ activeSymbol, onSelect }: WatchlistProps) {
  const items = WATCHLIST_SECTIONS.find((s) => s.name === "CRYPTO")?.items ?? [];

  return (
    <div className="flex flex-col h-full bg-[#131722] text-[#d1d4dc]">
      <div className="px-3 py-2 border-b border-[#2a2e39] text-sm font-medium text-white">
        Watchlist
      </div>

      <div className="grid grid-cols-[1fr_70px_70px] px-3 py-1.5 text-[10px] text-[#9ba0aa] border-b border-[#2a2e39]">
        <div>Symbol</div>
        <div className="text-right">Last</div>
        <div className="text-right">Chg%</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item, i) => (
          <WatchlistRow
            key={`${item.symbol}-${i}`}
            item={item}
            active={item.symbol === activeSymbol}
            onClick={() => onSelect(item)}
          />
        ))}
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
  const color = item.isPositive ? "text-[#26a69a]" : "text-[#ef5350]";
  return (
    <button
      onClick={onClick}
      className={`w-full grid grid-cols-[1fr_70px_70px] items-center px-3 py-2 text-[11px] hover:bg-[#1e222d] ${
        active ? "bg-[#1e222d]" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: item.iconColor }}
        >
          {item.iconLabel}
        </div>
        <span className="text-white truncate">{item.symbol}</span>
      </div>
      <div className="text-right text-white font-mono tabular-nums">{item.last}</div>
      <div className={`text-right font-mono tabular-nums ${color}`}>{item.changePercent}</div>
    </button>
  );
}
