import { cn } from "@/lib/utils/cn";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  min: number;
  max: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  suffix?: string;
  helperText?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value = min,
  onValueChange,
  suffix,
  helperText,
  className,
  ...props
}: SliderProps) {
  const sliderId = props.id ?? `${label}-${min}-${max}`.toLowerCase();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={sliderId}
          className="text-sm font-semibold text-foreground"
        >
          {label}
        </label>
        <span className="text-sm font-semibold text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="h-2 w-full appearance-none rounded-full bg-secondary accent-primary"
        {...props}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
