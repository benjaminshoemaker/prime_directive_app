"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/Input";
import { Slider } from "@/components/Slider";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  INTAKE_STEPS,
  TOTAL_INTAKE_STEPS,
  isIntakeComplete,
} from "@/lib/state/intake-flow";
import { usePrimeDirectiveStore } from "@/lib/state/store";
import type { Intake } from "@/lib/decision";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const INCOME_MIN = 500;
const INCOME_MAX = 15000;
const INCOME_STEP = 100;

const HOUSEHOLD_OPTIONS = ["1", "2", "3", "4", "5+"];
const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

type IntakeParam = {
  params: { step: string };
};

function getStepIndex(stepParam: string): number {
  const parsed = Number(stepParam);
  if (Number.isNaN(parsed)) return 0;
  const zeroBased = parsed - 1;
  return Math.min(Math.max(zeroBased, 0), TOTAL_INTAKE_STEPS - 1);
}

function getPathForIndex(index: number) {
  return `/intake/${index + 1}`;
}

function bandFromSlider(value: number): Intake["takeHomeBand"] {
  if (value < 2000) return "lt2k";
  if (value < 4000) return "2to3k";
  if (value < 6000) return "4to5k";
  if (value < 10000) return "6to9k";
  return "gte10k";
}

function sliderFromBand(band?: Intake["takeHomeBand"], fallback = 3000) {
  switch (band) {
    case "lt2k":
      return 1500;
    case "2to3k":
      return 2500;
    case "4to5k":
      return 4500;
    case "6to9k":
      return 7500;
    case "gte10k":
      return 12000;
    default:
      return fallback;
  }
}

