"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { ReportsData, TimeGranularity } from "./types";
import { MOCK_REPORTS, DEFAULT_GRANULARITY, displayFont } from "./constants";
import DashboardHeader from "./Header";
import ChartPanel from "./ChartPanel";
import ReportCard from "./ReportCard";

interface DashboardProps {
  // Injected for a future API; falls back to mock data for now.
  data?: ReportsData;
}

export default function Dashboard({ data = MOCK_REPORTS }: DashboardProps) {
  const [granularity, setGranularity] =
    useState<TimeGranularity>(DEFAULT_GRANULARITY);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden text-text ${
        isDark ? "bg-[#050b1f]" : "bg-bg-elev"
      }`}
    >
      {/* Soft glow — matches the Journal's backdrop in dark mode. */}
      {isDark && (
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-275 h-275 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(56, 132, 220, 0.5), rgba(56, 132, 220, 0) 70%)",
          }}
        />
      )}

      <div className="relative z-10">
        <DashboardHeader
          accountLabel={data.accountLabel}
          dateRangeLabel={data.dateRangeLabel}
        />

        <div className="w-full px-3 sm:px-4 lg:px-6 pb-6">
        <div className="flex items-center gap-2 mb-5 text-sm">
          <span
            className="font-semibold text-text-strong border-b-2 border-accent pb-0.5"
            style={displayFont}
          >
            Summary
          </span>
          <span className="text-text-muted">
            report for{" "}
            <span className="text-text-strong font-medium">
              {data.reportForLabel}
            </span>
          </span>
        </div>

        <ChartPanel
          data={data.series[granularity]}
          granularity={granularity}
          onGranularityChange={setGranularity}
          isDark={isDark}
        />

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.cards.map((card) => (
            <ReportCard key={card.title} card={card} isDark={isDark} />
          ))}
        </div>
        </div>
      </div>
    </main>
  );
}
