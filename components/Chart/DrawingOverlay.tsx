"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Anchor, Drawing, DrawingTool } from "./types";
import { ChartCoordinateApi } from "./ChartArea";
import { FIB_LEVELS } from "./constants";

interface DrawingOverlayProps {
  apiRef: RefObject<ChartCoordinateApi | null>;
  drawings: Drawing[];
  activeTool: DrawingTool | null;
  selectedId: string | null;
  onAdd: (drawing: Drawing) => void;
  onSelect: (id: string | null) => void;
  onToolFinished: () => void;
  redrawTick: number;
}

interface Draft {
  tool: DrawingTool;
  a: Anchor;
  b: Anchor;
}

export default function DrawingOverlay({
  apiRef,
  drawings,
  activeTool,
  selectedId,
  onAdd,
  onSelect,
  onToolFinished,
  redrawTick,
}: DrawingOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  void redrawTick;
  const api = apiRef.current;

  const eventToAnchor = (e: React.PointerEvent | PointerEvent): Anchor | null => {
    const liveApi = apiRef.current;
    if (!liveApi || !svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = liveApi.xToTime(x);
    const price = liveApi.yToPrice(y);
    if (time == null || price == null) return null;
    return { time, price };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!activeTool) {
      onSelect(null);
      return;
    }
    e.preventDefault();
    const anchor = eventToAnchor(e);
    if (!anchor) return;

    if (activeTool === "horizontal") {
      onAdd({ id: makeId(), kind: "horizontal", price: anchor.price });
      onToolFinished();
      return;
    }

    setDraft({ tool: activeTool, a: anchor, b: anchor });
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft) return;
    const anchor = eventToAnchor(e);
    if (!anchor) return;
    setDraft({ ...draft, b: anchor });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft) return;
    svgRef.current?.releasePointerCapture(e.pointerId);
    const { tool, a, b } = draft;
    setDraft(null);

    const liveApi = apiRef.current;
    if (!liveApi) return;
    const ax = liveApi.timeToX(a.time);
    const bx = liveApi.timeToX(b.time);
    const ay = liveApi.priceToY(a.price);
    const by = liveApi.priceToY(b.price);
    if (ax == null || bx == null || ay == null || by == null) return;
    if (Math.hypot(bx - ax, by - ay) < 4) return;

    const id = makeId();
    if (tool === "trend" || tool === "rect" || tool === "fib") {
      onAdd({ id, kind: tool, a, b });
    } else if (tool === "long" || tool === "short") {
      onAdd(buildPosition(id, tool, a, b));
    }
    onToolFinished();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDraft(null);
        onSelect(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  const cursor = activeTool ? "crosshair" : "default";
  const pointerEvents = activeTool || drawings.length > 0 ? "auto" : "none";

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 z-10"
      style={{ cursor, pointerEvents }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDraft(null)}
    >
      {api && drawings.map((d) => (
        <DrawingShape
          key={d.id}
          drawing={d}
          api={api}
          selected={d.id === selectedId}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(d.id);
          }}
        />
      ))}
      {api && draft && <DraftShape draft={draft} api={api} />}
    </svg>
  );
}

