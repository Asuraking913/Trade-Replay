"use client";

import { useCallback, useEffect, useState } from "react";
import { JournalEntry } from "./types";
import {
  fetchEntries,
  createEntry,
  deleteEntry as apiDeleteEntry,
  type NewJournalEntry,
} from "@/lib/journalApi";

// Shared journal state backed by the API. Used by both the entry form page and
// the entries view so load/create/delete lives in one place.
export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Throws on failure so the form can surface the error and keep the inputs.
  const addEntry = useCallback(async (input: NewJournalEntry) => {
    const created = await createEntry(input);
    setEntries((prev) => [created, ...prev]);
  }, []);

  const deleteEntry = useCallback(
    async (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id)); // optimistic
      try {
        await apiDeleteEntry(id);
      } catch {
        refresh(); // resync if the server rejected it
      }
    },
    [refresh]
  );

  return { entries, hydrated, error, addEntry, deleteEntry };
}
