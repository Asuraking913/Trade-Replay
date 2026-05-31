"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./Reveal";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

const FAQS = [
  {
    q: "Is this real money?",
    a: "No. Trade Replay is a sandbox built strictly for practice and back-testing. You can plan entries, mark targets, and track outcomes — none of it touches a real account.",
  },
  {
    q: "Where does the chart data come from?",
    a: "We pull historical OHLCV bars from our own backend, which mirrors prices from public exchanges. Data is delayed (not real-time) — the chart shows the date of the most recent loaded bar.",
  },
  {
    q: "Can I keep my drawings?",
    a: "Drawings live in the page session right now. Saved sessions are on the roadmap so you can come back to a marked-up setup later.",
  },
  {
    q: "What timeframes and pairs are supported?",
    a: "1m / 5m / 15m / 1h / 4h / Daily across BTC, ETH, SOL, BNB, XAU, EUR, GBP, USD/JPY. New pairs are being added regularly.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The chart, drawing tools, replay controls, and watchlist all collapse into a mobile-friendly layout with slide-out drawers.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#050b1f] text-white px-6 sm:px-10 py-24 scroll-mt-20"
      style={bodyFont}
    >
      <Reveal className="max-w-3xl mx-auto text-center">
        <span
          className="inline-flex items-center gap-2 text-sm tracking-[0.18em] uppercase text-sky-300/80"
          style={displayFont}
        >
          <span className="w-6 h-px bg-sky-300/60" />
          Questions
        </span>
        <h2
          className="mt-5 font-bold tracking-[-0.02em] leading-[1.05] text-5xl sm:text-6xl"
          style={displayFont}
        >
          Things people ask.
        </h2>
      </Reveal>

      <div className="mt-14 max-w-4xl mx-auto space-y-4">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="rounded-2xl bg-white/4 border border-white/10 backdrop-blur overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left hover:bg-white/2 transition-colors"
                >
                  <span
                    className="text-lg sm:text-xl font-medium tracking-tight"
                    style={displayFont}
                  >
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-7 text-base sm:text-lg text-white/65 leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
