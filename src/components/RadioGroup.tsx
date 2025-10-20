import { cn } from "@/lib/utils/cn";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  required,
  error,
}: RadioGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">
        {legend}
      </legend>
      <div className="grid gap-3">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-input bg-card px-4 py-4 shadow-sm transition",
                isSelected
                  ? "border-primary ring-2 ring-primary/40"
                  : "hover:border-primary/30 hover:bg-secondary",
              )}
            >
              <span className="flex flex-1 flex-col">
                <span className="text-base font-semibold text-foreground">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
              <input
                type="radio"
                id={id}
                name={name}
                required={required}
                checked={isSelected}
                onChange={() => onChange?.(option.value)}
                className="h-5 w-5 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}
