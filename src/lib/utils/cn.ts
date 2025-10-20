import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-aware class name merger.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

