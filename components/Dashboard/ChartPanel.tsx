import { ReportPoint, TimeGranularity } from "./types";
import { GRANULARITIES } from "./constants";
import PnlChart from "./PnlChart";

interface ChartPanelProps {
  data: ReportPoint[];
  granularity: TimeGranularity;
  onGranularityChange: (g: TimeGranularity) => void;
  isDark?: boolean;
}

function LegendItem({
  color,
  label,
  dashed,
  isDark,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  isDark?: boolean;
}) {
  const chip = isDark
    ? "bg-white/5 border-white/10"
    : "bg-bg border-border";
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-text ${chip}`}>
      <span
        className="inline-block w-3.5 h-0.5"
        style={{
          background: dashed
            ? `repeating-linear-gradient(to right, ${color} 0 4px, transparent 4px 7px)`
            : color,
        }}
      />
      {label}
    </div>
  );
}

export default function ChartPanel({
  data,
  granularity,
  onGranularityChange,
  isDark = false,
}: ChartPanelProps) {
  const panel = isDark
    ? "bg-white/[0.03] border-white/10 backdrop-blur-sm"
    : "bg-bg-elev border-border";
  const segment = isDark ? "bg-white/5 border-white/10" : "bg-bg border-border";

  return (
    <div className={`rounded-xl border p-5 ${panel}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <LegendItem color="var(--accent)" label="Net P&L" isDark={isDark} />
          <span className="text-text-muted text-sm">vs</span>
          <LegendItem color="var(--up)" label="Win Rate %" dashed isDark={isDark} />
        </div>

        <div className={`flex rounded-lg border p-1 ${segment}`}>
          {GRANULARITIES.map((g) => (
            <button
              key={g.key}
              onClick={() => onGranularityChange(g.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                granularity === g.key
                  ? "bg-text-strong text-bg"
                  : "text-text-muted hover:text-text-strong"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-72 w-full">
        <PnlChart data={data} />
      </div>
    </div>
  );
}
