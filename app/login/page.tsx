"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: no auth wired yet — drop the user into the chart.
    window.location.href = "/chart";
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050b1f] text-white px-6 overflow-hidden"
      style={bodyFont}
    >
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-275 h-275 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56, 132, 220, 0.5), rgba(56, 132, 220, 0) 70%)",
        }}
      />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      {/* Brand */}
      <Link href="/" className="relative z-10 flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-md bg-white/95 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050b1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
        </div>
        <span
          className="text-xl font-semibold tracking-tight"
          style={displayFont}
        >
          Trade Replay
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8 sm:p-10"
      >
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={displayFont}
        >
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {mode === "login"
            ? "Log in to continue your back-testing."
            : "Start practicing in seconds. No payment required."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-sky-300/50 focus:bg-white/8 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-sky-300/50 focus:bg-white/8 transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-sky-300 hover:bg-sky-200 text-[#050b1f] text-base font-medium px-6 py-3.5 rounded-lg shadow-[0_0_0_0_rgba(125,211,252,0)] hover:shadow-[0_0_24px_2px_rgba(125,211,252,0.45)] transition-shadow"
          >
            {mode === "login" ? "Log in" : "Create account"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/55">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-sky-300 hover:text-sky-200 transition-colors font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-sky-300 hover:text-sky-200 transition-colors font-medium"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-white/40">
          Or{" "}
          <Link
            href="/chart"
            className="text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            skip and open the chart
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
