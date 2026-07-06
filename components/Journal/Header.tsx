import Link from "next/link";
import NavBar from "@/components/shared/NavBar";

export default function JournalHeader() {
  return (
    <NavBar
      tone="onDark"
      right={
        <Link
          href="/chart"
          className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          Open chart
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      }
    />
  );
}
