"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const ITEMS: FeatureItem[] = [
  {
    title: "Bar-by-bar replay",
    desc: "Step through any historical period one candle at a time. Pause, rewind, replay until the setup becomes obvious.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    title: "Full drawing toolkit",
    desc: "Trend lines, horizontals, rectangles, Fibonacci retracement — everything stays pinned to price across timeframes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l4-4 6 6 8-12-4-4-8 12-6-6z" />
      </svg>
    ),
  },
  {
    title: "Long / Short planners",
    desc: "Drag a box and instantly see entry, target, stop, and R:R. Practice sizing without spreadsheets.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="7" />
        <rect x="3" y="13" width="18" height="7" />
      </svg>
    ),
  },
  {
    title: "Six timeframes",
    desc: "1m, 5m, 15m, 1h, 4h, and Daily. Drawings auto-scale so your levels survive every zoom.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
  },
  {
    title: "Light & dark themes",
    desc: "The whole chart, drawings, and replay UI flip on a click. Persists across reloads.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    title: "Mobile-ready",
    desc: "Slide-out tools and watchlist drawers. Replay your favorite setups from anywhere.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative w-full overflow-hidden bg-[#050b1f] text-white px-6 sm:px-10 py-24 scroll-mt-20"
      style={bodyFont}
    >
      <Reveal className="max-w-3xl mx-auto text-center">
        <span
          className="inline-flex items-center gap-2 text-sm tracking-[0.18em] uppercase text-sky-300/80"
          style={displayFont}
        >
          <span className="w-6 h-px bg-sky-300/60" />
          Built for practice
        </span>
        <h2
          className="mt-5 font-bold tracking-[-0.02em] leading-[1.05] text-5xl sm:text-6xl"
          style={displayFont}
        >
          Everything you need to back-test.
        </h2>
        <p className="mt-6 text-lg text-white/65 leading-[1.6] font-light">
          A focused toolkit so you spend time reading the market — not fighting your software.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.55,
              delay: (i % 3) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl bg-white/4 border border-white/10 backdrop-blur p-8 hover:border-sky-300/30 hover:bg-white/6 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-300/15 border border-sky-300/30 text-sky-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3
              className="text-2xl font-semibold tracking-tight mb-3"
              style={displayFont}
            >
              {item.title}
            </h3>
            <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
