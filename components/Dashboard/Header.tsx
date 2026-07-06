import Link from "next/link";
import NavBar from "@/components/shared/NavBar";
import ThemeToggle from "@/components/Chart/ThemeToggle";
import LogoutButton from "@/components/shared/LogoutButton";
import { displayFont } from "./constants";

interface DashboardHeaderProps {
  accountLabel: string;
  dateRangeLabel: string;
}

// A read-only pill used for the mock Filters / date-range / account controls.
function Pill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-bg border border-border px-3 py-2 text-sm text-text">
      {icon}
      <span>{children}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

export default function DashboardHeader({
  accountLabel,
  dateRangeLabel,
}: DashboardHeaderProps) {
  return (
    <>
      <NavBar
        tone="themed"
        padding="px-3 sm:px-4 lg:px-6 py-5"
        right={
          <>
            <Link
              href="/chart"
              className="hidden sm:flex items-center gap-2 text-sm text-text-muted hover:text-text-strong transition-colors"
            >
              Open chart
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link
              href="/journal"
              className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Go To Journal</span>
            </Link>

            <ThemeToggle />
            <LogoutButton />
          </>
        }
      />

      <header className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-text-strong"
          style={displayFont}
        >
          Dashboard
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Pill
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            }
          >
            Filters
          </Pill>
          <Pill
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          >
            {dateRangeLabel}
          </Pill>
          <Pill
            icon={
              <span className="w-2 h-2 rounded-full bg-accent" />
            }
          >
            {accountLabel}
          </Pill>
        </div>
      </header>
    </>
  );
}