function makeId(): string {
  return `d-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function buildPosition(
  id: string,
  kind: "long" | "short",
  a: Anchor,
  b: Anchor
): Drawing {
  const entry = a.price;
  const opp = b.price;
  const target = kind === "long" ? Math.max(entry, opp) : Math.min(entry, opp);
  const reward = Math.abs(target - entry);
  const stop = kind === "long" ? entry - reward / 2 : entry + reward / 2;
  return { id, kind, a, b, entry, target, stop };
}

interface ShapeProps {
  drawing: Drawing;
  api: ChartCoordinateApi;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function DrawingShape({ drawing, api, selected, onClick }: ShapeProps) {
  switch (drawing.kind) {
    case "trend": {
      const ax = api.timeToX(drawing.a.time);
      const ay = api.priceToY(drawing.a.price);
      const bx = api.timeToX(drawing.b.time);
      const by = api.priceToY(drawing.b.price);
      if (ax == null || ay == null || bx == null || by == null) return null;
      return (
        <g onClick={onClick} style={{ cursor: "pointer" }}>
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke="transparent" strokeWidth={12} />
          <line
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={selected ? 2.5 : 1.8}
          />
          {selected && <Handles points={[[ax, ay], [bx, by]]} />}
        </g>
      );
    }
    case "horizontal": {
      const y = api.priceToY(drawing.price);
      if (y == null) return null;
      return (
        <g onClick={onClick} style={{ cursor: "pointer" }}>
          <line x1={0} y1={y} x2={api.width} y2={y} stroke="transparent" strokeWidth={12} />
          <line
            x1={0}
            y1={y}
            x2={api.width}
            y2={y}
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={selected ? 2 : 1.5}
            strokeDasharray="4 4"
          />
          <rect x={api.width - 70} y={y - 8} width={66} height={16} fill={selected ? "#2962ff" : "#5b8def"} rx={2} />
          <text
            x={api.width - 37}
            y={y + 4}
            fill="white"
            fontSize={10}
            fontFamily="monospace"
            textAnchor="middle"
          >
            {drawing.price.toFixed(2)}
          </text>
        </g>
      );
    }
    case "rect": {
      const r = projectRect(drawing.a, drawing.b, api);
      if (!r) return null;
      return (
        <g onClick={onClick} style={{ cursor: "pointer" }}>
          <rect
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill="rgba(91, 141, 239, 0.12)"
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={selected ? 2 : 1.5}
          />
          {selected && (
            <Handles
              points={[
                [r.x, r.y],
                [r.x + r.w, r.y],
                [r.x, r.y + r.h],
                [r.x + r.w, r.y + r.h],
              ]}
            />
          )}
        </g>
      );
    }
    case "fib": {
      const ax = api.timeToX(drawing.a.time);
      const bx = api.timeToX(drawing.b.time);
      const ay = api.priceToY(drawing.a.price);
      const by = api.priceToY(drawing.b.price);
      if (ax == null || bx == null || ay == null || by == null) return null;
      const x1 = Math.min(ax, bx);
      const x2 = Math.max(ax, bx);
      const highPrice = Math.max(drawing.a.price, drawing.b.price);
      const lowPrice = Math.min(drawing.a.price, drawing.b.price);
      const range = highPrice - lowPrice;
      return (
        <g onClick={onClick} style={{ cursor: "pointer" }}>
          <rect
            x={x1}
            y={Math.min(ay, by)}
            width={x2 - x1}
            height={Math.abs(by - ay)}
            fill="transparent"
            stroke="transparent"
          />
          {FIB_LEVELS.map((level) => {
            const price = highPrice - range * level;
            const y = api.priceToY(price);
            if (y == null) return null;
            const color = FIB_COLORS[level] ?? "#9ba0aa";
            return (
              <g key={level}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={color}
                  strokeWidth={selected ? 1.5 : 1}
                />
                <text
                  x={x1 - 4}
                  y={y + 3}
                  fill={color}
                  fontSize={10}
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {level.toFixed(3)} ({price.toFixed(2)})
                </text>
              </g>
            );
          })}
          {selected && <Handles points={[[ax, ay], [bx, by]]} />}
        </g>
      );
    }
    case "long":
    case "short":
      return <PositionShape drawing={drawing} api={api} selected={selected} onClick={onClick} />;
  }
}

function PositionShape({
  drawing,
  api,
  selected,
  onClick,
}: {
  drawing: Extract<Drawing, { kind: "long" | "short" }>;
  api: ChartCoordinateApi;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const ax = api.timeToX(drawing.a.time);
  const bx = api.timeToX(drawing.b.time);
  if (ax == null || bx == null) return null;
  const entryY = api.priceToY(drawing.entry);
  const targetY = api.priceToY(drawing.target);
  const stopY = api.priceToY(drawing.stop);
  if (entryY == null || targetY == null || stopY == null) return null;

  const x = Math.min(ax, bx);
  const w = Math.abs(bx - ax);
  const profitColor = "rgba(38, 166, 154, 0.25)";
  const lossColor = "rgba(239, 83, 80, 0.25)";

  const profitRect = {
    x,
    y: Math.min(entryY, targetY),
    w,
    h: Math.abs(targetY - entryY),
  };
  const lossRect = {
    x,
    y: Math.min(entryY, stopY),
    w,
    h: Math.abs(stopY - entryY),
  };

  const rr = Math.abs(drawing.target - drawing.entry) / Math.max(0.0001, Math.abs(drawing.entry - drawing.stop));

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <rect x={profitRect.x} y={profitRect.y} width={profitRect.w} height={profitRect.h} fill={profitColor} />
      <rect x={lossRect.x} y={lossRect.y} width={lossRect.w} height={lossRect.h} fill={lossColor} />

      <line x1={x} y1={targetY} x2={x + w} y2={targetY} stroke="#26a69a" strokeWidth={selected ? 2 : 1.5} />
      <line x1={x} y1={entryY} x2={x + w} y2={entryY} stroke="#5b8def" strokeWidth={selected ? 2 : 1.5} strokeDasharray="3 3" />
      <line x1={x} y1={stopY} x2={x + w} y2={stopY} stroke="#ef5350" strokeWidth={selected ? 2 : 1.5} />

      <rect x={x + 4} y={targetY - 8} width={56} height={16} fill="#26a69a" rx={2} />
      <text x={x + 32} y={targetY + 4} fill="white" fontSize={10} fontFamily="monospace" textAnchor="middle">
        T {drawing.target.toFixed(2)}
      </text>

      <rect x={x + 4} y={entryY - 8} width={56} height={16} fill="#5b8def" rx={2} />
      <text x={x + 32} y={entryY + 4} fill="white" fontSize={10} fontFamily="monospace" textAnchor="middle">
        E {drawing.entry.toFixed(2)}
      </text>

      <rect x={x + 4} y={stopY - 8} width={56} height={16} fill="#ef5350" rx={2} />
      <text x={x + 32} y={stopY + 4} fill="white" fontSize={10} fontFamily="monospace" textAnchor="middle">
        S {drawing.stop.toFixed(2)}
      </text>

      <rect x={x + w - 72} y={Math.min(targetY, stopY) - 18} width={68} height={16} fill="#1e222d" stroke="#2a2e39" rx={2} />
      <text
        x={x + w - 38}
        y={Math.min(targetY, stopY) - 6}
        fill="white"
        fontSize={10}
        fontFamily="monospace"
        textAnchor="middle"
      >
        {drawing.kind === "long" ? "LONG" : "SHORT"} · R:R {rr.toFixed(2)}
      </text>

      {selected && (
        <Handles
          points={[
            [x, targetY],
            [x + w, targetY],
            [x, stopY],
            [x + w, stopY],
          ]}
        />
      )}
    </g>
  );
}

function DraftShape({ draft, api }: { draft: Draft; api: ChartCoordinateApi }) {
  const ax = api.timeToX(draft.a.time);
  const bx = api.timeToX(draft.b.time);
  const ay = api.priceToY(draft.a.price);
  const by = api.priceToY(draft.b.price);
  if (ax == null || bx == null || ay == null || by == null) return null;

  switch (draft.tool) {
    case "trend":
      return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#2962ff" strokeWidth={1.5} strokeDasharray="4 4" />;
    case "rect":
      return (
        <rect
          x={Math.min(ax, bx)}
          y={Math.min(ay, by)}
          width={Math.abs(bx - ax)}
          height={Math.abs(by - ay)}
          fill="rgba(41, 98, 255, 0.12)"
          stroke="#2962ff"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      );
    case "fib":
    case "long":
    case "short":
      return (
        <rect
          x={Math.min(ax, bx)}
          y={Math.min(ay, by)}
          width={Math.abs(bx - ax)}
          height={Math.abs(by - ay)}
          fill="rgba(41, 98, 255, 0.08)"
          stroke="#2962ff"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      );
    default:
      return null;
  }
}

function Handles({ points }: { points: [number, number][] }) {
  return (
    <>
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="#2962ff" stroke="white" strokeWidth={1} />
      ))}
    </>
  );
}

function projectRect(a: Anchor, b: Anchor, api: ChartCoordinateApi) {
  const ax = api.timeToX(a.time);
  const bx = api.timeToX(b.time);
  const ay = api.priceToY(a.price);
  const by = api.priceToY(b.price);
  if (ax == null || bx == null || ay == null || by == null) return null;
  return {
    x: Math.min(ax, bx),
    y: Math.min(ay, by),
    w: Math.abs(bx - ax),
    h: Math.abs(by - ay),
  };
}

const FIB_COLORS: Record<number, string> = {
  0: "#9ba0aa",
  0.236: "#ef5350",
  0.382: "#ff9800",
  0.5: "#ffeb3b",
  0.618: "#26a69a",
  0.786: "#42a5f5",
  1: "#9ba0aa",
};
