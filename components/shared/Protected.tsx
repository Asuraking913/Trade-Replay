"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Spinner from "./Spinner";

// Client-side guard: redirects to /login when there's no authenticated user.
export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050b1f] text-white">
        <Spinner size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
