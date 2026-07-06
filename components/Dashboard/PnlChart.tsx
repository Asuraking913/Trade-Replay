"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { ReportPoint } from "./types";
import { useTheme } from "@/lib/theme";

// `pnl` = accent line, `win` = up/green line. In dark mode the background is
// transparent so the chart blends into the glass panel over the navy backdrop.
const PALETTES = {
  dark: {
    background: "rgba(0, 0, 0, 0)",
    text: "#9ba0aa",
    grid: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.12)",
    pnl: "#5b8def",
    win: "#26a69a",
  },
  light: {
    background: "#ffffff",
    text: "#6b7280",
    grid: "#e6e9ef",
    border: "#d8dde5",
    pnl: "#2962ff",
    win: "#089981",
  },
} as const;

interface PnlChartProps {
  data: ReportPoint[];
}

export default function PnlChart({ data }: PnlChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const pnlSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const winSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const { theme } = useTheme();
  const palette = PALETTES[theme];

  // Create the chart once.
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: palette.background },
        textColor: palette.text,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: { borderColor: palette.border },
      leftPriceScale: { borderColor: palette.border, visible: true },
      timeScale: { borderColor: palette.border, fixLeftEdge: true, fixRightEdge: true },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      handleScroll: false,
      handleScale: false,
    });
    chartRef.current = chart;

    // Net P&L on the left axis.
    pnlSeriesRef.current = chart.addSeries(LineSeries, {
      color: palette.pnl,
      lineWidth: 2,
      priceScaleId: "left",
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerRadius: 3,
    });

    // Win rate % on the right axis, dashed like the reference.
    winSeriesRef.current = chart.addSeries(LineSeries, {
      color: palette.win,
      lineWidth: 2,
      priceScaleId: "right",
      priceLineVisible: false,
      lastValueVisible: false,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerRadius: 3,
    });

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
    // Created once; palette changes are handled by the theme effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push data whenever it changes (granularity toggle).
  useEffect(() => {
    if (!pnlSeriesRef.current || !winSeriesRef.current || !chartRef.current) return;

    pnlSeriesRef.current.setData(
      data.map((p) => ({
        time: (new Date(p.time).getTime() / 1000) as UTCTimestamp,
        value: p.pnl,
      }))
    );
    winSeriesRef.current.setData(
      data.map((p) => ({
        time: (new Date(p.time).getTime() / 1000) as UTCTimestamp,
        value: p.winRate,
      }))
    );
    chartRef.current.timeScale().fitContent();
  }, [data]);

  // React to theme toggle.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.applyOptions({
      layout: { background: { color: palette.background }, textColor: palette.text },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: { borderColor: palette.border },
      leftPriceScale: { borderColor: palette.border },
      timeScale: { borderColor: palette.border },
    });
    pnlSeriesRef.current?.applyOptions({ color: palette.pnl });
    winSeriesRef.current?.applyOptions({ color: palette.win });
  }, [palette]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
