import { Card } from "./ui/card";
import { StatusPill, StepStatus } from "./StatusPill";
import { CardActions } from "./CardActions";
import { CheckCircle2, Minus } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useEffect } from "react";

export interface FinancialStep {
  id: string;
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  why: string;
  actions: string[];
  showIf?: (data: any) => boolean;
}

interface StepCardProps {
  step: FinancialStep;
  status: StepStatus;
  onComplete: () => void;
  onSkip: () => void;
  onLearnMore: () => void;
  isFirst?: boolean;
}

export function StepCard({
  step,
  status,
  onComplete,
  onSkip,
  onLearnMore,
  isFirst,
}: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll to card when it becomes active
  useEffect(() => {
    if (status === "active" && cardRef.current && !isFirst) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
  }, [status, isFirst]);

  const cardClassNames = {
    active: "border-primary border-2 shadow-lg bg-primary/5",
    completed: "border-border bg-secondary/50 opacity-80",
    skipped: "border-border bg-muted/30 opacity-60",
    pending: "border-border bg-card",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{
        scale: status === "active" ? 1 : 1,
        opacity: status === "skipped" ? 0.6 : 1,
      }}
      transition={{ duration: 0.15 }}
      id={`step-${step.id}`}
    >
      <Card
        className={`p-6 transition-all duration-150 ${cardClassNames[status]}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`mt-1 p-2 rounded-lg ${
                status === "active"
                  ? "bg-primary/10"
                  : status === "completed"
                  ? "bg-secondary"
                  : "bg-secondary/50"
              }`}
            >
              {status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : status === "skipped" ? (
                <Minus className="w-5 h-5 text-muted-foreground" />
              ) : (
                <div className="w-5 h-5 text-foreground">{step.icon}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                Step {step.stepNumber}
              </div>
              <h3
                className={`${
                  status === "skipped"
                    ? "text-muted-foreground line-through"
                    : ""
                }`}
                style={{ fontWeight: 600 }}
              >
                {step.title}
              </h3>
            </div>
          </div>
          <StatusPill status={status} />
        </div>

        {/* Why this matters */}
        <p
          className={`text-sm mb-4 ${
            status === "skipped" ? "text-muted-foreground" : ""
          }`}
        >
          {step.why}
        </p>

        {/* Actions list */}
        {status !== "skipped" && (
          <ul className="space-y-2 mb-3">
            {step.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className={status === "completed" ? "opacity-70" : ""}>
                  {action}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Learn more link */}
        {status !== "skipped" && (
          <button
            onClick={onLearnMore}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
          >
            Learn more
          </button>
        )}

        {/* Actions for active card */}
        {status === "active" && (
          <CardActions onComplete={onComplete} onSkip={onSkip} />
        )}
      </Card>
    </motion.div>
  );
}
