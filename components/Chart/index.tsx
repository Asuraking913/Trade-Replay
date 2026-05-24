"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import ChartArea, { type ChartCoordinateApi } from "./ChartArea";
import Watchlist from "./Watchlist";
import SymbolCard from "./SymbolCard";
import SymbolSearch from "./SymbolSearch";
import ReplayBar from "./ReplayBar";
import LeftToolbar from "./LeftToolbar";
import DrawingOverlay from "./DrawingOverlay";
import { TIMEFRAME_TO_API } from "./constants";
import {
  Candle,
  Drawing,
  DrawingTool,
  LineStyle,
  SymbolInfo,
  Timeframe,
  WatchlistItem,
  WatchlistSection,
} from "./types";
import { fetchCandles, fetchSymbolInfo, fetchWatchlist } from "@/lib/api";

const FALLBACK_ITEM: WatchlistItem = {
  symbol: "BTC/USD",
  iconColor: "#f7931a",
  iconLabel: "B",
  last: "—",
  change: "0",
  changePercent: "0%",
  isPositive: true,
};

type ReplayState = "idle" | "selecting" | "playing";

export default function Chart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("D");
  const [sections, setSections] = useState<WatchlistSection[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<WatchlistItem>(FALLBACK_ITEM);
  const [symbolInfo, setSymbolInfo] = useState<SymbolInfo | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [candleError, setCandleError] = useState<string | null>(null);

  const [replayState, setReplayState] = useState<ReplayState>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [speed, setSpeed] = useState(1);

  const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [redrawTick, setRedrawTick] = useState(0);
  const [trendStyle, setTrendStyle] = useState<LineStyle>({ pattern: "solid", width: 2 });
  const [horizontalStyle, setHorizontalStyle] = useState<LineStyle>({
    pattern: "dashed",
    width: 2,
  });

  const apiRef = useRef<ChartCoordinateApi | null>(null);

  const bumpRedraw = useCallback(() => {
    setRedrawTick((t) => t + 1);
  }, []);

  // Watchlist on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchWatchlist();
        if (cancelled) return;
        setSections(data);
        const first = data.flatMap((s) => s.items)[0];
        if (first) setActiveItem(first);
      } catch (err) {
        console.error("Failed to load watchlist", err);
      } finally {
        if (!cancelled) setWatchlistLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Candles whenever active symbol or timeframe changes
  useEffect(() => {
    let cancelled = false;
    setCandleError(null);
    (async () => {
      try {
        const data = await fetchCandles(activeItem.symbol, TIMEFRAME_TO_API[timeframe], 5000);
        if (cancelled) return;
        setCandles(data);
        setVisibleCount(data.length);
      } catch (err) {
        if (!cancelled)
          setCandleError(err instanceof Error ? err.message : "Failed to load candles");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeItem.symbol, timeframe]);

  // Symbol info whenever active symbol changes
  useEffect(() => {
    let cancelled = false;
    setSymbolInfo(null);
    (async () => {
      try {
        const data = await fetchSymbolInfo(activeItem.symbol);
        if (!cancelled) setSymbolInfo(data);
      } catch (err) {
        console.error("Failed to load symbol info", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeItem.symbol]);

  const handleStyleChange = useCallback(
    (tool: "trend" | "horizontal", style: LineStyle) => {
      if (tool === "trend") setTrendStyle(style);
      else setHorizontalStyle(style);
      setDrawings((ds) =>
        ds.map((d) =>
          d.id === selectedDrawingId &&
          (d.kind === "trend" || d.kind === "horizontal") &&
          d.kind === tool
            ? ({ ...d, style } as Drawing)
            : d
        )
      );
    },
    [selectedDrawingId]
  );

  useEffect(() => {
    if (replayState !== "playing") return;
    const id = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= candles.length) {
          setReplayState("idle");
          setSelectedIndex(null);
          return candles.length;
        }
        return c + 1;
      });
    }, Math.max(40, 240 / speed));
    return () => clearInterval(id);
  }, [replayState, speed, candles.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedDrawingId) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        setDrawings((d) => d.filter((x) => x.id !== selectedDrawingId));
        setSelectedDrawingId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedDrawingId]);

  const handleReplayClick = () => {
    if (candles.length === 0) return;
    if (replayState === "idle") {
      setReplayState("selecting");
      setSelectedIndex(Math.floor(candles.length * 0.6));
      setVisibleCount(candles.length);
    } else {
      setReplayState("idle");
      setSelectedIndex(null);
      setVisibleCount(candles.length);
    }
  };

  const handlePlayPause = () => {
    if (replayState === "playing") {
      setReplayState("selecting");
      return;
    }
    if (selectedIndex != null) {
      setVisibleCount(selectedIndex + 1);
      setReplayState("playing");
    }
  };

  const handleExitReplay = () => {
    setReplayState("idle");
    setSelectedIndex(null);
    setVisibleCount(candles.length);
  };

  const replayActive = replayState !== "idle";
  const effectiveVisibleCount =
    replayState === "playing" ? visibleCount : candles.length;

  const headerSymbol = useMemo(() => activeItem.symbol, [activeItem]);

  return (
    <div className="flex flex-col w-full h-screen bg-bg text-text overflow-hidden">
      <Header
        symbol={headerSymbol}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        replayActive={replayActive}
        onReplayClick={handleReplayClick}
        onSearchClick={() => setSearchOpen(true)}
      />
      <div className="flex flex-1 min-h-0">
        <LeftToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onClearAll={() => {
            setDrawings([]);
            setSelectedDrawingId(null);
          }}
          trendStyle={trendStyle}
          horizontalStyle={horizontalStyle}
          onStyleChange={handleStyleChange}
        />
        <div className="relative flex-1 flex">
          <ChartArea
            candles={candles}
            visibleCount={effectiveVisibleCount}
            replayActive={replayState === "selecting"}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={setSelectedIndex}
            apiRef={apiRef}
            onRangeChange={bumpRedraw}
            cursor={activeTool ? "crosshair" : undefined}
          >
            <DrawingOverlay
              apiRef={apiRef}
              drawings={drawings}
              activeTool={activeTool}
              selectedId={selectedDrawingId}
              trendStyle={trendStyle}
              horizontalStyle={horizontalStyle}
              onAdd={(d) => setDrawings((ds) => [...ds, d])}
              onUpdate={(d) =>
                setDrawings((ds) => ds.map((x) => (x.id === d.id ? d : x)))
              }
              onSelect={setSelectedDrawingId}
              onToolFinished={() => setActiveTool(null)}
              redrawTick={redrawTick}
            />
          </ChartArea>
          {candleError && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-down-bg border border-down text-down text-xs px-3 py-1.5 rounded">
              {candleError}
            </div>
          )}
          {replayActive && (
            <ReplayBar
              isPlaying={replayState === "playing"}
              onPlayPause={handlePlayPause}
              onStop={handleExitReplay}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          )}
        </div>
        <div className="flex flex-col w-70 border-l border-border">
          <div className="flex-1 min-h-0">
            <Watchlist
              sections={sections}
              activeSymbol={activeItem.symbol}
              onSelect={setActiveItem}
              loading={watchlistLoading}
            />
          </div>
          <SymbolCard item={activeItem} info={symbolInfo} />
        </div>
      </div>

      <SymbolSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={setActiveItem}
      />
    </div>
  );
}
