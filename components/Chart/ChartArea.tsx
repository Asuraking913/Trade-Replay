"use client";

import { useEffect, useRef, useState, type RefObject, type ReactNode } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { Candle } from "./types";
import { computeSMA } from "./utils";

export interface ChartCoordinateApi {
  timeToX: (time: number) => number | null;
  xToTime: (x: number) => number | null;
  priceToY: (price: number) => number | null;
  yToPrice: (y: number) => number | null;
  width: number;
  height: number;
}

interface ChartAreaProps {
  candles: Candle[];
  visibleCount: number;
  replayActive: boolean;
  selectedIndex: number | null;
  onSelectedIndexChange: (idx: number) => void;
  apiRef?: RefObject<ChartCoordinateApi | null>;
  onRangeChange?: () => void;
  children?: ReactNode;
  cursor?: string;
}

export default function ChartArea({
  candles,
  visibleCount,
  replayActive,
  selectedIndex,
  onSelectedIndexChange,
  apiRef,
  onRangeChange,
  children,
  cursor,
}: ChartAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [lineX, setLineX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "#131722" }, textColor: "#d1d4dc" },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: "#2a2e39",
        scaleMargins: { top: 0.05, bottom: 0.25 },
      },
      timeScale: { borderColor: "#2a2e39" },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    chartRef.current = chart;

    candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    smaSeriesRef.current = chart.addSeries(LineSeries, {
      color: "#5b8def",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    if (apiRef) {
      apiRef.current = {
        timeToX: (logical: number) => {
          const c = chartRef.current;
          if (!c) return null;
          const x = c.timeScale().logicalToCoordinate(logical as never);
          return x == null ? null : x;
        },
        xToTime: (x: number) => {
          const c = chartRef.current;
          if (!c) return null;
          const l = c.timeScale().coordinateToLogical(x);
          return l == null ? null : Number(l);
        },
        priceToY: (price: number) => {
          const s = candleSeriesRef.current;
          if (!s) return null;
          const y = s.priceToCoordinate(price);
          return y == null ? null : y;
        },
        yToPrice: (y: number) => {
          const s = candleSeriesRef.current;
          if (!s) return null;
          const p = s.coordinateToPrice(y);
          return p == null ? null : Number(p);
        },
        width: containerRef.current?.clientWidth ?? 0,
        height: containerRef.current?.clientHeight ?? 0,
      };
    }

    const notifyRange = () => {
      if (apiRef?.current && containerRef.current) {
        apiRef.current.width = containerRef.current.clientWidth;
        apiRef.current.height = containerRef.current.clientHeight;
      }
      onRangeChange?.();
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(notifyRange);
    chart.priceScale("right").applyOptions({});

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
      notifyRange();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(notifyRange);
      chart.remove();
      chartRef.current = null;
      if (apiRef) apiRef.current = null;
    };
  }, [apiRef, onRangeChange]);

  useEffect(() => {
    if (!candleSeriesRef.current || !smaSeriesRef.current || !volumeSeriesRef.current) return;

    const slice = candles.slice(0, Math.max(1, visibleCount));

    candleSeriesRef.current.setData(
      slice.map((c) => ({
        time: (new Date(c.time).getTime() / 1000) as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    );

    smaSeriesRef.current.setData(
      computeSMA(slice, 9).map((p) => ({
        time: (new Date(p.time).getTime() / 1000) as UTCTimestamp,
        value: p.value,
      }))
    );

    volumeSeriesRef.current.setData(
      slice.map((c) => ({
        time: (new Date(c.time).getTime() / 1000) as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)",
      }))
    );

    onRangeChange?.();
  }, [candles, visibleCount, onRangeChange]);

  useEffect(() => {
    if (!replayActive) {
      setLineX(null);
      return;
    }
    if (selectedIndex == null) return;
    const chart = chartRef.current;
    if (!chart) return;
    const candle = candles[selectedIndex];
    if (!candle) return;
    const x = chart
      .timeScale()
      .timeToCoordinate((new Date(candle.time).getTime() / 1000) as UTCTimestamp);
    if (x != null) setLineX(x);
  }, [replayActive, selectedIndex, candles, visibleCount]);

  useEffect(() => {
    if (!replayActive) return;
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, replayActive]);

  const updateFromClientX = (clientX: number) => {
    const container = containerRef.current;
    const chart = chartRef.current;
    if (!container || !chart) return;
    const rect = container.getBoundingClientRect();
    const localX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setLineX(localX);
    const logical = chart.timeScale().coordinateToLogical(localX);
    if (logical == null) return;
    const idx = Math.max(0, Math.min(candles.length - 1, Math.round(logical)));
    onSelectedIndexChange(idx);
  };

  const dimRightX = lineX ?? 0;
  const containerWidth = containerRef.current?.clientWidth ?? 0;

  return (
    <div className="relative flex-1 bg-[#131722] select-none" style={cursor ? { cursor } : undefined}>
      <div ref={containerRef} className="absolute inset-0" />

      {children}

      {replayActive && lineX != null && (
        <>
          <div
            className="absolute top-0 bottom-0 bg-[#131722]/60 pointer-events-none z-10"
            style={{ left: dimRightX, width: Math.max(0, containerWidth - dimRightX) }}
          />
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{ left: dimRightX - 6, width: 12, cursor: "ew-resize" }}
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging(true);
              updateFromClientX(e.clientX);
            }}
          >
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#2962ff]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 rounded bg-[#2962ff] flex items-center justify-center shadow-lg">
              <svg width="6" height="10" viewBox="0 0 6 10" fill="white">
                <rect x="1" y="0" width="1" height="10" />
                <rect x="4" y="0" width="1" height="10" />
              </svg>
            </div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#2962ff] text-white text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
              Drag to start
            </div>
          </div>
        </>
      )}
    </div>
  );
}
