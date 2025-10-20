"use client";

import { cn } from "@/lib/utils/cn";

export interface ProgressDotsProps {
  currentIndex: number;
  total: number;
}

export function ProgressDots({ currentIndex, total }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        return (
          <span
            key={index}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition",
              isActive
                ? "bg-primary"
                : isCompleted
                  ? "bg-primary/40"
                  : "bg-muted",
            )}
          />
        );
      })}
    </div>
  );
}
