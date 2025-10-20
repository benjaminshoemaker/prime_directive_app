import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { StepCard, FinancialStep } from "./StepCard";
import { RoadmapRow } from "./RoadmapRow";
import { StepStatus, StatusPill } from "./StatusPill";
import {
  DollarSign,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Home,
  Sparkles,
  GraduationCap,
  Heart,
  Building2,
  TrendingDown,
  CheckCircle2,
  Circle,
  Minus,
} from "lucide-react";
import type { IntakeData } from "./IntakeWizard";
import confetti from "canvas-confetti";

interface StepState {
  [key: string]: StepStatus;
}

interface ResultsProps {
  data: IntakeData;
  onRestart: () => void;
  onStepDetail: (step: FinancialStep) => void;
  onPrivacy: () => void;
}

export function Results({ data, onRestart, onStepDetail, onPrivacy }: ResultsProps) {
  const [stepStates, setStepStates] = useState<StepState>({});
  const [hasCompletedFirst, setHasCompletedFirst] = useState(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Define all possible steps with conditional visibility
  const allSteps: FinancialStep[] = [
    {
      id: "budget",
      stepNumber: 0,
      title: "Budget & Reduce Fixed Costs",
      icon: <DollarSign className="w-5 h-5" />,
      why: "Know where every dollar goes before you spend it",
      actions: [
        "Track all income and expenses for one month",
        "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
        "Identify areas where you can cut unnecessary spending",
        "Set up automatic bill payments to avoid late fees",
      ],
    },
    {
      id: "starter-emergency",
      stepNumber: 1,
      title: "Emergency Fund (Seed 1 Month)",
      icon: <PiggyBank className="w-5 h-5" />,
      why: "Protect yourself from life's unexpected expenses",
      actions: [
        "Save $500-$1,000 in a separate savings account",
        "Set up automatic weekly transfers of $25-$50",
        "Use a high-yield savings account for better returns",
        "Only use this fund for true emergencies",
      ],
      showIf: (d: IntakeData) => d.emergencyFundMonths < 1,
    },
    {
      id: "employer-match",
      stepNumber: 2,
      title: "Capture Employer Match",
      icon: <TrendingUp className="w-5 h-5" />,
      why: "Free money from your employer — a guaranteed 100% return",
      actions: [
        "Find out your employer's matching percentage",
        "Contribute enough to get the full match (usually 3-6%)",
        "Set up automatic payroll deductions",
        "This comes before extra debt payments — it's that valuable",
      ],
      showIf: (d: IntakeData) => d.hasEmployerMatch === "yes",
    },
    {
      id: "high-interest-debt",
      stepNumber: 3,
      title: "Pay High-APR Debt",
      icon: <CreditCard className="w-5 h-5" />,
      why: "High-interest debt costs you money every single day",
      actions: [
        "List all debts with interest rates above 10%",
        "Use the avalanche method: pay highest interest first",
        "Pay more than the minimum whenever possible",
        "Consider balance transfer to 0% APR card if eligible",
        "Stop using credit cards until debt is paid off",
      ],
      showIf: (d: IntakeData) => d.hasHighInterestDebt === "yes",
    },
    {
      id: "full-emergency",
      stepNumber: 4,
      title: "Build 3-6 Months Emergency Fund",
      icon: <Home className="w-5 h-5" />,
      why: "True financial security means surviving job loss or major setbacks",
      actions: [
        "Calculate 3-6 months of essential expenses",
        "Save systematically in a high-yield savings account",
        "Adjust target based on job stability and household size",
        "Keep this money separate and easily accessible",
      ],
      showIf: (d: IntakeData) => d.emergencyFundMonths < 6,
    },
    {
      id: "ira",
      stepNumber: 5,
      title: "Fund IRA (Roth/Traditional)",
      icon: <Sparkles className="w-5 h-5" />,
      why: "Tax-advantaged retirement growth for your future",
      actions: [
        "Max out Roth IRA ($7,000/year in 2025)",
        "Choose Roth if income < $150k, Traditional if higher",
        "Set up automatic monthly contributions",
        "Invest in low-cost index funds",
      ],
    },
    {
      id: "workplace-retirement",
      stepNumber: 6,
      title: "Increase Workplace Retirement Contributions",
      icon: <TrendingUp className="w-5 h-5" />,
      why: "Maximize tax-advantaged retirement savings",
      actions: [
        "Increase 401(k) to 15-20% of income",
        "Aim for the IRS max ($23,500 in 2025)",
        "Adjust with every raise",
        "Rebalance annually",
      ],
    },
    {
      id: "hsa",
      stepNumber: 7,
      title: "HSA (If High-Deductible Plan)",
      icon: <Heart className="w-5 h-5" />,
      why: "Triple tax advantage for healthcare expenses",
      actions: [
        "Verify you have a qualified HDHP",
        "Max contribution: $4,150 individual, $8,300 family (2025)",
        "Invest HSA funds — don't just save cash",
        "Pay out-of-pocket now, save HSA for retirement",
      ],
    },
    {
      id: "education-529",
      stepNumber: 8,
      title: "529 Education Savings",
      icon: <GraduationCap className="w-5 h-5" />,
      why: "Tax-free growth for your children's education",
      actions: [
        "Open a 529 plan in your state",
        "Check for state tax deductions",
        "Set up automatic monthly contributions",
        "Age-based portfolios adjust risk over time",
      ],
    },
    {
      id: "down-payment",
      stepNumber: 9,
      title: "Down-Payment Fund",
      icon: <Building2 className="w-5 h-5" />,
      why: "Save for a home without raiding retirement",
      actions: [
        "Target 20% down to avoid PMI",
        "High-yield savings for 3-5 year timeline",
        "CDs or bonds for longer timelines",
        "Keep separate from emergency fund",
      ],
    },
    {
      id: "taxable-investing",
      stepNumber: 10,
      title: "Taxable Investing",
      icon: <TrendingDown className="w-5 h-5" />,
      why: "Build wealth beyond tax-advantaged accounts",
      actions: [
        "Only after maxing retirement accounts",
        "Use tax-efficient index funds (VTI, VTSAX)",
        "Tax-loss harvesting to offset gains",
        "Hold at least 1 year for long-term capital gains",
      ],
    },
  ];

  // Filter steps based on intake data and renumber
  const visibleSteps = allSteps
    .filter((step) => (step.showIf ? step.showIf(data) : true))
    .map((step, index) => ({
      ...step,
      stepNumber: index,
    }));

  // Initialize step states
  useEffect(() => {
    const initialStates: StepState = {};
    visibleSteps.forEach((step, index) => {
      initialStates[step.id] = index === 0 ? "active" : "pending";
    });
    setStepStates(initialStates);
  }, []);

  const announceToScreenReader = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3ABAB3", "#F9C74F", "#1E2A33"],
    });
  };

  const handleComplete = (stepId: string) => {
    setStepStates((prev) => {
      const newStates = { ...prev, [stepId]: "completed" };
      
      // Find next pending step and make it active
      const nextPending = visibleSteps.find(
        (step) => newStates[step.id] === "pending"
      );
      if (nextPending) {
        newStates[nextPending.id] = "active";
      }

      return newStates;
    });

    announceToScreenReader("Step marked completed");

    if (!hasCompletedFirst) {
      triggerConfetti();
      setHasCompletedFirst(true);
    }
  };

  const handleSkip = (stepId: string) => {
    setStepStates((prev) => {
      const newStates = { ...prev, [stepId]: "skipped" };
      
      // Find next pending step and make it active
      const nextPending = visibleSteps.find(
        (step) => newStates[step.id] === "pending"
      );
      if (nextPending) {
        newStates[nextPending.id] = "active";
      }

      return newStates;
    });

    announceToScreenReader("Step skipped");
  };

  const handleUnskip = (stepId: string) => {
    setStepStates((prev) => {
      const newStates = { ...prev };
      
      // Set currently active step to pending
      const currentActive = visibleSteps.find(
        (step) => newStates[step.id] === "active"
      );
      if (currentActive) {
        newStates[currentActive.id] = "pending";
      }

      // Make unskipped step active
      newStates[stepId] = "active";

      return newStates;
    });

    announceToScreenReader("Step unskipped, now active");
  };

  const scrollToStep = (stepId: string) => {
    const element = document.getElementById(`step-${stepId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const completedCount = Object.values(stepStates).filter(
    (status) => status === "completed"
  ).length;
  const progressPercent = (completedCount / visibleSteps.length) * 100;

  // Find the active step
  const activeStep = visibleSteps.find((step) => stepStates[step.id] === "active");

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* ARIA Live Region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />

      {/* Header */}
      <div className="bg-white border-b px-4 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl text-center" style={{ fontWeight: 700 }}>
            Your Financial Roadmap
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Guided by the NextStep Money playbook
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Primary Active Step Card */}
          {activeStep && (
            <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-lg">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-white/20 p-3 rounded-lg">
                  <div className="w-6 h-6">{activeStep.icon}</div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-sm opacity-90 mb-1">
                      Step {activeStep.stepNumber}
                    </div>
                    <h2 className="text-2xl mb-2" style={{ fontWeight: 700 }}>
                      {activeStep.title}
                    </h2>
                    <p className="opacity-95">{activeStep.why}</p>
                  </div>

                  <div className="space-y-2">
                    {activeStep.actions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleComplete(activeStep.id)}
                      variant="secondary"
                      className="flex-1 h-12"
                    >
                      Complete
                    </Button>
                    <Button
                      onClick={() => handleSkip(activeStep.id)}
                      variant="outline"
                      className="flex-1 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                    >
                      Skip for now
                    </Button>
                  </div>

                  <Button
                    onClick={() => onStepDetail(activeStep)}
                    variant="ghost"
                    className="w-full mt-2 text-white hover:bg-white/10 hover:text-white"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Progress Snapshot */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 style={{ fontWeight: 600 }}>Your Progress</h2>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {visibleSteps.length} completed
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Fund</p>
                  <p style={{ fontWeight: 600 }}>
                    {data.emergencyFundMonths === 0
                      ? "Not started"
                      : data.emergencyFundMonths === 6
                      ? "6+ months ✓"
                      : `${data.emergencyFundMonths} ${
                          data.emergencyFundMonths === 1 ? "month" : "months"
                        }`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p style={{ fontWeight: 600 }}>
                    ${data.monthlyIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Complete Roadmap - Collapsible */}
          <Card className="p-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Complete Roadmap
            </h3>
            <Accordion type="single" collapsible className="space-y-2">
              {visibleSteps.map((step) => {
                const status = stepStates[step.id] || "pending";
                return (
                  <AccordionItem
                    key={step.id}
                    value={step.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left flex-1 pr-2">
                        {status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : status === "active" ? (
                          <Circle className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
                        ) : status === "skipped" ? (
                          <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div
                            style={{ fontWeight: 600 }}
                            className={status === "skipped" ? "line-through opacity-60" : ""}
                          >
                            {step.title}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <StatusPill status={status} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.why}
                      </p>
                      <ul className="space-y-2">
                        {step.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => onStepDetail(step)}
                          variant="outline"
                          size="sm"
                        >
                          Learn More
                        </Button>
                        {status === "skipped" && (
                          <Button
                            onClick={() => handleUnskip(step.id)}
                            variant="default"
                            size="sm"
                          >
                            Unskip
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={onRestart} variant="outline">
            Restart Quiz
          </Button>
          <button
            onClick={onPrivacy}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-4"
          >
            Privacy Notice
          </button>
        </div>
      </footer>
    </div>
  );
}
