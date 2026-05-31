"use client";

import { useEffect, useRef } from "react";

interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
}

const SWEEP_SECONDS = 7; // full left-to-right sweep duration
const RESET_PAUSE = 0.8; // seconds the scrubber holds at the right edge before resetting

export default function CandleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const seriesRef = useRef<Bar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let priceMid = 100;
    let priceRange = 100;
    let barWidth = 6;
    let gap = 3;

    const generateSeries = (count: number): Bar[] => {
      // Mix of a few directional trends + chop to make it look like real market action.
      const bars: Bar[] = [];
      let close = priceMid;
      let trend = 0;
      let trendLeft = 0;
      for (let i = 0; i < count; i++) {
        if (trendLeft <= 0) {
          // Pick a new short trend leg (or chop).
          trend = (Math.random() - 0.5) * priceRange * 0.012;
          trendLeft = 8 + Math.floor(Math.random() * 18);
        }
        trendLeft--;
        const open = close;
        const noise = (Math.random() - 0.5) * priceRange * 0.16;
        close = open + trend + noise;
        // Soft mean reversion so the series stays in band.
        close += (priceMid - close) * 0.02;
        const high = Math.max(open, close) + Math.random() * priceRange * 0.1;
        const low = Math.min(open, close) - Math.random() * priceRange * 0.1;
        bars.push({ open, high, low, close });
      }
      return bars;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale bar width to canvas size so we always show ~120 bars.
      const target = 120;
      const stride = Math.max(6, Math.floor(width / target));
      gap = Math.max(2, Math.floor(stride * 0.35));
      barWidth = stride - gap;

      const count = Math.floor(width / (barWidth + gap)) + 4;
      seriesRef.current = generateSeries(count);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      if (startRef.current === 0) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const cyclePhase = elapsed % (SWEEP_SECONDS + RESET_PAUSE);
      // 0..1 progress for this cycle; clamps at 1 during the pause.
      const progress = Math.min(1, cyclePhase / SWEEP_SECONDS);

      ctx.clearRect(0, 0, width, height);

      // Soft glow behind the chart band.
      const gradient = ctx.createRadialGradient(
        width * 0.55,
        height * 0.5,
        20,
        width * 0.55,
        height * 0.5,
        Math.max(width, height) * 0.55
      );
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.18)");
      gradient.addColorStop(0.4, "rgba(56, 132, 220, 0.08)");
      gradient.addColorStop(1, "rgba(5, 11, 31, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const bandHeight = Math.min(560, height * 0.85);
      const bandTop = height * 0.5 - bandHeight / 2;
      const priceToY = (price: number) => {
        const normalized = (price - (priceMid - priceRange / 2)) / priceRange;
        return bandTop + (1 - normalized) * bandHeight;
      };

      const series = seriesRef.current;
      const stride = barWidth + gap;
      const totalWidth = series.length * stride;
      const startX = (width - totalWidth) / 2;
      const scrubberX = startX + progress * totalWidth;

      // 1) Bars to the LEFT of scrubber: full color (revealed).
      // 2) Bars to the RIGHT: dimmed (the back-test future, hidden).
      for (let i = 0; i < series.length; i++) {
        const bar = series[i];
        const x = startX + i * stride;
        if (x + barWidth < 0 || x > width) continue;

        const revealed = x + barWidth / 2 < scrubberX;
        const up = bar.close >= bar.open;

        const baseAlpha = revealed ? 0.9 : 0.18;
        const color = up
          ? `rgba(125, 211, 252, ${baseAlpha})`
          : `rgba(96, 165, 250, ${baseAlpha * 0.85})`;

        const openY = priceToY(bar.open);
        const closeY = priceToY(bar.close);
        const highY = priceToY(bar.high);
        const lowY = priceToY(bar.low);
        const bodyTop = Math.min(openY, closeY);
        const bodyH = Math.max(1.2, Math.abs(openY - closeY));

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + barWidth / 2, highY);
        ctx.lineTo(x + barWidth / 2, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillRect(x, bodyTop, barWidth, bodyH);
      }

      // 3) Dim overlay to the right of the scrubber for the "hidden future" feel.
      const dimRight = Math.max(0, width - scrubberX);
      if (dimRight > 0) {
        ctx.fillStyle = "rgba(5, 11, 31, 0.55)";
        ctx.fillRect(scrubberX, 0, dimRight, height);
      }

      // 4) Scrubber line (the replay drag indicator).
      ctx.strokeStyle = "rgba(96, 165, 250, 0.95)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scrubberX, 0);
      ctx.lineTo(scrubberX, height);
      ctx.stroke();

      // Scrubber grip + glow at the band center.
      const gripY = height * 0.5;
      const glow = ctx.createRadialGradient(scrubberX, gripY, 0, scrubberX, gripY, 80);
      glow.addColorStop(0, "rgba(186, 230, 253, 0.55)");
      glow.addColorStop(0.5, "rgba(96, 165, 250, 0.15)");
      glow.addColorStop(1, "rgba(5, 11, 31, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(scrubberX, gripY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(96, 165, 250, 1)";
      ctx.fillRect(scrubberX - 5, gripY - 14, 10, 28);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(scrubberX - 2.5, gripY - 8, 1, 16);
      ctx.fillRect(scrubberX + 1.5, gripY - 8, 1, 16);

      // 5) Tiny "REPLAY" badge near the scrubber (fades out as it sweeps).
      const badgeAlpha = Math.max(0, 1 - progress * 1.4);
      if (badgeAlpha > 0.05) {
        ctx.font =
          "600 10px 'Space Grotesk', 'Inter', system-ui, sans-serif";
        ctx.textBaseline = "middle";
        const text = "REPLAY";
        const padX = 7;
        const padY = 4;
        const metrics = ctx.measureText(text);
        const tw = metrics.width + padX * 2;
        const th = 18;
        const bx = scrubberX + 10;
        const by = gripY - th - 16;
        ctx.fillStyle = `rgba(96, 165, 250, ${0.85 * badgeAlpha})`;
        roundRect(ctx, bx, by, tw, th, 3);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * badgeAlpha})`;
        ctx.fillText(text, bx + padX, by + th / 2);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
