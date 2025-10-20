import { StatusPill, StepStatus } from "./StatusPill";
import { CheckCircle2, Minus, Circle, ChevronRight } from "lucide-react";
import { FinancialStep } from "./StepCard";

interface RoadmapRowProps {
  step: FinancialStep;
  status: StepStatus;
  onUnskip?: () => void;
  onClick?: () => void;
}

export function RoadmapRow({ step, status, onUnskip, onClick }: RoadmapRowProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "skipped":
        return <Minus className="w-5 h-5 text-muted-foreground" />;
      case "active":
        return <Circle className="w-5 h-5 text-primary fill-primary" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center gap-3 p-4 rounded-lg transition-all cursor-pointer hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        status === "skipped" ? "opacity-60" : ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-0.5">
          Step {step.stepNumber}
        </div>
        <div
          className={`text-sm truncate ${
            status === "skipped" ? "line-through text-muted-foreground" : ""
          }`}
          style={{ fontWeight: status === "active" ? 600 : 400 }}
        >
          {step.title}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusPill status={status} />
        {status === "skipped" && onUnskip && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnskip();
            }}
            className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 min-h-[44px] flex items-center"
          >
            Unskip
          </button>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}
