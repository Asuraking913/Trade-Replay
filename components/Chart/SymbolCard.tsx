"use client";

import { WatchlistItem } from "./types";

interface SymbolCardProps {
  item: WatchlistItem;
}

export default function SymbolCard({ item }: SymbolCardProps) {
  const color = item.isPositive ? "text-[#26a69a]" : "text-[#ef5350]";
  const sign = item.isPositive ? "+" : "";

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] text-[#d1d4dc] p-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: item.iconColor }}
        >
          {item.iconLabel}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{item.symbol}</div>
          <div className="text-[10px] text-[#9ba0aa]">Spot · USD</div>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-xl font-bold text-white tabular-nums">{item.last}</span>
        <span className="text-[10px] text-[#9ba0aa]">USD</span>
      </div>

      <div className={`flex items-center gap-1.5 text-[11px] tabular-nums ${color}`}>
        <span>{sign}{item.change}</span>
        <span>({sign}{item.changePercent})</span>
      </div>

      <div className="flex items-center gap-1 text-[10px] text-[#26a69a] mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#26a69a]" />
        Market open
      </div>
    </div>
  );
}
