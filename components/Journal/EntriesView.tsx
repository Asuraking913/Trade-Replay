"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import NavBar from "@/components/shared/NavBar";
import { bodyFont, displayFont, easeOut } from "./constants";
import { useJournalEntries } from "./useJournalEntries";
import EntryCard from "./EntryCard";

export default function EntriesView() {
  const { entries, hydrated, error, deleteEntry } = useJournalEntries();

  return (
    <main
      className="relative min-h-screen w-full bg-[#050b1f] text-white overflow-hidden"
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

      <NavBar
        tone="onDark"
        right={
          <>
            <Link
              href="/journal"
              className="flex items-center gap-2 rounded-lg bg-white text-[#050b1f] text-sm font-medium px-3.5 py-2 hover:bg-sky-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New entry
            </Link>
            <Link
              href="/chart"
              className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Open chart
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </>
        }
      />

      <div className="relative z-10 px-6 sm:px-10 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="pt-6"
        >
          <p className="text-sm text-white/50">Your journal</p>
          <h1
            className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight"
            style={displayFont}
          >
            Every plan{" "}
            <span className="bg-linear-to-r from-sky-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
              you&apos;ve logged
            </span>
          </h1>
          <p className="mt-3 text-white/55 max-w-xl leading-[1.6]">
            Review the trades you planned — the thesis, levels and mindset behind
            each one. Learn from the setups that worked and the ones that
            didn&apos;t.
          </p>
        </motion.div>

        <div className="mt-8 flex items-center gap-3 text-sm text-white/45">
          <span
            className="font-semibold text-white/70 border-b-2 border-sky-300 pb-0.5"
            style={displayFont}
          >
            All entries
          </span>
          {hydrated && (
            <span>
              {entries.length} {entries.length === 1 ? "plan" : "plans"} logged
            </span>
          )}
        </div>

        {hydrated && error ? (
          <div className="mt-6 rounded-2xl border border-dashed border-rose-400/25 p-12 sm:p-16 text-center text-rose-300 text-sm">
            {error}
          </div>
        ) : hydrated && entries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/12 p-12 sm:p-16 text-center">
            <p className="text-white/50 text-sm">
              No entries yet. The trade plans you log will show up here.
            </p>
            <Link
              href="/journal"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-300 hover:bg-sky-200 text-[#050b1f] text-sm font-medium px-4 py-2.5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Log your first trade
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence initial={false}>
              {entries.map((item) => (
                <EntryCard key={item.id} item={item} onDelete={deleteEntry} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
