"use client";

import Reveal from "./Reveal";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

export default function LandingFeature() {
  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-[#050b1f] text-white px-6 sm:px-10 py-24"
      style={bodyFont}
    >
      <Reveal>
        <h2
          className="text-center font-bold tracking-[-0.02em] leading-[1.05] text-5xl sm:text-6xl lg:text-7xl max-w-4xl mx-auto"
          style={displayFont}
        >
          High-speed back-testing
          <br />
          for{" "}
          <span className="bg-linear-to-r from-sky-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
            every
          </span>{" "}
          trader
        </h2>
      </Reveal>

      {/* Two side-by-side cards (swap-style) */}
      <div className="relative mt-16 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Connector dot in the middle on sm+ */}
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-sky-300 items-center justify-center shadow-[0_0_30px_rgba(125,211,252,0.5)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#050b1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </div>

        {/* Card 1 — entry plan */}
        <Reveal delay={0.05} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8 sm:p-10 hover:border-sky-300/30 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm uppercase tracking-wider text-white/45">
              Entry
            </span>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full px-3 py-1.5 text-sm">
              <span className="w-4 h-4 rounded-full bg-sky-300/80 flex items-center justify-center text-[9px] font-bold text-[#050b1f]">
                B
              </span>
              BTC/USD
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-white/50 mb-3">
            <span>Plan size</span>
            <span className="text-white/80 tabular-nums">0.15 BTC</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl sm:text-5xl font-semibold text-white tabular-nums" style={displayFont}>
              68,742<span className="text-white/40">.20</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-300/15 text-sky-300">
              Long
            </span>
            <span className="text-white/45 tabular-nums">~ $10,311</span>
          </div>
        </Reveal>

        {/* Card 2 — target / projected exit */}
        <Reveal delay={0.2} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8 sm:p-10 hover:border-sky-300/30 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm uppercase tracking-wider text-white/45">
              Target
            </span>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full px-3 py-1.5 text-sm">
              <span className="w-4 h-4 rounded-full bg-sky-300/80 flex items-center justify-center text-[9px] font-bold text-[#050b1f]">
                B
              </span>
              BTC/USD
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-white/50 mb-3">
            <span>Expected gain</span>
            <span className="text-sky-300 tabular-nums">+3.7%</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl sm:text-5xl font-semibold text-white tabular-nums" style={displayFont}>
              71,300<span className="text-white/40">.00</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/60">
              R:R 2.0
            </span>
            <span className="text-white/45 tabular-nums">~ $10,695</span>
          </div>
        </Reveal>
      </div>

      {/* Social proof row */}
      <Reveal delay={0.1} className="mt-20 text-center">
        <p className="text-base text-white/55 max-w-lg mx-auto leading-relaxed">
          A trading sandbox built for traders.
          <br />
          Practice on real historical data with Trade Replay.
        </p>
        <div className="mt-7 flex items-center justify-center gap-4">
          {[
            { label: "BTC", color: "#f7931a" },
            { label: "ETH", color: "#627eea" },
            { label: "SOL", color: "#9945ff" },
            { label: "XAU", color: "#ffcc33" },
          ].map((c) => (
            <div
              key={c.label}
              className="w-11 h-11 rounded-full bg-white/3 border border-white/10 flex items-center justify-center text-xs font-bold text-white/70 transition-transform hover:scale-110"
            >
              <span style={{ color: c.color }}>{c.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
