export type Timeframe = "3m" | "5m" | "15m" | "30m" | "1h" | "4h" | "D";

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  symbol: string;
  iconColor: string;
  iconLabel: string;
  last: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export interface WatchlistSection {
  name: string;
  expanded: boolean;
  items: WatchlistItem[];
}

export interface PerformanceMetric {
  label: string;
  value: string;
  isPositive: boolean;
}

export type DrawingTool =
  | "trend"
  | "horizontal"
  | "rect"
  | "fib"
  | "long"
  | "short";

export interface Anchor {
  time: number;
  price: number;
}

interface DrawingBase {
  id: string;
  kind: DrawingTool;
}

export interface TrendDrawing extends DrawingBase {
  kind: "trend";
  a: Anchor;
  b: Anchor;
}

export interface HorizontalDrawing extends DrawingBase {
  kind: "horizontal";
  price: number;
}

export interface RectDrawing extends DrawingBase {
  kind: "rect";
  a: Anchor;
  b: Anchor;
}

export interface FibDrawing extends DrawingBase {
  kind: "fib";
  a: Anchor;
  b: Anchor;
}

export interface PositionDrawing extends DrawingBase {
  kind: "long" | "short";
  a: Anchor;
  b: Anchor;
  entry: number;
  target: number;
  stop: number;
}

export type Drawing =
  | TrendDrawing
  | HorizontalDrawing
  | RectDrawing
  | FibDrawing
  | PositionDrawing;

export interface SymbolInfo {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  subtype: string;
  price: string;
  currency: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  marketOpen: boolean;
  newsHeadline: string;
  newsTime: string;
  performance: PerformanceMetric[];
}
