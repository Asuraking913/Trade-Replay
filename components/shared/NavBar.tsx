import Link from "next/link";
import type { ReactNode } from "react";

const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

// "onDark" renders white-on-dark (for pages with a forced dark background,
// e.g. the Journal). "themed" follows the light/dark theme tokens (e.g. the
// Dashboard, which has a theme toggle).
type NavTone = "onDark" | "themed";

interface NavBarProps {
  tone?: NavTone;
  /** Right-side slot: nav links, actions, theme toggle, etc. */
  right?: ReactNode;
  /** Override the header padding so it can align with a page's content grid. */
  padding?: string;
}

export default function NavBar({
  tone = "themed",
  right,
  padding = "px-6 sm:px-10 py-6",
}: NavBarProps) {
  const onDark = tone === "onDark";

  return (
    <header
      className={`relative z-10 flex items-center justify-between gap-3 ${padding}`}
    >
      <Link href="/" className="group flex items-center gap-3 outline-none">
        <div
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
            onDark ? "bg-white/95" : "bg-accent"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={onDark ? "#050b1f" : "#fff"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
        </div>
        <span
          className={`text-xl font-semibold tracking-tight transition-colors ${
            onDark
              ? "text-white group-hover:text-sky-200"
              : "text-text-strong group-hover:text-accent"
          }`}
          style={displayFont}
        >
          Trade Replay
        </span>
      </Link>

      {right ? (
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {right}
        </div>
      ) : null}
    </header>
  );
}
