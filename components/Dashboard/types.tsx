export type TimeGranularity = "day" | "week" | "month";

// One point on the reports time series. `pnl` is cumulative/period net P&L
// (left axis); `winRate` is win-rate percent 0..1 (right axis).
export interface ReportPoint {
  time: string; // ISO date, e.g. "2024-05-28"
  pnl: number;
  winRate: number;
}

export interface StatItem {
  label: string;
  value: string;
  // Optional tone for coloured values (profit green / loss red).
  tone?: "up" | "down";
}

export interface SummaryCard {
  title: string;
  stats: StatItem[];
  insight: string;
}

export interface ReportsData {
  accountLabel: string;
  dateRangeLabel: string;
  reportForLabel: string;
  series: Record<TimeGranularity, ReportPoint[]>;
  cards: SummaryCard[];
}
