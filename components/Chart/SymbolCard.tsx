"use client";

import { SymbolInfo, WatchlistItem } from "./types";

interface SymbolCardProps {
  item: WatchlistItem;
  info: SymbolInfo | null;
}

export default function SymbolCard({ item, info }: SymbolCardProps) {
  const isPositive = info?.isPositive ?? item.isPositive;
  const color = isPositive ? "text-up" : "text-down";
  const sign = isPositive ? "+" : "";

  const symbol = info?.symbol ?? item.symbol;
  const price = info?.price ?? item.last;
  const currency = info?.currency ?? "USD";
  const change = info?.change ?? item.change;
  const changePercent = info?.changePercent ?? item.changePercent;
  const subtitle = info ? `${info.type}${info.subtype ? " · " + info.subtype : ""}` : "Spot · USD";
  const marketOpen = info?.marketOpen ?? true;

  return (
    <div className="bg-bg border-t border-border text-text p-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: item.iconColor }}
        >
          {item.iconLabel}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-strong truncate">{symbol}</div>
          <div className="text-[10px] text-text-muted">{subtitle}</div>
        </div>
      </div>

      {info?.name && (
        <div className="text-[11px] text-text-muted mb-2 truncate">
          {info.name}
          {info.exchange ? ` · ${info.exchange}` : ""}
        </div>
      )}

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-xl font-bold text-text-strong tabular-nums">{price}</span>
        <span className="text-[10px] text-text-muted">{currency}</span>
      </div>

      <div className={`flex items-center gap-1.5 text-[11px] tabular-nums ${color}`}>
        <span>
          {sign}
          {change}
        </span>
        <span>
          ({sign}
          {changePercent})
        </span>
      </div>

      <div
        className={`flex items-center gap-1 text-[10px] mt-2 ${
          marketOpen ? "text-up" : "text-text-muted"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-up" : "bg-text-muted"}`}
        />
        {marketOpen ? "Market open" : "Market closed"}
      </div>

      {info?.performance && info.performance.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-3">
          {info.performance.map((p) => (
            <div
              key={p.label}
              className={`rounded p-1.5 text-center ${
                p.isPositive ? "bg-up-bg" : "bg-down-bg"
              }`}
            >
              <div
                className={`text-[11px] font-semibold tabular-nums ${
                  p.isPositive ? "text-up" : "text-down"
                }`}
              >
                {p.value}
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
      )}

      {info?.newsHeadline && (
        <div className="bg-bg-elev rounded p-2 mt-3 text-[11px]">
          {info.newsTime && <div className="text-text-muted mb-0.5">{info.newsTime}</div>}
          <div className="text-text-strong">{info.newsHeadline}</div>
        </div>
      )}
    </div>
  );
}
