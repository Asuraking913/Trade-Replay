import {
  Candle,
  SymbolInfo,
  WatchlistItem,
  WatchlistSection,
} from "@/components/Chart/types";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export type ApiTimeframe = "1min" | "5min" | "15min" | "1h" | "4h" | "1day";

interface RawCandle {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
}

interface RawCandlesResponse {
  symbol: string;
  timeframe: string;
  candles: RawCandle[];
  hasMore: boolean;
  oldestTime: string | null;
}

export interface CandlesPage {
  candles: Candle[];
  hasMore: boolean;
  oldestTime: string | null;
}

const SYMBOL_ICONS: Record<string, { color: string; label: string }> = {
  "BTC/USD": { color: "#f7931a", label: "B" },
  "ETH/USD": { color: "#627eea", label: "E" },
  "SOL/USD": { color: "#9945ff", label: "S" },
  "BNB/USD": { color: "#f3ba2f", label: "B" },
  "XAU/USD": { color: "#ffcc33", label: "X" },
  "EUR/USD": { color: "#003399", label: "E" },
  "GBP/USD": { color: "#c8102e", label: "G" },
  "USD/JPY": { color: "#bc002d", label: "J" },
};

function applyIcon(item: WatchlistItem): WatchlistItem {
  const override = SYMBOL_ICONS[item.symbol];
  if (!override) return item;
  return { ...item, iconColor: override.color, iconLabel: override.label };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchCandles(
  symbol: string,
  timeframe: ApiTimeframe = "1day",
  opts: { before?: string; limit?: number } = {}
): Promise<CandlesPage> {
  const params = new URLSearchParams({ timeframe });
  if (opts.before) params.set("before", opts.before);
  if (opts.limit != null) params.set("limit", String(opts.limit));
  const url = `${BASE_URL}/candles/${symbol}/?${params.toString()}`;
  const raw = await getJson<RawCandlesResponse>(url);
  return {
    candles: raw.candles.map((r) => ({
      time: r.time,
      open: parseFloat(r.open),
      high: parseFloat(r.high),
      low: parseFloat(r.low),
      close: parseFloat(r.close),
      volume: r.volume,
    })),
    hasMore: raw.hasMore,
    oldestTime: raw.oldestTime,
  };
}

export async function fetchSymbolInfo(symbol: string): Promise<SymbolInfo> {
  return getJson<SymbolInfo>(`${BASE_URL}/symbols/${symbol}/`);
}

export async function fetchWatchlist(): Promise<WatchlistSection[]> {
  const raw = await getJson<WatchlistSection[]>(`${BASE_URL}/watchlist/`);
  return raw.map((s) => ({ ...s, items: s.items.map(applyIcon) }));
}

export async function searchSymbols(q: string): Promise<WatchlistItem[]> {
  const raw = await getJson<WatchlistItem[]>(
    `${BASE_URL}/search/?q=${encodeURIComponent(q)}`
  );
  return raw.map(applyIcon);
}
