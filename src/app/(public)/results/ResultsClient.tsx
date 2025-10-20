"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  CreditCard,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  Minus,
  PiggyBank,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import {
  selectActiveStep,
  usePrimeDirectiveStore,
} from "@/lib/state/store";
import type { Intake, StepCardModel, StepId } from "@/lib/decision";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { StepDetailOverlay } from "@/components/StepDetailOverlay";

const STEP_ICONS: Record<StepId, React.ReactNode> = {
  step0_budget: <DollarSign className="w-6 h-6" />,
  step1_emergency_fund: <PiggyBank className="w-6 h-6" />,
  step2_employer_match: <TrendingUp className="w-6 h-6" />,
  step3_high_apr_debt: <CreditCard className="w-6 h-6" />,
  step4_ira: <Sparkles className="w-6 h-6" />,
  step5_increase_workplace_retirement: <ArrowLeftRight className="w-6 h-6" />,
  step6a_hsa: <Heart className="w-6 h-6" />,
  step6b_529: <GraduationCap className="w-6 h-6" />,
  step6c_down_payment: <Home className="w-6 h-6" />,
  step6d_taxable: <TrendingDown className="w-6 h-6" />,
};

export default function ResultsClient() {
  const router = useRouter();
  const [modalStepId, setModalStepId] = useState<StepId | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const steps = usePrimeDirectiveStore((state) => state.steps);
  const intake = usePrimeDirectiveStore((state) => state.intake);
  const completeActive = usePrimeDirectiveStore((state) => state.completeActive);
  const skipActive = usePrimeDirectiveStore((state) => state.skipActive);
  const unskip = usePrimeDirectiveStore((state) => state.unskip);
  const resetIntake = usePrimeDirectiveStore((state) => state.resetIntake);
  const activeStep = usePrimeDirectiveStore(selectActiveStep);
  const hasHydrated =
    usePrimeDirectiveStore.persist?.hasHydrated?.() ?? true;
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!steps.length) {
      router.replace("/intake/1");
    }
  }, [hasHydrated, steps.length, router]);

  useEffect(() => {
    if (activeStep) {
      setLiveMessage(`${activeStep.title} is now active.`);
    } else if (steps.length) {
      setLiveMessage("All steps are complete. Celebrate your progress!");
    }
  }, [activeStep, activeStep?.id, activeStep?.title, steps.length]);

  const modalStep = useMemo(() => {
    if (!modalStepId) return null;
    return steps.find((step) => step.id === modalStepId) ?? null;
  }, [modalStepId, steps]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#3ABAB3", "#F9C74F", "#1E2A33"],
    });
  };

  const handleComplete = () => {
    const alreadyCompleted = steps.some((step) => step.state === "completed");
    completeActive();
    if (!alreadyCompleted && !hasCelebrated) {
      triggerConfetti();
      setHasCelebrated(true);
    }
  };

  const handleSkip = () => {
    skipActive();
  };

  if (!hasHydrated) {
    return null;
  }

  if (!steps.length) {
    return null;
  }

  const completedSteps = steps.filter((step) => step.state === "completed");
  const progressPercent =
    steps.length === 0
      ? 0
      : Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-white border-b px-4 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Your Financial Roadmap
          </h1>
          <p className="text-sm text-muted-foreground">
            Guided by the NextStep Money playbook
          </p>
        </div>
      </div>

      <section aria-live="polite" className="visually-hidden">
        {liveMessage}
      </section>

      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {activeStep ? (
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-3xl border-none bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-white/20 p-3">
                    <div className="h-6 w-6">
                      {STEP_ICONS[activeStep.id] ?? (
                        <Sparkles className="h-6 w-6" aria-hidden />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="mb-1 text-sm opacity-90">
                      Step {activeStep.order + 1}
                    </p>
                    <h2 className="text-2xl font-bold">{activeStep.title}</h2>
                    <p className="opacity-95">{activeStep.why}</p>
                  </div>
                  <ul className="space-y-2">
                    {activeStep.howBullets.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleComplete}
                      className="flex-1 h-12 rounded-md bg-white text-primary font-medium transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/30"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="flex-1 h-12 rounded-md border border-white/40 bg-white/10 text-white font-medium transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/30"
                    >
                      Skip for now
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalStepId(activeStep.id)}
                    className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/30"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-3xl border border-input bg-card p-6 text-center shadow-card"
              >
                <Sparkles className="mx-auto h-10 w-10 text-primary" aria-hidden />
                <p className="mt-3 text-lg font-semibold text-foreground">
                  You’ve completed the roadmap!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revisit any step below or restart the intake to build a fresh plan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-3xl border border-input bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Your Progress
              </h2>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length} of {steps.length} completed
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-primary/20">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Emergency Fund</p>
                <p className="font-semibold text-foreground">
                  {typeof intake?.efMonths === "number"
                    ? intake.efMonths >= 6
                      ? "6+ months ✓"
                      : intake.efMonths === 0
                        ? "Not started"
                        : `${intake.efMonths} ${
                            intake.efMonths === 1 ? "month" : "months"
                          }`
                    : "Add in intake"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Income</p>
                <p className="font-semibold text-foreground">
                  {intake?.takeHomeBand
                    ? bandToCopy(intake.takeHomeBand)
                    : "Update intake"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-input bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Complete Roadmap
            </h3>
            <Accordion
              items={steps.map((step) => ({
                id: step.id,
                title: (
                  <div className="flex items-center gap-3 text-left flex-1 pr-2">
                    {renderStepStatusIcon(step)}
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "font-semibold text-sm",
                          step.state === "skipped" && "line-through opacity-60",
                        )}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                ),
                content: (
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">{step.why}</p>
                    <ul className="space-y-2 text-sm">
                      {step.howBullets.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {step.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModalStepId(step.id)}
                        className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Learn More
                      </button>
                      {step.state === "skipped" && (
                        <button
                          type="button"
                          onClick={() => unskip(step.id)}
                          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          Unskip
                        </button>
                      )}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>

      <footer className="border-t bg-white px-4 py-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              resetIntake();
              router.push("/intake/1");
            }}
            className="h-11 rounded-md border border-input px-5 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Restart Quiz
          </button>
          <Link
            href="/privacy"
            className="min-h-[44px] px-4 text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Privacy Notice
          </Link>
        </div>
      </footer>

      {modalStep && (
        <StepDetailOverlay
          step={modalStep}
          onClose={() => setModalStepId(null)}
        />
      )}
    </div>
  );
}

function renderStepStatusIcon(step: StepCardModel) {
  switch (step.state) {
    case "completed":
      return (
        <CheckCircle2
          className="h-5 w-5 flex-shrink-0 text-primary"
          aria-hidden
        />
      );
    case "active":
      return (
        <Circle
          className="h-5 w-5 flex-shrink-0 fill-primary text-primary"
          aria-hidden
        />
      );
    case "skipped":
      return (
        <Minus
          className="h-5 w-5 flex-shrink-0 text-muted-foreground"
          aria-hidden
        />
      );
    default:
      return (
        <Circle
          className="h-5 w-5 flex-shrink-0 text-muted-foreground"
          aria-hidden
        />
      );
  }
}

function bandToCopy(band: Intake["takeHomeBand"]) {
  switch (band) {
    case "lt2k":
      return "< $2,000";
    case "2to3k":
      return "$2,000–$3,000";
    case "4to5k":
      return "$4,000–$5,000";
    case "6to9k":
      return "$6,000–$9,000";
    case "gte10k":
      return "$10,000+";
    default:
      return "Update intake";
  }
}
