"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LOADING_DELAY_MS = 2000;

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/results");
    }, LOADING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-muted-foreground">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-lg font-semibold text-foreground">
        Building your plan…
      </p>
      <p className="text-sm text-muted-foreground">
        This takes about two seconds.
      </p>
    </div>
  );
}
