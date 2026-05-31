"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import LandingNav from "./Nav";
import DashboardMock from "./DashboardMock";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function LandingHero() {
  const [email, setEmail] = useState("");

  return (
    <section
      id="product"
      className="relative w-full min-h-screen overflow-hidden bg-[#050b1f] text-white scroll-mt-20"
      style={bodyFont}
    >
      {/* Radial accent glow behind the hero, sits above the bg but below content */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-275 h-275 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56, 132, 220, 0.55), rgba(56, 132, 220, 0) 70%)",
        }}
      />
      {/* Faint conic shine on the right side */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-175 h-175 opacity-30"
        style={{
          background:
            "conic-gradient(from 200deg at 80% 50%, rgba(125,211,252,0.15), transparent 30%)",
        }}
      />

      <LandingNav />

      <div className="relative z-10 px-6 sm:px-10 pt-10 sm:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.05 }}
          className="text-center font-bold tracking-[-0.02em] leading-[1.02] text-6xl sm:text-7xl lg:text-8xl max-w-5xl mx-auto"
          style={displayFont}
        >
          Transform{" "}
          <span className="bg-linear-to-r from-sky-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
            the way
          </span>
          <br />
          you trade
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
          className="mt-8 text-center text-lg sm:text-xl text-white/65 max-w-xl mx-auto leading-[1.6] font-light"
        >
          Safe and easy back-testing tools for traders who want to practice
          their edge — without the risk.
        </motion.p>

        {/* Email + CTA pill */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.4 }}
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/login";
          }}
          className="mt-10 flex justify-center"
        >
          <div className="group flex items-center w-full max-w-xl gap-1 p-2 rounded-full bg-white/6 border border-white/10 backdrop-blur transition-colors focus-within:border-sky-300/50 focus-within:bg-white/8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Login or sign up with your email"
              className="flex-1 bg-transparent text-base text-white placeholder:text-white/45 outline-none px-5 py-2.5"
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-sky-300 hover:bg-sky-200 text-[#050b1f] text-base font-medium px-6 py-3 rounded-full shadow-[0_0_0_0_rgba(125,211,252,0)] hover:shadow-[0_0_24px_2px_rgba(125,211,252,0.45)] transition-shadow"
              >
                Get started
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.form>

        {/* Dashboard mock floating below the headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.55 }}
          className="mt-16 sm:mt-20 lg:mt-24 pb-16"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}
