const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
}

const BARS: Bar[] = (() => {
  let seed = 99;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  let close = 100;
  let trend = 0.4;
  let trendLeft = 0;
  const out: Bar[] = [];
  for (let i = 0; i < 50; i++) {
    if (trendLeft <= 0) {
      trend = (rand() - 0.3) * 1.2;
      trendLeft = 6 + Math.floor(rand() * 10);
    }
    trendLeft--;
    const open = close;
    close = open + trend + (rand() - 0.5) * 14;
    close += (110 - close) * 0.015;
    const high = Math.max(open, close) + rand() * 7;
    const low = Math.min(open, close) - rand() * 7;
    out.push({ open, high, low, close });
  }
  return out;
})();

export default function DashboardMock() {
  const W = 1100;
  const H = 360;
  const padX = 14;
  const innerW = W - padX * 2;
  const innerH = H - 70;
  const stride = innerW / BARS.length;
  const barW = stride * 0.6;
  const prices = BARS.flatMap((b) => [b.high, b.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const priceToY = (p: number) => 50 + innerH - ((p - min) / range) * innerH;
  const lastClose = BARS[BARS.length - 1].close;
  const lastY = priceToY(lastClose);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto rounded-2xl border border-white/10 bg-[#0a1428]/80 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(8,16,40,0.8)] overflow-hidden"
      style={displayFont}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/95 flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#050b1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 17 9 11 13 15 21 7" />
              <polyline points="14 7 21 7 21 14" />
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-white">Trade Replay</span>
          <span className="ml-2 text-[11px] text-white/40">Chart</span>
          <span className="ml-3 inline-flex items-center gap-1.5 text-[11px] text-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
            BTC/USD · 1h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 rounded-md bg-white/5 p-0.5">
            {["1m", "15m", "1h", "4h", "D"].map((tf, i) => (
              <span
                key={tf}
                className={`px-2 py-0.5 text-[10px] rounded ${
                  i === 2 ? "bg-white/15 text-white" : "text-white/55"
                }`}
              >
                {tf}
              </span>
            ))}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-[1fr_240px]">
        {/* Chart panel */}
        <div className="relative p-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-semibold text-white tabular-nums">68,742.20</span>
              <span className="text-[11px] text-sky-300 tabular-nums">+1.24%</span>
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">USD</span>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-[240px]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(125, 211, 252, 0.35)" />
                <stop offset="100%" stopColor="rgba(125, 211, 252, 0)" />
              </linearGradient>
            </defs>
            {/* Subtle horizontal grid */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = 50 + (innerH / 4) * i;
              return (
                <line
                  key={i}
                  x1={padX}
                  y1={y}
                  x2={W - padX}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={1}
                />
              );
            })}
            {/* Area under closes */}
            <path
              d={
                `M ${padX} ${50 + innerH} ` +
                BARS.map((b, i) => {
                  const x = padX + i * stride + stride / 2;
                  return `L ${x.toFixed(1)} ${priceToY(b.close).toFixed(1)}`;
                }).join(" ") +
                ` L ${W - padX} ${50 + innerH} Z`
              }
              fill="url(#dash-area)"
            />
            {/* Candles */}
            {BARS.map((b, i) => {
              const x = padX + i * stride + (stride - barW) / 2;
              const oY = priceToY(b.open);
              const cY = priceToY(b.close);
              const hY = priceToY(b.high);
              const lY = priceToY(b.low);
              const up = b.close >= b.open;
              const color = up ? "rgba(125, 211, 252, 0.95)" : "rgba(96, 165, 250, 0.85)";
              return (
                <g key={i}>
                  <line x1={x + barW / 2} y1={hY} x2={x + barW / 2} y2={lY} stroke={color} strokeWidth={1} />
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
            {/* Last price marker */}
            <line
              x1={padX}
              y1={lastY}
              x2={W - padX}
              y2={lastY}
              stroke="rgba(125, 211, 252, 0.45)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <circle cx={W - padX - 6} cy={lastY} r={4} fill="rgba(186, 230, 253, 0.95)" />
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between px-1 text-[10px] text-white/40 mt-2 tabular-nums">
            <span>09:00</span>
            <span>11:00</span>
            <span>13:00</span>
            <span>15:00</span>
            <span>17:00</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="border-l border-white/10 p-3 flex flex-col gap-3">
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Watchlist</div>
            <div className="mt-2 space-y-1.5">
              {[
                { sym: "BTC/USD", last: "68,742.20", chg: "+1.24%", up: true },
                { sym: "ETH/USD", last: "3,210.55", chg: "+0.42%", up: true },
                { sym: "SOL/USD", last: "158.12", chg: "−0.86%", up: false },
                { sym: "XAU/USD", last: "2,318.40", chg: "+0.11%", up: true },
              ].map((r) => (
                <div key={r.sym} className="flex items-center justify-between text-[11px]">
                  <span className="text-white/80">{r.sym}</span>
                  <span className="text-white/60 tabular-nums">{r.last}</span>
                  <span
                    className={`tabular-nums ${r.up ? "text-sky-300" : "text-rose-400"}`}
                  >
                    {r.chg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white/[0.04] border border-white/5 p-2.5">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Plan a trade</div>
            <div className="text-[11px] text-white/80">Long · BTC/USD</div>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-white/45">Entry</span>
              <span className="text-white tabular-nums">68,742</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[10px]">
              <span className="text-white/45">Target</span>
              <span className="text-sky-300 tabular-nums">71,300</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[10px]">
              <span className="text-white/45">Stop</span>
              <span className="text-rose-400 tabular-nums">67,450</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-white/60">
              <span className="w-1 h-1 rounded-full bg-sky-300" />
              R:R 2.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
