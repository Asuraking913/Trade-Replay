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
import { generateMockCandles } from "./utils";
import { Drawing, DrawingTool, Timeframe, WatchlistItem } from "./types";
import { WATCHLIST_SECTIONS } from "./constants";

const ALL_ITEMS = WATCHLIST_SECTIONS.flatMap((s) => s.items);
const DEFAULT_ITEM = ALL_ITEMS.find((i) => i.symbol === "XAUUSI") ?? ALL_ITEMS[0];

type ReplayState = "idle" | "selecting" | "playing";

export default function Chart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("D");
  const [activeItem, setActiveItem] = useState<WatchlistItem>(DEFAULT_ITEM);
  const [searchOpen, setSearchOpen] = useState(false);

  const candles = useMemo(() => generateMockCandles(260, 3500), []);

  const [replayState, setReplayState] = useState<ReplayState>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(candles.length);
  const [speed, setSpeed] = useState(1);

  const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [redrawTick, setRedrawTick] = useState(0);

  const apiRef = useRef<ChartCoordinateApi | null>(null);

  const bumpRedraw = useCallback(() => {
    setRedrawTick((t) => t + 1);
  }, []);

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

  return (
    <div className="flex flex-col w-full h-screen bg-[#131722] text-[#d1d4dc] overflow-hidden">
      <Header
        symbol={activeItem.symbol}
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
        />
        <div className="relative flex-1 flex">
          <ChartArea
            candles={candles}
            visibleCount={replayState === "playing" ? visibleCount : candles.length}
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
              onAdd={(d) => setDrawings((ds) => [...ds, d])}
              onSelect={setSelectedDrawingId}
              onToolFinished={() => setActiveTool(null)}
              redrawTick={redrawTick}
            />
          </ChartArea>
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
        <div className="flex flex-col w-[280px] border-l border-[#2a2e39]">
          <div className="flex-1 min-h-0">
            <Watchlist activeSymbol={activeItem.symbol} onSelect={setActiveItem} />
          </div>
          <SymbolCard item={activeItem} />
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
