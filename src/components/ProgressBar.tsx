import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  helper?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ProgressBar({
  label,
  value,
  max,
  helper,
  icon,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-input bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <span className="text-sm font-semibold text-primary">{percentage}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${percentage}%` }}
          aria-hidden
        />
      </div>
      {helper && <p className="mt-2 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}
