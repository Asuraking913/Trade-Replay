import { ReportPoint, ReportsData, TimeGranularity } from "./types";

export const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

export const GRANULARITIES: { key: TimeGranularity; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

// --- Mock series ---------------------------------------------------------
// Structured exactly like a future `fetchReports()` response so the API can
// drop in later without touching the components. Values are illustrative.

const DAY_SERIES: ReportPoint[] = [
  { time: "2024-05-28", pnl: -300, winRate: 0.18 },
  { time: "2024-05-30", pnl: -1800, winRate: 0.22 },
  { time: "2024-06-01", pnl: 1200, winRate: 0.42 },
  { time: "2024-06-03", pnl: 2600, winRate: 0.5 },
  { time: "2024-06-05", pnl: 2400, winRate: 0.52 },
  { time: "2024-06-07", pnl: 3100, winRate: 0.49 },
  { time: "2024-06-09", pnl: 2900, winRate: 0.55 },
  { time: "2024-06-11", pnl: 1500, winRate: 0.47 },
  { time: "2024-06-13", pnl: 2200, winRate: 0.44 },
  { time: "2024-06-15", pnl: 3300, winRate: 0.46 },
  { time: "2024-06-17", pnl: 3600, winRate: 0.45 },
];

const WEEK_SERIES: ReportPoint[] = [
  { time: "2024-04-01", pnl: -900, winRate: 0.3 },
  { time: "2024-04-08", pnl: 400, winRate: 0.38 },
  { time: "2024-04-15", pnl: 2100, winRate: 0.44 },
  { time: "2024-04-22", pnl: 1700, winRate: 0.41 },
  { time: "2024-04-29", pnl: 3200, winRate: 0.5 },
  { time: "2024-05-06", pnl: 4100, winRate: 0.53 },
  { time: "2024-05-13", pnl: 3800, winRate: 0.48 },
  { time: "2024-05-20", pnl: 5200, winRate: 0.56 },
];

const MONTH_SERIES: ReportPoint[] = [
  { time: "2024-01-01", pnl: -2100, winRate: 0.28 },
  { time: "2024-02-01", pnl: 1400, winRate: 0.4 },
  { time: "2024-03-01", pnl: 3800, winRate: 0.47 },
  { time: "2024-04-01", pnl: 5600, winRate: 0.52 },
  { time: "2024-05-01", pnl: 7100, winRate: 0.55 },
  { time: "2024-06-01", pnl: 8708, winRate: 0.58 },
];

export const MOCK_REPORTS: ReportsData = {
  accountLabel: "Demo Account",
  dateRangeLabel: "May 21, 2024 – Jun 21, 2024",
  reportForLabel: "Today (Jun 26, 2024)",
  series: {
    day: DAY_SERIES,
    week: WEEK_SERIES,
    month: MONTH_SERIES,
  },
  cards: [
    {
      title: "Overall Performance",
      stats: [
        { label: "Total P&L", value: "$8,708.83", tone: "up" },
        { label: "Total Number of Trades", value: "116" },
        { label: "Average Trade P&L", value: "$26.96", tone: "up" },
        { label: "Trade Expectancy", value: "$75.73", tone: "up" },
        { label: "Profit Factor", value: "1.53" },
      ],
      insight:
        "Your trading results show a solid profit with consistent trade expectancy.",
    },
    {
      title: "Trade Outcomes",
      stats: [
        { label: "Number of Winning Trades", value: "45", tone: "up" },
        { label: "Number of Losing Trades", value: "70", tone: "down" },
        { label: "Number of Break Even Trades", value: "1" },
        { label: "Largest Profit", value: "$5,160.00", tone: "up" },
        { label: "Largest Loss", value: "-$2,065.11", tone: "down" },
        { label: "Max Consecutive Wins", value: "6" },
        { label: "Max Consecutive Losses", value: "16" },
      ],
      insight:
        "You've had more losing trades than winning ones, but your biggest wins and longest winning streaks show strong potential.",
    },
    {
      title: "Trading Activity",
      stats: [
        { label: "Average Daily Volume", value: "19.11" },
        { label: "Total Trading Days", value: "99" },
        { label: "Logged Days", value: "0" },
        { label: "Open Trades", value: "11" },
      ],
      insight:
        "You've been actively trading with a daily average volume of 19.11 over 99 trading days, with 11 trades currently open.",
    },
  ],
};

export const DEFAULT_GRANULARITY: TimeGranularity = "day";
