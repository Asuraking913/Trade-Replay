"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Direction } from "./types";
import { bodyFont, displayFont, easeOut } from "./constants";
import { parseNum } from "./utils";
import { useJournalEntries } from "./useJournalEntries";
import JournalHeader from "./Header";
import TradeForm from "./TradeForm";
import EntryList from "./EntryList";

export default function Journal() {
  const { entries, hydrated, error, addEntry, deleteEntry } =
    useJournalEntries();

  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<Direction>("long");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [setups, setSetups] = useState<string[]>([]);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [thesis, setThesis] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canSave = symbol.trim().length > 0 && thesis.trim().length > 0;

  const toggleSetup = (tag: string) => {
    setSetups((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetForm = () => {
    setSymbol("");
    setDirection("long");
    setEntry("");
    setStop("");
    setTarget("");
    setConfidence(5);
    setSetups([]);
    setEmotion(null);
    setThesis("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await addEntry({
        symbol: symbol.trim().toUpperCase(),
        direction,
        entry: parseNum(entry),
        stop: parseNum(stop),
        target: parseNum(target),
        confidence,
        setups,
        emotion,
        thesis: thesis.trim(),
      });
      resetForm();
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2200);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

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

      <JournalHeader />

      <div className="relative z-10 px-6 sm:px-10 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="pt-6"
        >
          <p className="text-sm text-white/50">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1
            className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight"
            style={displayFont}
          >
            Plan the trade,{" "}
            <span className="bg-linear-to-r from-sky-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
              trade the plan
            </span>
          </h1>
          <p className="mt-3 text-white/55 max-w-xl leading-[1.6]">
            Document your thesis, levels and mindset <em>before</em> you enter.
            The trades you write down are the ones you understand.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-6">
          <TradeForm
            symbol={symbol}
            setSymbol={setSymbol}
            direction={direction}
            setDirection={setDirection}
            entry={entry}
            setEntry={setEntry}
            stop={stop}
            setStop={setStop}
            target={target}
            setTarget={setTarget}
            confidence={confidence}
            setConfidence={setConfidence}
            setups={setups}
            toggleSetup={toggleSetup}
            emotion={emotion}
            setEmotion={setEmotion}
            thesis={thesis}
            setThesis={setThesis}
            canSave={canSave}
            justSaved={justSaved}
            saving={saving}
            error={saveError}
            onSubmit={handleSubmit}
          />
          </div>

          <EntryList
            entries={entries}
            hydrated={hydrated}
            error={error}
            onDelete={deleteEntry}
          />
        </div>
      </div>
    </main>
  );
}
