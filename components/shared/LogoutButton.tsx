"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Spinner from "./Spinner";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    await logout();
    router.replace("/login");
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      title="Log out"
      className={
        className ??
        "flex items-center gap-2 text-sm text-text-muted hover:text-text-strong transition-colors disabled:opacity-60"
      }
    >
      {busy ? (
        <Spinner size={14} />
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )}
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
