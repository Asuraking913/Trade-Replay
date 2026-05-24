import {
  Candle,
  SymbolInfo,
  WatchlistItem,
  WatchlistSection,
} from "@/components/Chart/types";

const BASE_URL = "http://127.0.0.1:8000/api";

export type ApiTimeframe = "1h" | "4h" | "1day";

interface RawCandle {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchCandles(
  symbol: string,
  timeframe: ApiTimeframe = "1day",
  limit = 300
): Promise<Candle[]> {
  const url = `${BASE_URL}/candles/${symbol}/?timeframe=${timeframe}&limit=${limit}`;
  const raw = await getJson<RawCandle[]>(url);
  return raw.map((r) => ({
    time: r.time,
    open: parseFloat(r.open),
    high: parseFloat(r.high),
    low: parseFloat(r.low),
    close: parseFloat(r.close),
    volume: r.volume,
  }));
}

export async function fetchSymbolInfo(symbol: string): Promise<SymbolInfo> {
  return getJson<SymbolInfo>(`${BASE_URL}/symbols/${symbol}/`);
}

export async function fetchWatchlist(): Promise<WatchlistSection[]> {
  return getJson<WatchlistSection[]>(`${BASE_URL}/watchlist/`);
}

export async function searchSymbols(q: string): Promise<WatchlistItem[]> {
  return getJson<WatchlistItem[]>(
    `${BASE_URL}/search/?q=${encodeURIComponent(q)}`
  );
}
