"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Anchor, Drawing, DrawingTool, LineStyle } from "./types";
import { ChartCoordinateApi } from "./ChartArea";
import { FIB_LEVELS } from "./constants";

interface DrawingOverlayProps {
  apiRef: RefObject<ChartCoordinateApi | null>;
  drawings: Drawing[];
  activeTool: DrawingTool | null;
  selectedId: string | null;
  trendStyle: LineStyle;
  horizontalStyle: LineStyle;
  onAdd: (drawing: Drawing) => void;
  onUpdate: (drawing: Drawing) => void;
  onSelect: (id: string | null) => void;
  onToolFinished: () => void;
  redrawTick: number;
}

interface Draft {
  tool: DrawingTool;
  a: Anchor;
  b: Anchor;
}

type EditRole = "move" | "a" | "b" | "entry" | "target" | "stop";

interface EditAction {
  id: string;
  role: EditRole;
  startAnchor: Anchor;
  original: Drawing;
}

export default function DrawingOverlay({
  apiRef,
  drawings,
  activeTool,
  selectedId,
  trendStyle,
  horizontalStyle,
  onAdd,
  onUpdate,
  onSelect,
  onToolFinished,
  redrawTick,
}: DrawingOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [edit, setEdit] = useState<EditAction | null>(null);
  const [, setInternalTick] = useState(0);

  void redrawTick;
  const api = apiRef.current;

  useEffect(() => {
    if (drawings.length === 0) return;
    let raf = 0;
    let lastY = -Infinity;
    let lastX = -Infinity;
    const tick = () => {
      const a = apiRef.current;
      if (a && drawings[0]) {
        const probe = drawings[0];
        const probePrice =
          "price" in probe ? probe.price : "entry" in probe ? probe.entry : probe.a.price;
        const probeTime = "a" in probe ? probe.a.time : 0;
        const y = a.priceToY(probePrice) ?? -1;
        const x = a.timeToX(probeTime) ?? -1;
        if (y !== lastY || x !== lastX) {
          lastY = y;
          lastX = x;
          setInternalTick((t) => t + 1);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drawings, apiRef]);

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

  const beginEdit = (
    e: React.PointerEvent<SVGElement>,
    drawing: Drawing,
    role: EditRole
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const anchor = eventToAnchor(e);
    if (!anchor) return;
    onSelect(drawing.id);
    setEdit({ id: drawing.id, role, startAnchor: anchor, original: drawing });
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handleSvgPointerDown = (e: React.PointerEvent<SVGElement>) => {
    if (activeTool) {
      e.preventDefault();
      const anchor = eventToAnchor(e);
      if (!anchor) return;

      if (activeTool === "horizontal") {
        onAdd({
          id: makeId(),
          kind: "horizontal",
          price: anchor.price,
          style: horizontalStyle,
        });
        onToolFinished();
        return;
      }

      setDraft({ tool: activeTool, a: anchor, b: anchor });
      svgRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    onSelect(null);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (edit) {
      const anchor = eventToAnchor(e);
      if (!anchor) return;
      const dt = anchor.time - edit.startAnchor.time;
      const dp = anchor.price - edit.startAnchor.price;
      const updated = applyEdit(edit.original, edit.role, dt, dp, anchor);
      if (updated) onUpdate(updated);
      return;
    }
    if (draft) {
      const anchor = eventToAnchor(e);
      if (!anchor) return;
      setDraft({ ...draft, b: anchor });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (edit) {
      svgRef.current?.releasePointerCapture(e.pointerId);
      setEdit(null);
      return;
    }
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
    if (tool === "trend") {
      onAdd({ id, kind: "trend", a, b, style: trendStyle });
    } else if (tool === "rect" || tool === "fib") {
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
        setEdit(null);
        onSelect(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  const cursor = activeTool ? "crosshair" : edit ? "grabbing" : "default";
  const rootCapturing = !!activeTool || !!edit || !!draft;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      className="absolute inset-0"
      style={{ cursor, pointerEvents: "none", zIndex: 50 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setDraft(null);
        setEdit(null);
      }}
    >
      {rootCapturing && (
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          style={{ pointerEvents: "auto" }}
          onPointerDown={handleSvgPointerDown}
        />
      )}
      {api &&
        drawings.map((d) => (
          <DrawingShape
            key={d.id}
            drawing={d}
            api={api}
            selected={d.id === selectedId}
            disabled={!!activeTool}
            onBeginEdit={(e, role) => beginEdit(e, d, role)}
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
  const hi = Math.max(a.price, b.price);
  const lo = Math.min(a.price, b.price);
  const entry = kind === "long" ? lo : hi;
  const target = kind === "long" ? hi : lo;
  const reward = hi - lo;
  const stop = kind === "long" ? entry - reward / 2 : entry + reward / 2;
  return { id, kind, a, b, entry, target, stop };
}

function applyEdit(
  original: Drawing,
  role: EditRole,
  dt: number,
  dp: number,
  pointer: Anchor
): Drawing | null {
  switch (original.kind) {
    case "trend":
    case "rect":
    case "fib": {
      if (role === "move") {
        return {
          ...original,
          a: { time: original.a.time + dt, price: original.a.price + dp },
          b: { time: original.b.time + dt, price: original.b.price + dp },
        };
      }
      if (role === "a") return { ...original, a: pointer };
      if (role === "b") return { ...original, b: pointer };
      return null;
    }
    case "horizontal": {
      if (role === "move") return { ...original, price: original.price + dp };
      return null;
    }
    case "long":
    case "short": {
      if (role === "move") {
        return {
          ...original,
          a: { time: original.a.time + dt, price: original.a.price + dp },
          b: { time: original.b.time + dt, price: original.b.price + dp },
          entry: original.entry + dp,
          target: original.target + dp,
          stop: original.stop + dp,
        };
      }
      if (role === "a") return { ...original, a: pointer };
      if (role === "b") return { ...original, b: pointer };
      if (role === "entry") return { ...original, entry: pointer.price };
      if (role === "target") return { ...original, target: pointer.price };
      if (role === "stop") return { ...original, stop: pointer.price };
      return null;
    }
  }
}

interface ShapeProps {
  drawing: Drawing;
  api: ChartCoordinateApi;
  selected: boolean;
  disabled: boolean;
  onBeginEdit: (e: React.PointerEvent<SVGElement>, role: EditRole) => void;
}

function DrawingShape({ drawing, api, selected, disabled, onBeginEdit }: ShapeProps) {
  const bodyCursor = disabled ? "default" : "move";
  const bodyHandlers = disabled
    ? {}
    : {
        onPointerDown: (e: React.PointerEvent<SVGElement>) => onBeginEdit(e, "move"),
      };
  const hitEvents = disabled ? "none" : "auto";

  switch (drawing.kind) {
    case "trend": {
      const ax = api.timeToX(drawing.a.time);
      const ay = api.priceToY(drawing.a.price);
      const bx = api.timeToX(drawing.b.time);
      const by = api.priceToY(drawing.b.price);
      if (ax == null || ay == null || bx == null || by == null) return null;
      const stroke = lineStrokeProps(drawing.style);
      return (
        <g>
          <line
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke="transparent"
            strokeWidth={14}
            pointerEvents={hitEvents}
            style={{ cursor: bodyCursor }}
            {...bodyHandlers}
          />
          <line
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={stroke.strokeWidth}
            strokeDasharray={stroke.strokeDasharray}
            strokeLinecap="round"
            pointerEvents="none"
          />
          {selected && !disabled && (
            <>
              <Handle x={ax} y={ay} onPointerDown={(e) => onBeginEdit(e, "a")} />
              <Handle x={bx} y={by} onPointerDown={(e) => onBeginEdit(e, "b")} />
            </>
          )}
        </g>
      );
    }
    case "horizontal": {
      const y = api.priceToY(drawing.price);
      if (y == null) return null;
      const stroke = lineStrokeProps(drawing.style);
      return (
        <g>
          <line
            x1={0}
            y1={y}
            x2={api.width}
            y2={y}
            stroke="transparent"
            strokeWidth={14}
            pointerEvents={hitEvents}
            style={{ cursor: disabled ? "default" : "ns-resize" }}
            {...bodyHandlers}
          />
          <line
            x1={0}
            y1={y}
            x2={api.width}
            y2={y}
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={stroke.strokeWidth}
            strokeDasharray={stroke.strokeDasharray}
            strokeLinecap="round"
            pointerEvents="none"
          />
          <rect
            x={api.width - 70}
            y={y - 8}
            width={66}
            height={16}
            fill={selected ? "#2962ff" : "#5b8def"}
            rx={2}
            pointerEvents="none"
          />
          <text
            x={api.width - 37}
            y={y + 4}
            fill="white"
            fontSize={10}
            fontFamily="monospace"
            textAnchor="middle"
            pointerEvents="none"
          >
            {drawing.price.toFixed(2)}
          </text>
        </g>
      );
    }
    case "rect": {
      const r = projectRect(drawing.a, drawing.b, api);
      if (!r) return null;
      const ax = api.timeToX(drawing.a.time)!;
      const ay = api.priceToY(drawing.a.price)!;
      const bx = api.timeToX(drawing.b.time)!;
      const by = api.priceToY(drawing.b.price)!;
      return (
        <g>
          <rect
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill="rgba(91, 141, 239, 0.12)"
            stroke={selected ? "#2962ff" : "#5b8def"}
            strokeWidth={selected ? 2 : 1.5}
            pointerEvents={hitEvents}
            style={{ cursor: bodyCursor }}
            {...bodyHandlers}
          />
          {selected && !disabled && (
            <>
              <Handle x={ax} y={ay} onPointerDown={(e) => onBeginEdit(e, "a")} />
              <Handle x={bx} y={by} onPointerDown={(e) => onBeginEdit(e, "b")} />
            </>
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
        <g>
          <rect
            x={x1}
            y={Math.min(ay, by)}
            width={x2 - x1}
            height={Math.abs(by - ay)}
            fill="rgba(91, 141, 239, 0.05)"
            stroke="transparent"
            pointerEvents={hitEvents}
            style={{ cursor: bodyCursor }}
            {...bodyHandlers}
          />
          {FIB_LEVELS.map((level) => {
            const price = highPrice - range * level;
            const y = api.priceToY(price);
            if (y == null) return null;
            const color = FIB_COLORS[level] ?? "#9ba0aa";
            return (
              <g key={level} pointerEvents="none">
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
          {selected && !disabled && (
            <>
              <Handle x={ax} y={ay} onPointerDown={(e) => onBeginEdit(e, "a")} />
              <Handle x={bx} y={by} onPointerDown={(e) => onBeginEdit(e, "b")} />
            </>
          )}
        </g>
      );
    }
    case "long":
    case "short":
      return (
        <PositionShape
          drawing={drawing}
          api={api}
          selected={selected}
          disabled={disabled}
          onBeginEdit={onBeginEdit}
        />
      );
  }
}

function PositionShape({
  drawing,
  api,
  selected,
  disabled,
  onBeginEdit,
}: {
  drawing: Extract<Drawing, { kind: "long" | "short" }>;
  api: ChartCoordinateApi;
  selected: boolean;
  disabled: boolean;
  onBeginEdit: (e: React.PointerEvent<SVGElement>, role: EditRole) => void;
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

  const rr =
    Math.abs(drawing.target - drawing.entry) /
    Math.max(0.0001, Math.abs(drawing.entry - drawing.stop));

  const hitEvents = disabled ? "none" : "auto";
  const bodyHandlers = disabled
    ? {}
    : {
        onPointerDown: (e: React.PointerEvent<SVGElement>) => onBeginEdit(e, "move"),
      };
  const lineHandlers = (role: EditRole) =>
    disabled
      ? {}
      : {
          onPointerDown: (e: React.PointerEvent<SVGElement>) => onBeginEdit(e, role),
        };

  return (
    <g>
      <rect
        x={profitRect.x}
        y={profitRect.y}
        width={profitRect.w}
        height={profitRect.h}
        fill={profitColor}
        pointerEvents={hitEvents}
        style={{ cursor: disabled ? "default" : "move" }}
        {...bodyHandlers}
      />
      <rect
        x={lossRect.x}
        y={lossRect.y}
        width={lossRect.w}
        height={lossRect.h}
        fill={lossColor}
        pointerEvents={hitEvents}
        style={{ cursor: disabled ? "default" : "move" }}
        {...bodyHandlers}
      />

      <line
        x1={x}
        y1={targetY}
        x2={x + w}
        y2={targetY}
        stroke="transparent"
        strokeWidth={14}
        pointerEvents={hitEvents}
        style={{ cursor: disabled ? "default" : "ns-resize" }}
        {...lineHandlers("target")}
      />
      <line
        x1={x}
        y1={targetY}
        x2={x + w}
        y2={targetY}
        stroke="#26a69a"
        strokeWidth={selected ? 2 : 1.5}
        pointerEvents="none"
      />

      <line
        x1={x}
        y1={entryY}
        x2={x + w}
        y2={entryY}
        stroke="transparent"
        strokeWidth={14}
        pointerEvents={hitEvents}
        style={{ cursor: disabled ? "default" : "ns-resize" }}
        {...lineHandlers("entry")}
      />
      <line
        x1={x}
        y1={entryY}
        x2={x + w}
        y2={entryY}
        stroke="#5b8def"
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray="3 3"
        pointerEvents="none"
      />

      <line
        x1={x}
        y1={stopY}
        x2={x + w}
        y2={stopY}
        stroke="transparent"
        strokeWidth={14}
        pointerEvents={hitEvents}
        style={{ cursor: disabled ? "default" : "ns-resize" }}
        {...lineHandlers("stop")}
      />
      <line
        x1={x}
        y1={stopY}
        x2={x + w}
        y2={stopY}
        stroke="#ef5350"
        strokeWidth={selected ? 2 : 1.5}
        pointerEvents="none"
      />

      <g pointerEvents="none">
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
        <rect
          x={x + w - 72}
          y={Math.min(targetY, stopY) - 18}
          width={68}
          height={16}
          fill="#1e222d"
          stroke="#2a2e39"
          rx={2}
        />
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
      </g>

      {selected && !disabled && (
        <>
          <Handle x={x} y={targetY} onPointerDown={(e) => onBeginEdit(e, "a")} />
          <Handle x={x + w} y={targetY} onPointerDown={(e) => onBeginEdit(e, "b")} />
          <Handle x={x} y={stopY} onPointerDown={(e) => onBeginEdit(e, "a")} />
          <Handle x={x + w} y={stopY} onPointerDown={(e) => onBeginEdit(e, "b")} />
        </>
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
      return (
        <line
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke="#2962ff"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      );
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

function Handle({
  x,
  y,
  onPointerDown,
}: {
  x: number;
  y: number;
  onPointerDown: (e: React.PointerEvent<SVGElement>) => void;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill="#2962ff"
      stroke="white"
      strokeWidth={1.5}
      pointerEvents="auto"
      style={{ cursor: "grab" }}
      onPointerDown={onPointerDown}
    />
  );
}

function lineStrokeProps(style: LineStyle): {
  strokeWidth: number;
  strokeDasharray: string | undefined;
} {
  const w = style.width;
  if (style.pattern === "solid") return { strokeWidth: w, strokeDasharray: undefined };
  if (style.pattern === "dashed") return { strokeWidth: w, strokeDasharray: `${w * 3} ${w * 2}` };
  return { strokeWidth: w, strokeDasharray: `${w * 0.6} ${w * 2}` };
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
