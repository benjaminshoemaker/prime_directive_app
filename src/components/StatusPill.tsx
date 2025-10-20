import type { StepState } from "@/lib/decision";
import { cn } from "@/lib/utils/cn";
import {
  CheckCircle2,
  Circle,
  Clock4,
  PauseCircle,
} from "lucide-react";

export interface StatusPillProps {
  state: StepState;
  className?: string;
}

export function StatusPill({ state, className }: StatusPillProps) {
  const config: Record<StepState, { label: string; icon: React.ReactNode; classes: string }> = {
    active: {
      label: "Active",
      icon: <Clock4 className="h-4 w-4" aria-hidden />,
      classes: "bg-primary text-primary-foreground",
    },
    pending: {
      label: "Next",
      icon: <Circle className="h-4 w-4" aria-hidden />,
      classes: "bg-secondary text-secondary-foreground",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle2 className="h-4 w-4" aria-hidden />,
      classes: "border border-primary/30 bg-primary/10 text-primary",
    },
    skipped: {
      label: "Skipped",
      icon: <PauseCircle className="h-4 w-4" aria-hidden />,
      classes: "bg-muted text-muted-foreground",
    },
  };

  const { label, icon, classes } = config[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
        classes,
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
