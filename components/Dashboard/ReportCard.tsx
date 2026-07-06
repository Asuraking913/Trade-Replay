import { SummaryCard } from "./types";
import { displayFont } from "./constants";

interface ReportCardProps {
  card: SummaryCard;
  isDark?: boolean;
}

export default function ReportCard({ card, isDark = false }: ReportCardProps) {
  // Glass surface on the navy backdrop in dark mode; solid token surface in light.
  const surface = isDark
    ? "bg-white/[0.04] border-white/10 backdrop-blur-sm"
    : "bg-bg border-border";

  return (
    <div className={`rounded-xl border p-5 ${surface}`}>
      <h3
        className="text-base font-semibold text-text-strong tracking-tight"
        style={displayFont}
      >
        {card.title}
      </h3>

      <dl className="mt-4 space-y-2">
        {card.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <dt className="text-text-muted">{stat.label}</dt>
            <dd
              className={`font-medium tabular-nums ${
                stat.tone === "up"
                  ? "text-up"
                  : stat.tone === "down"
                  ? "text-down"
                  : "text-text-strong"
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 ${
          isDark ? "bg-accent/10" : "bg-accent-soft"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-accent"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <p className="text-xs leading-[1.5] text-text">{card.insight}</p>
      </div>
    </div>
  );
}