export default function IntakeStepPage({ params }: IntakeParam) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const stepIndex = getStepIndex(params.step);
  const step = INTAKE_STEPS[stepIndex];
  const isLastStep = stepIndex === TOTAL_INTAKE_STEPS - 1;

  const {
    intakeDraft,
    updateIntakeDraft,
    recomputePlan,
    monthlyIncomeEstimate,
    setMonthlyIncomeEstimate,
  } = usePrimeDirectiveStore((state) => ({
    intakeDraft: state.intakeDraft,
    updateIntakeDraft: state.updateIntakeDraft,
    recomputePlan: state.recomputePlan,
    monthlyIncomeEstimate: state.monthlyIncomeEstimate,
    setMonthlyIncomeEstimate: state.setMonthlyIncomeEstimate,
  }));

  useEffect(() => {
    const normalized = stepIndex + 1;
    if (params.step !== String(normalized)) {
      router.replace(getPathForIndex(stepIndex));
    }
  }, [params.step, router, stepIndex]);

  useEffect(() => {
    if (monthlyIncomeEstimate == null) {
      setMonthlyIncomeEstimate(sliderFromBand(intakeDraft.takeHomeBand));
    }
  }, [intakeDraft.takeHomeBand, monthlyIncomeEstimate, setMonthlyIncomeEstimate]);

  const incomeValue = useMemo(() => {
    if (typeof monthlyIncomeEstimate === "number") {
      return monthlyIncomeEstimate;
    }
    return sliderFromBand(intakeDraft.takeHomeBand);
  }, [intakeDraft.takeHomeBand, monthlyIncomeEstimate]);

  const emergencyValue =
    typeof intakeDraft.efMonths === "number" ? intakeDraft.efMonths : 0;

  useEffect(() => {
    if (step.key === "takeHomeBand" && !intakeDraft.takeHomeBand) {
      updateIntakeDraft({ takeHomeBand: bandFromSlider(incomeValue) });
    }
  }, [incomeValue, intakeDraft.takeHomeBand, step.key, updateIntakeDraft]);

  const progressPercent = Math.round(
    ((stepIndex + 1) / TOTAL_INTAKE_STEPS) * 100,
  );

  const validateAndAdvance = () => {
    let validationError: string | null = null;

    switch (step.key) {
      case "zip": {
        const cleaned = String(intakeDraft.zip ?? "").replace(/\D/g, "").slice(0, 5);
        if (cleaned.length !== 5) {
          validationError = "Enter a valid 5-digit ZIP code.";
        } else if (cleaned !== intakeDraft.zip) {
          updateIntakeDraft({ zip: cleaned });
        }
        break;
      }
      case "householdSize": {
        if (typeof intakeDraft.householdSize !== "number") {
          validationError = "Select your household size.";
        }
        break;
      }
      case "takeHomeBand": {
        if (!intakeDraft.takeHomeBand) {
          validationError = "Adjust the slider to the closest amount.";
        }
        break;
      }
      case "highAprDebt": {
        if (!intakeDraft.highAprDebt) {
          validationError = "Select an answer.";
        }
        break;
      }
      case "employerMatch": {
        if (!intakeDraft.employerMatch) {
          validationError = "Select an answer.";
        }
        break;
      }
      default:
        break;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    if (isLastStep) {
      const maybeComplete: Partial<Intake> = {
        ...intakeDraft,
        efMonths: emergencyValue,
      };
      if (isIntakeComplete(maybeComplete)) {
        recomputePlan(maybeComplete);
        router.push("/loading");
      } else {
        setError("Please finish each question before viewing your plan.");
      }
      return;
    }

    setDirection(1);
    router.push(getPathForIndex(stepIndex + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
  } as const;

  const renderStepBody = () => {
    switch (step.key) {
      case "zip":
        return (
          <div className="mx-auto max-w-xs">
            <Input
              name="zip"
              value={String(intakeDraft.zip ?? "")}
              onChange={(event) => {
                const next = event.target.value.replace(/\D/g, "");
                updateIntakeDraft({ zip: next });
              }}
              maxLength={5}
              inputMode="numeric"
              pattern="\\d{5}"
              placeholder="12345"
              helperText={!error ? "5-digit ZIP code" : undefined}
              error={error ?? undefined}
              className="h-14 text-center text-lg"
            />
          </div>
        );
      case "householdSize":
        return (
          <div className="mt-6 space-y-3">
            {HOUSEHOLD_OPTIONS.map((option) => {
              const isActive = option === "5+"
                ? (intakeDraft.householdSize ?? 0) >= 5
                : intakeDraft.householdSize === Number(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const numeric = option === "5+" ? 5 : Number(option);
                    updateIntakeDraft({ householdSize: numeric });
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl bg-secondary px-4 py-4 text-left transition hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive && "ring-2 ring-primary bg-primary/10",
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {option} {option === "1" ? "person" : "people"}
                  </span>
                </button>
              );
            })}
          </div>
        );
      case "takeHomeBand":
        return (
          <div className="mt-8 space-y-6">
            <div className="text-center text-4xl font-bold text-primary">
              ${incomeValue.toLocaleString()}
            </div>
            <Slider
              label="Monthly take-home income"
              value={incomeValue}
              min={INCOME_MIN}
              max={INCOME_MAX}
              step={INCOME_STEP}
              onValueChange={(value) => {
                setMonthlyIncomeEstimate(value);
                updateIntakeDraft({ takeHomeBand: bandFromSlider(value) });
                setError(null);
              }}
              helperText="Slide to the closest amount."
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$500</span>
              <span>$15,000+</span>
            </div>
          </div>
        );
      case "highAprDebt":
        return (
          <div className="mt-6 space-y-3">
            {YES_NO_UNSURE.map((option) => {
              const isActive = intakeDraft.highAprDebt === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateIntakeDraft({ highAprDebt: option.value as Intake["highAprDebt"] });
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl bg-secondary px-4 py-4 text-left transition hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive && "ring-2 ring-primary bg-primary/10",
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        );
      case "employerMatch":
        return (
          <div className="mt-6 space-y-3">
            {YES_NO_UNSURE.map((option) => {
              const isActive = intakeDraft.employerMatch === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateIntakeDraft({ employerMatch: option.value as Intake["employerMatch"] });
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl bg-secondary px-4 py-4 text-left transition hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive && "ring-2 ring-primary bg-primary/10",
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        );
      case "efMonths":
        return (
          <div className="mt-8 space-y-6">
            <div className="text-center text-4xl font-bold text-primary">
              {emergencyValue === 0
                ? "None"
                : emergencyValue >= 6
                  ? "6+ months"
                  : `${emergencyValue} ${
                      emergencyValue === 1 ? "month" : "months"
                    }`}
            </div>
            <Slider
              label="Emergency fund coverage"
              value={emergencyValue}
              min={0}
              max={6}
              step={1}
              onValueChange={(value) => {
                updateIntakeDraft({ efMonths: value });
                setError(null);
              }}
              helperText="Update this anytime as your savings grows."
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>None</span>
              <span>6+ months</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-white px-4 py-6 shadow-sm">
        <div className="mx-auto flex w-full max-w-md items-center gap-4">
          {stepIndex === 0 ? (
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Back to start"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDirection(-1);
                router.push(getPathForIndex(stepIndex - 1));
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
          )}
          <div className="flex-1">
            <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
                aria-hidden
              />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {stepIndex + 1}/{TOTAL_INTAKE_STEPS}
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
            {step.description && (
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            )}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-8 flex-1"
            >
              {renderStepBody()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 pt-4">
            <PrimaryButton type="button" onClick={validateAndAdvance} className="h-14">
              {isLastStep ? "See My Plan →" : "Next →"}
            </PrimaryButton>
          </div>
        </div>
      </main>
      <p className="px-4 pb-6 text-center text-xs text-muted-foreground">
        Your answers stay on this device. No account required.
      </p>
    </div>
  );
}
