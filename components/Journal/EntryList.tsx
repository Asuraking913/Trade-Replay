import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { JournalEntry } from "./types";
import { displayFont, easeOut } from "./constants";
import EntryCard from "./EntryCard";

interface EntryListProps {
  entries: JournalEntry[];
  hydrated: boolean;
  error?: string | null;
  onDelete: (id: string) => void;
}

const MAX_VISIBLE = 10;

export default function EntryList({
  entries,
  hydrated,
  error,
  onDelete,
}: EntryListProps) {
  const visibleEntries = entries.slice(0, MAX_VISIBLE);
  const hiddenCount = entries.length - visibleEntries.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight" style={displayFont}>
            Planned trades
          </h2>
          <span className="text-sm text-white/40">{entries.length}</span>
        </div>
        {entries.length > 0 && (
          <Link
            href="/journal/entries"
            className="flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200 transition-colors"
          >
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        )}
      </div>

      {hydrated && error ? (
        <div className="rounded-2xl border border-dashed border-rose-400/25 p-10 text-center text-rose-300 text-sm">
          {error}
        </div>
      ) : hydrated && entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 p-10 text-center text-white/40 text-sm">
          No plans yet. Your logged trade plans will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visibleEntries.map((item) => (
              <EntryCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </AnimatePresence>

          {hiddenCount > 0 && (
            <Link
              href="/journal/entries"
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/12 py-3 text-sm text-white/60 hover:text-white hover:border-white/25 transition-colors"
            >
              View {hiddenCount} more {hiddenCount === 1 ? "plan" : "plans"}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
