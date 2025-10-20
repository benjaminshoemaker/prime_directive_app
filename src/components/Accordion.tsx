"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-input bg-card shadow-sm">
            <button
              type="button"
              className="w-full px-4 py-3 text-left text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">{item.title}</div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isOpen ? "rotate-180 text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
              </div>
            </button>
            <div
              className={cn(
                "grid origin-top transform transition-[grid-template-rows,opacity] duration-200 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden px-4 pb-4 text-sm text-muted-foreground">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
