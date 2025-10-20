"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  Circle,
  CreditCard,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  PiggyBank,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type { StepCardModel, StepId } from "@/lib/decision";

interface StepDetailContent {
  intro?: string;
  whyItMatters: string[];
  howToDo: string[];
  quickActions?: string[];
}

const STEP_DETAIL_CONTENT: Record<StepId, StepDetailContent> = {
  step0_budget: {
    intro: "Know where every dollar goes before you spend it.",
    whyItMatters: [
      "You can't manage what you don't measure — a budget gives you complete visibility into your financial life.",
      "Most people underestimate spending by 20-30%. A budget reveals the truth.",
      "It's not about restriction — it's about intentional choices and guilt-free spending.",
    ],
    howToDo: [
      "Download a budgeting app (Mint, YNAB, EveryDollar) or use a simple spreadsheet.",
      "List all income sources and their amounts.",
      "Track every expense for 30 days — yes, every coffee and snack.",
      "Categorize spending into needs, wants, and savings.",
      "Review weekly and adjust as needed.",
    ],
  },
  step1_emergency_fund: {
    intro: "Protect yourself from life's unexpected expenses.",
    whyItMatters: [
      "Emergencies are the #1 reason people go into high-interest debt.",
      "Even $500 saved can keep a car repair or medical bill from becoming credit card debt.",
      "An emergency fund lowers stress and keeps long-term goals intact.",
    ],
    howToDo: [
      "Open a separate high-yield savings account and nickname it “Emergency Fund.”",
      "Automate a weekly transfer—even $25 adds up to $1,300 a year.",
      "Start with a $500–$1,000 target, then build toward one month of essentials.",
      "Celebrate milestones to reinforce the habit.",
      "Move on once the fund reaches the starter goal.",
    ],
  },
  step2_employer_match: {
    intro: "Capture every dollar your employer is willing to match.",
    whyItMatters: [
      "Employer match dollars are a guaranteed return on your contributions.",
      "Skipping the match is the same as turning down part of your paycheck.",
      "Those extra dollars compound for decades toward retirement.",
    ],
    howToDo: [
      "Check your benefits portal or HR handbook for the exact match formula.",
      "Increase your contribution to the percentage that earns the full match.",
      "Choose a diversified target-date or index fund if you’re unsure where to invest.",
      "Verify the match amount on your statement each pay cycle.",
      "Revisit annually or when you receive raises.",
    ],
  },
  step3_high_apr_debt: {
    intro: "Stop high-interest balances from draining your future.",
    whyItMatters: [
      "A $5,000 balance at 20% APR costs about $1,000 per year in interest alone.",
      "Every dollar going to interest can’t be saved or invested.",
      "High-interest debt creates stress and slows every other goal.",
    ],
    howToDo: [
      "List every debt: balance, APR, and minimum payment.",
      "Pay minimums everywhere, then send extra to the highest APR (avalanche method).",
      "Call lenders to request hardship programs or lower rates.",
      "Consider a 0% balance-transfer card if you can pay it down within the intro window.",
      "Pause new discretionary spending until high-APR balances are cleared.",
    ],
  },
  step4_ira: {
    intro: "Add tax-advantaged growth outside your workplace plan.",
    whyItMatters: [
      "Roth IRA growth can be withdrawn tax-free in retirement.",
      "You control the provider, the fees, and the investments.",
      "Diversifying beyond your 401(k) gives you more withdrawal flexibility later.",
    ],
    howToDo: [
      "Choose a low-cost provider (Vanguard, Fidelity, or Schwab).",
      "Decide between Roth (pay tax now) or Traditional (defer tax) based on income and tax bracket.",
      "Set up automatic monthly transfers that hit the annual limit ($7,000 in 2025).",
      "Invest in broad-market index or target-date funds to stay diversified.",
      "Review contributions every tax year to stay within limits.",
    ],
  },
  step5_increase_workplace_retirement: {
    intro: "Let compounding work harder inside your workplace plan.",
    whyItMatters: [
      "Pre-tax contributions lower taxable income today.",
      "Even small percentage increases translate into large balances over decades.",
      "Staying on track now prevents a shortfall later in life.",
    ],
    howToDo: [
      "Log into your plan and increase your contribution by 1–2%.",
      "Aim for 15–20% of gross income across all retirement accounts.",
      "Stick with diversified, low-cost funds or a target-date fund.",
      "Automate future bump-ups to coincide with annual raises.",
      "Schedule an annual review to rebalance and stay aligned with goals.",
    ],
  },
  step6a_hsa: {
    intro: "Use the triple tax advantage to cover healthcare costs.",
    whyItMatters: [
      "HSAs are the only account with a triple tax benefit (pre-tax in, tax-free growth, tax-free withdrawals).",
      "Healthcare can be a six-figure retirement expense—HSAs keep those dollars sheltered.",
      "You can reimburse yourself years later if you save receipts.",
    ],
    howToDo: [
      "Confirm you’re enrolled in an HSA-eligible high-deductible health plan.",
      "Set payroll contributions that hit the annual limit (individual or family).",
      "Invest HSA funds in low-cost index options once the cash buffer is met.",
      "Pay current medical costs out of pocket when possible to let the HSA grow.",
      "Store receipts digitally so you can reimburse yourself in the future.",
    ],
  },
  step6b_529: {
    intro: "Keep education savings growing tax-free.",
    whyItMatters: [
      "529 contributions grow tax-deferred and withdrawals for qualified education are tax-free.",
      "Many states offer income tax deductions or credits for contributions.",
      "Funds can be reassigned to another beneficiary when plans change.",
    ],
    howToDo: [
      "Compare your state’s 529 plan against low-fee national options.",
      "Open the account with you as owner and your student as beneficiary.",
      "Automate monthly transfers aligned with your timeline.",
      "Choose an age-based portfolio that lowers risk as college approaches.",
      "Track state-specific benefits to maximize deductions or credits.",
    ],
  },
  step6c_down_payment: {
    intro: "Build a dedicated fund for your future home.",
    whyItMatters: [
      "A 20% down payment can eliminate PMI and reduce monthly mortgage costs.",
      "Separating this goal keeps emergency or retirement funds untouched.",
      "Cash ready before shopping gives you negotiating power.",
    ],
    howToDo: [
      "Estimate your target home price and calculate a 20% down payment.",
      "Pick the right vehicle: high-yield savings for <5 years, conservative investments for longer timelines.",
      "Automate transfers aligned with your purchase timeline.",
      "Keep this fund separate from your everyday savings.",
      "Review progress quarterly and adjust contributions as income changes.",
    ],
  },
  step6d_taxable: {
    intro: "Invest beyond tax-advantaged accounts for future flexibility.",
    whyItMatters: [
      "Taxable brokerage accounts unlock more growth once sheltered buckets are full.",
      "Money stays liquid with no early withdrawal penalties.",
      "Tax-efficient investing minimizes the drag from capital gains.",
    ],
    howToDo: [
      "Open a low-cost brokerage account (Vanguard, Fidelity, Schwab).",
      "Fund it automatically after maxing tax-advantaged accounts.",
      "Stick to broad, tax-efficient index funds and ETFs.",
      "Harvest tax losses in down years to offset gains elsewhere.",
      "Hold positions at least one year to qualify for lower long-term capital gains rates.",
    ],
  },
};

