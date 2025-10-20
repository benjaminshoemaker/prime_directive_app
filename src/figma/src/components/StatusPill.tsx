import { CheckCircle2, Circle, Minus } from "lucide-react";
import { Badge } from "./ui/badge";

export type StepStatus = "active" | "completed" | "skipped" | "pending";

interface StatusPillProps {
  status: StepStatus;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const config = {
    active: {
      label: "Active",
      icon: <Circle className="w-3 h-3 fill-current" />,
      className: "bg-primary text-primary-foreground shadow-sm",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle2 className="w-3 h-3 text-primary" />,
      className: "bg-primary/10 text-foreground border border-primary/20",
    },
    skipped: {
      label: "Skipped",
      icon: <Minus className="w-3 h-3" />,
      className: "bg-muted text-muted-foreground",
    },
    pending: {
      label: "Next",
      icon: <Circle className="w-3 h-3" />,
      className: "bg-secondary text-secondary-foreground",
    },
  };

  const { label, icon, className: statusClassName } = config[status];

  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 px-2 py-1 ${statusClassName} ${className}`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Badge>
  );
}
