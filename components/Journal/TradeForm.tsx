import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Direction } from "./types";
import { SETUP_TAGS, EMOTIONS, easeOut } from "./constants";
import { riskReward, parseNum } from "./utils";
import Spinner from "@/components/shared/Spinner";

interface TradeFormProps {
  symbol: string;
  setSymbol: (v: string) => void;
  direction: Direction;
  setDirection: (d: Direction) => void;
  entry: string;
  setEntry: (v: string) => void;
  stop: string;
  setStop: (v: string) => void;
  target: string;
  setTarget: (v: string) => void;
  confidence: number;
  setConfidence: (v: number) => void;
  setups: string[];
  toggleSetup: (tag: string) => void;
  emotion: string | null;
  setEmotion: (v: string | null) => void;
  thesis: string;
  setThesis: (v: string) => void;
  canSave: boolean;
  justSaved: boolean;
  saving: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-sky-300/50 focus:bg-white/8 transition-colors";
const labelCls = "block text-xs uppercase tracking-wider text-white/45 mb-2";

export default function TradeForm({
  symbol,
  setSymbol,
  direction,
  setDirection,
  entry,
  setEntry,
  stop,
  setStop,
  target,
  setTarget,
  confidence,
  setConfidence,
  setups,
  toggleSetup,
  emotion,
  setEmotion,
  thesis,
  setThesis,
  canSave,
  justSaved,
  saving,
  error,
  onSubmit,
}: TradeFormProps) {
  const rr = useMemo(
    () =>
      riskReward(direction, parseNum(entry), parseNum(stop), parseNum(target)),
    [direction, entry, stop, target]
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
      onSubmit={onSubmit}
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 sm:p-8"
    >
      {/* Symbol + direction */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className={labelCls}>Symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="BTC/USD"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Direction</label>
          <div className="flex rounded-lg bg-white/5 border border-white/10 p-1">
            {(["long", "short"] as Direction[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  direction === d
                    ? d === "long"
                      ? "bg-emerald-400/90 text-[#050b1f]"
                      : "bg-rose-400/90 text-[#050b1f]"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Entry</label>
          <input
            inputMode="decimal"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="0.00"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Stop</label>
          <input
            inputMode="decimal"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            placeholder="0.00"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Target</label>
          <input
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="0.00"
            className={inputCls}
          />
        </div>
      </div>

      {/* R:R readout */}
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-white/45">Risk : Reward</span>
        <span
          className={`font-semibold ${
            rr == null
              ? "text-white/35"
              : rr >= 2
              ? "text-emerald-300"
              : rr >= 1
              ? "text-sky-300"
              : "text-rose-300"
          }`}
        >
          {rr == null ? "—" : `1 : ${rr.toFixed(2)}`}
        </span>
      </div>

      {/* Setup tags */}
      <div className="mt-6">
        <label className={labelCls}>What&apos;s the setup?</label>
        <div className="flex flex-wrap gap-2">
          {SETUP_TAGS.map((tag) => {
            const active = setups.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleSetup(tag)}
                className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                  active
                    ? "bg-sky-300 text-[#050b1f] border-sky-300 font-medium"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotional state */}
      <div className="mt-6">
        <label className={labelCls}>How do you feel right now?</label>
        <div className="grid grid-cols-4 gap-2">
          {EMOTIONS.map((e) => {
            const active = emotion === e.key;
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => setEmotion(active ? null : e.key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors ${
                  active
                    ? "bg-white/10 border-sky-300/60"
                    : "bg-white/[0.03] border-white/10 hover:border-white/25"
                }`}
              >
                <span className="text-2xl leading-none">{e.emoji}</span>
                <span className="text-xs text-white/60">{e.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confidence */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-white/45">
            Confidence
          </label>
          <span className="text-sm font-semibold text-sky-300">
            {confidence}/10
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-sky-300"
        />
      </div>

      {/* Thesis */}
      <div className="mt-6">
        <label className={labelCls}>Trade thesis</label>
        <textarea
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          rows={4}
          placeholder="Why are you taking this trade? What invalidates it?"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <motion.button
          type="submit"
          disabled={!canSave || saving}
          whileHover={canSave && !saving ? { scale: 1.02 } : undefined}
          whileTap={canSave && !saving ? { scale: 0.98 } : undefined}
          aria-busy={saving}
          className={`flex items-center justify-center gap-2 text-base font-medium px-6 py-3.5 rounded-lg transition-shadow ${
            canSave && !saving
              ? "bg-sky-300 hover:bg-sky-200 text-[#050b1f] hover:shadow-[0_0_24px_2px_rgba(125,211,252,0.45)]"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <Spinner size={16} />
              Saving…
            </>
          ) : (
            <>
              Log trade plan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </motion.button>
        <AnimatePresence>
          {justSaved && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-emerald-300"
            >
              Saved ✓
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-3 text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
    </motion.form>
  );
}