const STEP_DETAIL_ICONS: Partial<Record<StepId, React.ReactNode>> = {
  step0_budget: <DollarSign className="h-6 w-6" aria-hidden />,
  step1_emergency_fund: <PiggyBank className="h-6 w-6" aria-hidden />,
  step2_employer_match: <TrendingUp className="h-6 w-6" aria-hidden />,
  step3_high_apr_debt: <CreditCard className="h-6 w-6" aria-hidden />,
  step4_ira: <Sparkles className="h-6 w-6" aria-hidden />,
  step5_increase_workplace_retirement: (
    <ArrowLeftRight className="h-6 w-6" aria-hidden />
  ),
  step6a_hsa: <Heart className="h-6 w-6" aria-hidden />,
  step6b_529: <GraduationCap className="h-6 w-6" aria-hidden />,
  step6c_down_payment: <Home className="h-6 w-6" aria-hidden />,
  step6d_taxable: <TrendingDown className="h-6 w-6" aria-hidden />,
};

function usePortalElement() {
  if (typeof window === "undefined") return null;
  let node = document.getElementById("modal-root") as HTMLDivElement | null;
  if (!node) {
    node = document.createElement("div");
    node.id = "modal-root";
    document.body.appendChild(node);
  }
  return node;
}

interface StepDetailOverlayProps {
  step: StepCardModel;
  onClose: () => void;
}

export function StepDetailOverlay({ step, onClose }: StepDetailOverlayProps) {
  const container = usePortalElement();

  useEffect(() => {
    if (!container) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [container]);

  const detail = STEP_DETAIL_CONTENT[step.id];
  const quickActions = detail?.quickActions ?? step.howBullets;
  const howToDo = detail?.howToDo ?? step.howBullets;
  const whyItMatters = detail?.whyItMatters ?? [step.why];
  const icon = STEP_DETAIL_ICONS[step.id];

  if (!container) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-background/95 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pb-10 pt-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3 text-white">
                {icon ?? <Circle className="h-6 w-6" aria-hidden />}
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide opacity-90">
                  Step {step.order + 1}
                </p>
                <h1 className="text-2xl font-bold">{step.title}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/40"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="text-sm opacity-95">
            {detail?.intro ?? step.why}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-10">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Why It Matters</h2>
            <ul className="space-y-3">
              {whyItMatters.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">How To Do It</h2>
            <ol className="space-y-4">
              {howToDo.map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <ul className="space-y-2">
              {quickActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>,
    container,
  );
}
