import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20",
      "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      "h-12 w-full px-5",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));

SecondaryButton.displayName = "SecondaryButton";
