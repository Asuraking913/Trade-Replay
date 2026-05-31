const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
}

// Pre-generated so the SSR + CSR markup match (no Math.random at render time).
const BARS: Bar[] = (() => {
  let close = 100;
  let trend = 0;
  let trendLeft = 0;
  const out: Bar[] = [];
  // Deterministic seed via simple LCG so rebuilds are stable.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = 0; i < 60; i++) {
    if (trendLeft <= 0) {
      trend = (rand() - 0.5) * 1.2;
      trendLeft = 5 + Math.floor(rand() * 12);
    }
    trendLeft--;
    const open = close;
    close = open + trend + (rand() - 0.5) * 16;
    close += (100 - close) * 0.02;
    const high = Math.max(open, close) + rand() * 8;
    const low = Math.min(open, close) - rand() * 8;
    out.push({ open, high, low, close });
  }
  return out;
})();

export default function TiltedChartCard() {
  const W = 720;
  const H = 480;
  const padX = 40;
  const padY = 60;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const stride = innerW / BARS.length;
  const barW = stride * 0.6;

  const prices = BARS.flatMap((b) => [b.high, b.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const priceToY = (p: number) =>
    padY + innerH - ((p - min) / range) * innerH;

  return (
    <div className="relative w-full h-full select-none" style={{ perspective: "1600px" }}>
      {/* The tilted card itself */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2a52] via-[#0f1a3a] to-[#050b1f] shadow-[0_40px_80px_-20px_rgba(8,16,40,0.7)]"
        style={{
          transform: "rotateY(-14deg) rotateX(6deg) rotateZ(-2deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Subtle grid lines */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const y = padY + (innerH / 5) * i;
            return (
              <line
                key={`h-${i}`}
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="rgba(125, 211, 252, 0.06)"
                strokeWidth={1}
              />
            );
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const x = padX + (innerW / 7) * i;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={padY}
                x2={x}
                y2={H - padY}
                stroke="rgba(125, 211, 252, 0.05)"
                strokeWidth={1}
              />
            );
          })}

          {/* Candles */}
          {BARS.map((b, i) => {
            const x = padX + i * stride + (stride - barW) / 2;
            const oY = priceToY(b.open);
            const cY = priceToY(b.close);
            const hY = priceToY(b.high);
            const lY = priceToY(b.low);
            const up = b.close >= b.open;
            const color = up ? "rgba(125, 211, 252, 0.9)" : "rgba(96, 165, 250, 0.85)";
            return (
              <g key={i}>
                <line
                  x1={x + barW / 2}
                  y1={hY}
                  x2={x + barW / 2}
                  y2={lY}
                  stroke={color}
                  strokeWidth={1}
                />
                <rect
                  x={x}
                  y={Math.min(oY, cY)}
                  width={barW}
                  height={Math.max(1.5, Math.abs(oY - cY))}
                  fill={color}
                />
              </g>
            );
          })}

          {/* Smooth area under closes for that 'comet glow' base */}
          <defs>
            <linearGradient id="area-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(125, 211, 252, 0.35)" />
              <stop offset="100%" stopColor="rgba(125, 211, 252, 0)" />
            </linearGradient>
          </defs>
          <path
            d={
              `M ${padX} ${H - padY} ` +
              BARS.map((b, i) => {
                const x = padX + i * stride + stride / 2;
                return `L ${x.toFixed(1)} ${priceToY(b.close).toFixed(1)}`;
              }).join(" ") +
              ` L ${W - padX} ${H - padY} Z`
            }
            fill="url(#area-glow)"
          />
        </svg>

        {/* Brand mark watermark, slightly off-center */}
        <div className="absolute right-12 top-10 opacity-25">
          <div className="w-20 h-20 rounded-2xl border border-white/30 flex items-center justify-center">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 17 9 11 13 15 21 7" />
              <polyline points="14 7 21 7 21 14" />
            </svg>
          </div>
        </div>

        {/* Glowing dot — the "current price" marker */}
        <div className="absolute" style={{ left: "32%", top: "72%" }}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-sky-300/40 blur-md animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_18px_4px_rgba(186,230,253,0.6)] relative" />
          </div>
        </div>
      </div>

      {/* Floating labels (sit above the tilted card, not transformed) */}
      <FloatingLabel className="absolute left-[12%] top-[12%]" label="Total replays" value="248" />
      <FloatingLabel className="absolute left-[42%] top-[10%]" label="Sessions this week" value="14" />
      <FloatingLabel className="absolute left-[18%] top-[44%]" label="Win rate" value="58.6%" />
      <FloatingLabel
        className="absolute left-[52%] bottom-[14%]"
        label="Last trade"
        value="BTC/USD · +$1,240"
      />
    </div>
  );
}

function FloatingLabel({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-[0_0_8px_rgba(125,211,252,0.6)]" />
        <div className="leading-tight">
          <div className="text-[10px] tracking-wider uppercase text-white/45" style={displayFont}>
            {label}
          </div>
          <div className="text-[13px] font-medium text-white/85 tabular-nums" style={displayFont}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
