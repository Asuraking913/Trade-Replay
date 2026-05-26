import type { ApiTimeframe } from "@/lib/api";
import { SymbolInfo, Timeframe, WatchlistSection } from "./types";

export const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "D", value: "D" },
];

export const TIMEFRAME_TO_API: Record<Timeframe, ApiTimeframe> = {
  "1m": "1min",
  "5m": "5min",
  "15m": "15min",
  "1h": "1h",
  "4h": "4h",
  D: "1day",
};

export const WATCHLIST_SECTIONS: WatchlistSection[] = [
  { name: "INDICES", expanded: false, items: [] },
  { name: "STOCKS", expanded: false, items: [] },
  { name: "FUTURES", expanded: false, items: [] },
  { name: "FOREX", expanded: false, items: [] },
  {
    name: "CRYPTO",
    expanded: true,
    items: [
      {
        symbol: "BTCUSI",
        iconColor: "#f7931a",
        iconLabel: "B",
        last: "76,830",
        change: "−119",
        changePercent: "−0.15%",
        isPositive: false,
      },
      {
        symbol: "RESOLV",
        iconColor: "#6b7280",
        iconLabel: "R",
        last: "0.02886",
        change: "−0.00056",
        changePercent: "−1.90%",
        isPositive: false,
      },
      {
        symbol: "SOLUSI",
        iconColor: "#9945ff",
        iconLabel: "S",
        last: "84.47",
        change: "−0.90",
        changePercent: "−1.05%",
        isPositive: false,
      },
      {
        symbol: "BTCUSI",
        iconColor: "#f7931a",
        iconLabel: "B",
        last: "76,879.8",
        change: "−84.1",
        changePercent: "−0.11%",
        isPositive: false,
      },
      {
        symbol: "XAUTU",
        iconColor: "#ffcc33",
        iconLabel: "X",
        last: "4,487.3",
        change: "−86.1",
        changePercent: "−1.88%",
        isPositive: false,
      },
      {
        symbol: "EURUS",
        iconColor: "#003399",
        iconLabel: "E",
        last: "1.16104",
        change: "0.00038",
        changePercent: "0.03%",
        isPositive: true,
      },
      {
        symbol: "XAUUSI",
        iconColor: "#ffcc33",
        iconLabel: "X",
        last: "4,485.930",
        change: "3.815",
        changePercent: "0.09%",
        isPositive: true,
      },
      {
        symbol: "LABUSI",
        iconColor: "#22c55e",
        iconLabel: "L",
        last: "4.2752",
        change: "−0.4800",
        changePercent: "−10.09%",
        isPositive: false,
      },
      {
        symbol: "POPCA",
        iconColor: "#f59e0b",
        iconLabel: "P",
        last: "0.05569",
        change: "−0.00135",
        changePercent: "−2.37%",
        isPositive: false,
      },
    ],
  },
];

export const ACTIVE_SYMBOL: SymbolInfo = {
  symbol: "XAUUSD",
  name: "Gold Spot / U.S. Dollar",
  exchange: "OANDA",
  type: "Commodity",
  subtype: "Cfd",
  price: "4,485.930",
  currency: "USD",
  change: "+3.815",
  changePercent: "+0.09%",
  isPositive: true,
  marketOpen: true,
  newsHeadline: "Stocks fall as US bond yields rise, oil eases after latest Iran war…",
  newsTime: "1 hour ago",
  performance: [
    { label: "1W", value: "−4.94%", isPositive: false },
    { label: "1M", value: "−6.03%", isPositive: false },
    { label: "3M", value: "−9.79%", isPositive: false },
  ],
};

import { DrawingTool } from "./types";

export interface ToolDef {
  id: DrawingTool;
  label: string;
}

export const DRAWING_TOOLS: ToolDef[] = [
  { id: "trend", label: "Trend Line" },
  { id: "horizontal", label: "Horizontal Line" },
  { id: "rect", label: "Rectangle" },
  { id: "fib", label: "Fib Retracement" },
  { id: "long", label: "Long Position" },
  { id: "short", label: "Short Position" },
];

export const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
