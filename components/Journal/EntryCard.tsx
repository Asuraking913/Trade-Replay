import { motion } from "motion/react";
import { JournalEntry } from "./types";
import { EMOTIONS, displayFont, easeOut } from "./constants";
import { riskReward, fmtDate, fmtPrice } from "./utils";

interface EntryCardProps {
  item: JournalEntry;
  onDelete: (id: string) => void;
}

export default function EntryCard({ item, onDelete }: EntryCardProps) {
  const itemRr = riskReward(item.direction, item.entry, item.stop, item.target);
  const emo = EMOTIONS.find((e) => e.key === item.emotion);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="rounded-xl bg-white/5 border border-white/10 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight" style={displayFont}>
            {item.symbol}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
              item.direction === "long"
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-rose-400/15 text-rose-300"
            }`}
          >
            {item.direction}
          </span>
          {emo && (
            <span title={emo.label} className="text-base leading-none">
              {emo.emoji}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(item.id)}
          aria-label="Delete plan"
          className="text-white/30 hover:text-rose-300 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {(item.entry != null || item.stop != null || item.target != null) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
          {item.entry != null && (
            <span>
              Entry{" "}
              <span className="text-white/90 tabular-nums">
                {fmtPrice(item.entry)}
              </span>
            </span>
          )}
          {item.stop != null && (
            <span>
              Stop{" "}
              <span className="text-white/90 tabular-nums">
                {fmtPrice(item.stop)}
              </span>
            </span>
          )}
          {item.target != null && (
            <span>
              Target{" "}
              <span className="text-white/90 tabular-nums">
                {fmtPrice(item.target)}
              </span>
            </span>
          )}
          {itemRr != null && (
            <span className="text-sky-300">1:{itemRr.toFixed(2)} R</span>
          )}
        </div>
      )}

      {item.setups.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.setups.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.thesis && (
        <p className="mt-3 text-sm text-white/70 leading-[1.55]">
          {item.thesis}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-white/35">
        <span>Confidence {item.confidence}/10</span>
        <span>{fmtDate(item.createdAt)}</span>
      </div>
    </motion.div>
  );
}
