"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

const STEPS = [
  {
    n: "01",
    title: "Pick a pair",
    desc: "Choose from BTC, ETH, SOL, BNB, XAU, EUR, GBP, JPY and more. Each loads thousands of bars of clean historical data.",
  },
  {
    n: "02",
    title: "Hit Replay",
    desc: "Drop the start cursor on any bar. Press Play, Pause, or Clip to step through the chart exactly the way you'd watch it live.",
  },
  {
    n: "03",
    title: "Mark up your setup",
    desc: "Draw trend lines, plant a long box, mark your stop. Everything stays pinned to price even when you change timeframes.",
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[#050b1f] text-white px-6 sm:px-10 py-24 scroll-mt-20"
      style={bodyFont}
    >
      <Reveal className="max-w-3xl mx-auto text-center">
        <span
          className="inline-flex items-center gap-2 text-sm tracking-[0.18em] uppercase text-sky-300/80"
          style={displayFont}
        >
          <span className="w-6 h-px bg-sky-300/60" />
          How it works
        </span>
        <h2
          className="mt-5 font-bold tracking-[-0.02em] leading-[1.05] text-5xl sm:text-6xl"
          style={displayFont}
        >
          Three steps to your first replay.
        </h2>
      </Reveal>

      <div className="relative mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* connector line (md+) */}
        <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-linear-to-r from-transparent via-sky-300/30 to-transparent" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-2xl bg-white/4 border border-white/10 backdrop-blur p-9 sm:p-10 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-[#050b1f] border border-sky-300/40 text-sky-300 flex items-center justify-center font-semibold text-base tabular-nums shadow-[0_0_24px_rgba(125,211,252,0.25)]">
              {step.n}
            </div>
            <h3
              className="mt-6 text-2xl font-semibold tracking-tight"
              style={displayFont}
            >
              {step.title}
            </h3>
            <p className="mt-3 text-base text-white/60 leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
