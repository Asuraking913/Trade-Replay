import { Candle } from "./types";

export function generateMockCandles(count: number = 260, startPrice: number = 3500): Candle[] {
  const candles: Candle[] = [];
  let price = startPrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const progress = i / count;
    const trend = Math.sin(progress * Math.PI * 2) * 600 + progress * 800;
    const noise = (Math.random() - 0.5) * 120;
    const target = startPrice + trend + noise;

    const open = price;
    const close = target;
    const range = Math.abs(close - open) + Math.random() * 80 + 20;
    const high = Math.max(open, close) + Math.random() * range * 0.6;
    const low = Math.min(open, close) - Math.random() * range * 0.6;
    const volume = Math.floor(Math.random() * 18000 + 2000);

    candles.push({
      time: date.toISOString().split("T")[0],
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume,
    });
    price = close;
  }
  return candles;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function computeSMA(candles: Candle[], period: number = 9): { time: string; value: number }[] {
  const out: { time: string; value: number }[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += candles[i - j].close;
    out.push({ time: candles[i].time, value: round(sum / period) });
  }
  return out;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
