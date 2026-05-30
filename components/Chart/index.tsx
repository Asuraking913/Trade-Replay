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

type ReplayState = "idle" | "selecting" | "playing" | "paused";

export default function Chart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("D");
  const [sections, setSections] = useState<WatchlistSection[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<WatchlistItem>(FALLBACK_ITEM);
  const [symbolInfo, setSymbolInfo] = useState<SymbolInfo | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [candleError, setCandleError] = useState<string | null>(null);
  const [candlesLoading, setCandlesLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [oldestTime, setOldestTime] = useState<string | null>(null);
  const loadingOlderRef = useRef(false);

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

  const [toolsOpen, setToolsOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

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
        const cryptoSection = data.find((s) => s.name.toUpperCase() === "CRYPTO");
        const first =
          cryptoSection?.items[0] ?? data.flatMap((s) => s.items)[0];
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
    setCandlesLoading(true);
    (async () => {
      try {
        const page = await fetchCandles(activeItem.symbol, TIMEFRAME_TO_API[timeframe]);
        if (cancelled) return;
        setCandles(page.candles);
        setVisibleCount(page.candles.length);
        setHasMore(page.hasMore);
        setOldestTime(page.oldestTime);
        setReplayState("idle");
        setSelectedIndex(null);
      } catch (err) {
        if (!cancelled)
          setCandleError(err instanceof Error ? err.message : "Failed to load candles");
      } finally {
        if (!cancelled) setCandlesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeItem.symbol, timeframe]);

  // Load an older chunk of history (infinite scroll-back).
  const loadOlder = useCallback(async () => {
    if (loadingOlderRef.current || !hasMore || !oldestTime) return;
    loadingOlderRef.current = true;
    setCandlesLoading(true);
    try {
      const page = await fetchCandles(activeItem.symbol, TIMEFRAME_TO_API[timeframe], {
        before: oldestTime,
        limit: 1000,
      });
      if (page.candles.length > 0) {
        setCandles((prev) => {
          // Guard against duplicate prepends if the same chunk arrives twice.
          const existingFirst = prev[0]?.time;
          const incoming = page.candles;
          if (incoming[incoming.length - 1]?.time === existingFirst) {
            incoming.pop();
          }
          const added = incoming.length;
          setVisibleCount((vc) => vc + added);
          return [...incoming, ...prev];
        });
      }
      setHasMore(page.hasMore);
      setOldestTime(page.oldestTime);
    } catch {
      // ignore scroll-back errors; user can retry by scrolling
    } finally {
      loadingOlderRef.current = false;
      setCandlesLoading(false);
    }
  }, [activeItem.symbol, timeframe, hasMore, oldestTime]);

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
      // Default the replay line ~80% across the currently visible range.
      // xToTime returns a Unix-second timestamp; map it to the nearest candle index.
      const timeToIndex = (t: number) => {
        let best = 0;
        let bestDiff = Infinity;
        for (let i = 0; i < candles.length; i++) {
          const ct = new Date(candles[i].time).getTime() / 1000;
          const diff = Math.abs(ct - t);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = i;
          }
        }
        return best;
      };
      const visible = apiRef.current
        ? (() => {
            const w = apiRef.current!.width;
            const left = apiRef.current!.xToTime(0);
            const right = apiRef.current!.xToTime(w);
            if (left == null || right == null) return null;
            return { left: timeToIndex(left), right: timeToIndex(right) };
          })()
        : null;
      const defaultIdx = visible
        ? Math.round(visible.left + (visible.right - visible.left) * 0.8)
        : Math.max(0, candles.length - 100);
      setSelectedIndex(Math.max(0, Math.min(candles.length - 1, defaultIdx)));
      setVisibleCount(candles.length);
    } else {
      setReplayState("idle");
      setSelectedIndex(null);
      setVisibleCount(candles.length);
    }
  };

  const handlePlayPause = () => {
    if (replayState === "playing") {
      setReplayState("paused");
      return;
    }
    if (replayState === "paused") {
      setReplayState("playing");
      return;
    }
    if (selectedIndex != null) {
      setVisibleCount(selectedIndex + 1);
      setReplayState("playing");
    }
  };

  // Clip the chart to the selected start and freeze (paused), without playing.
  const handleClip = () => {
    if (replayState !== "selecting" || selectedIndex == null) return;
    setVisibleCount(selectedIndex + 1);
    setReplayState("paused");
  };

  const handleExitReplay = () => {
    setReplayState("idle");
    setSelectedIndex(null);
    setVisibleCount(candles.length);
  };

  const replayActive = replayState !== "idle";
  const effectiveVisibleCount =
    replayState === "playing" || replayState === "paused"
      ? visibleCount
      : candles.length;

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
        onOpenTools={() => setToolsOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
      />
      <div className="relative flex flex-1 min-h-0">
        <div
          className={`md:static md:translate-x-0 md:z-auto absolute top-0 left-0 h-full z-40 transition-transform duration-200 ${
            toolsOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LeftToolbar
            activeTool={activeTool}
            onSelectTool={(tool) => {
              setActiveTool(tool);
              setToolsOpen(false);
            }}
            onClearAll={() => {
              setDrawings([]);
              setSelectedDrawingId(null);
              setToolsOpen(false);
            }}
            trendStyle={trendStyle}
            horizontalStyle={horizontalStyle}
            onStyleChange={handleStyleChange}
          />
        </div>
        <div className="relative flex-1 flex">
          <ChartArea
            candles={candles}
            visibleCount={effectiveVisibleCount}
            replayActive={replayState === "selecting"}
            lockPriceScale={replayState === "playing" || replayState === "paused"}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={setSelectedIndex}
            apiRef={apiRef}
            onRangeChange={bumpRedraw}
            onReachLeftEdge={loadOlder}
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
          {candlesLoading && (
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-bg-elev/90 border border-border rounded-md px-2 py-1 text-text-muted text-[11px]">
              <svg
                className="animate-spin"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 3 a9 9 0 1 0 9 9" />
              </svg>
              Loading…
            </div>
          )}
          {candles.length > 0 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-down text-[11px] md:text-sm font-medium md:font-semibold pointer-events-none text-center px-3 max-w-[92vw] whitespace-nowrap">
              Delayed data — last update {candles[candles.length - 1].time}
            </div>
          )}
          {replayActive && (
            <ReplayBar
              isPlaying={replayState === "playing"}
              isSelecting={replayState === "selecting"}
              onPlayPause={handlePlayPause}
              onClip={handleClip}
              onStop={handleExitReplay}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          )}
        </div>
        <div
          className={`lg:static lg:translate-x-0 lg:z-auto absolute top-0 right-0 h-full w-70 max-w-[85vw] z-40 flex flex-col border-l border-border bg-bg transition-transform duration-200 ${
            watchlistOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex-1 min-h-0">
            <Watchlist
              sections={sections}
              activeSymbol={activeItem.symbol}
              onSelect={(item) => {
                setActiveItem(item);
                setWatchlistOpen(false);
              }}
              loading={watchlistLoading}
            />
          </div>
          <SymbolCard item={activeItem} info={symbolInfo} />
        </div>

        {(toolsOpen || watchlistOpen) && (
          <div
            className="lg:hidden absolute inset-0 bg-black/40 z-30"
            onClick={() => {
              setToolsOpen(false);
              setWatchlistOpen(false);
            }}
          />
        )}
      </div>

      <SymbolSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={setActiveItem}
      />
    </div>
  );
}
