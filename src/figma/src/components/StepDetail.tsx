import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { FinancialStep } from "./StepCard";

interface StepDetailProps {
  step: FinancialStep;
  onClose: () => void;
}

export function StepDetail({ step, onClose }: StepDetailProps) {
  const getDetailedInfo = (stepId: string) => {
    const details: Record<string, { whyMatters: string[]; howToDo: string[] }> = {
      budget: {
        whyMatters: [
          "You can't manage what you don't measure — a budget gives you complete visibility into your financial life.",
          "Most people underestimate spending by 20-30%. A budget reveals the truth.",
          "It's not about restriction — it's about intentional choices and guilt-free spending.",
        ],
        howToDo: [
          "Download a budgeting app (Mint, YNAB, EveryDollar) or use a simple spreadsheet",
          "List all income sources and their amounts",
          "Track every expense for 30 days — yes, every coffee and snack",
          "Categorize spending into needs, wants, and savings",
          "Review weekly and adjust as needed",
        ],
      },
      "starter-emergency": {
        whyMatters: [
          "Life happens: car repairs, medical bills, broken appliances. This fund prevents these from becoming debt.",
          "Financial emergencies are the #1 reason people go into high-interest debt.",
          "Having even $500 saved reduces financial stress significantly.",
        ],
        howToDo: [
          "Open a separate high-yield savings account (Ally, Marcus, or similar)",
          "Set up automatic weekly transfers — even $25/week = $1,300/year",
          "Name the account 'Emergency Fund' to create mental separation",
          "Celebrate milestones: $250, $500, $1,000",
          "Once you hit your goal, move to the next priority",
        ],
      },
      "employer-match": {
        whyMatters: [
          "If your employer matches 50% on 6% of salary, that's a guaranteed 50% return — better than any investment.",
          "Not taking the match is literally leaving free money on the table.",
          "This money compounds over decades — a 30-year-old contributing $3,000/year with match could have $500,000+ at retirement.",
        ],
        howToDo: [
          "Check your employee benefits portal or ask HR for match details",
          "Calculate the percentage needed to get the full match",
          "Log into your 401(k) and increase contribution percentage",
          "Choose a target-date fund if you're not sure what to invest in",
          "Verify the match is being deposited each pay period",
        ],
      },
      "high-interest-debt": {
        whyMatters: [
          "A $5,000 credit card balance at 20% APR costs $1,000/year in interest alone.",
          "Every dollar paid in interest is a dollar that can't be saved or invested.",
          "High-interest debt creates a downward spiral — break it fast.",
        ],
        howToDo: [
          "List all debts: balance, interest rate, minimum payment",
          "Pay minimums on everything, then attack highest interest rate first",
          "Call creditors to negotiate lower rates (success rate is ~50%)",
          "Consider a balance transfer to 0% APR card if you qualify",
          "Cut up credit cards until debt is gone — use debit only",
          "Increase payments by cutting unnecessary expenses",
        ],
      },
      "full-emergency": {
        whyMatters: [
          "Job loss, medical emergency, major home repair — these require months of runway.",
          "The average job search takes 3-6 months. Can you survive that long?",
          "This fund prevents panic decisions and gives you true financial freedom.",
        ],
        howToDo: [
          "Calculate monthly essential expenses: rent, food, utilities, insurance, minimums",
          "Multiply by 3-6 months (6 if single income, 3 if dual income)",
          "Save systematically — set up automatic transfers after each paycheck",
          "Use a high-yield savings account — currently 4-5% APY",
          "Keep it separate and accessible, but not too accessible (no debit card)",
        ],
      },
      ira: {
        whyMatters: [
          "Roth IRA grows tax-free forever — withdraw in retirement without paying a dime in taxes.",
          "Even $500/month from age 30-65 at 8% return = $1.1 million tax-free.",
          "More flexibility than 401(k) — contributions can be withdrawn anytime penalty-free.",
        ],
        howToDo: [
          "Open a Roth IRA at Vanguard, Fidelity, or Schwab",
          "Contribute $7,000/year (2025 limit)",
          "Set up automatic monthly transfers ($583/month)",
          "Invest in a target-date fund or 3-fund portfolio",
          "Max this before increasing 401(k) beyond the match",
        ],
      },
      "workplace-retirement": {
        whyMatters: [
          "401(k) contributions reduce your taxable income — save on taxes now.",
          "Employer plans often have lower fees than you think.",
          "The IRS limit is $23,500 (2025) — use it or lose it.",
        ],
        howToDo: [
          "Increase contribution percentage by 1-2% each year",
          "Aim for 15-20% of gross income total retirement savings",
          "Choose low-cost index funds or target-date funds",
          "Avoid company stock — too much concentration risk",
          "Rebalance once per year",
        ],
      },
      hsa: {
        whyMatters: [
          "Only account with triple tax advantage: deductible, grows tax-free, withdraws tax-free for medical.",
          "After age 65, works like a Traditional IRA for non-medical expenses.",
          "Average couple needs $300k for healthcare in retirement — HSA is perfect for this.",
        ],
        howToDo: [
          "Verify you have a high-deductible health plan (HDHP)",
          "Max contribution: $4,150 individual, $8,300 family (2025)",
          "Invest HSA funds — don't leave as cash",
          "Pay medical bills out-of-pocket if you can, let HSA grow",
          "Save receipts — you can reimburse yourself decades later",
        ],
      },
      "education-529": {
        whyMatters: [
          "529 plans grow tax-free for education expenses.",
          "Many states offer tax deductions for contributions.",
          "Can be used for K-12 private school ($10k/year) or college.",
        ],
        howToDo: [
          "Research your state's 529 plan for tax benefits",
          "Open account with you as owner, child as beneficiary",
          "Set up automatic monthly contributions",
          "Use age-based portfolio — gets conservative as college nears",
          "Can change beneficiary to another child if needed",
        ],
      },
      "down-payment": {
        whyMatters: [
          "20% down payment avoids PMI (private mortgage insurance) — saves thousands.",
          "Larger down payment = smaller mortgage = less interest paid.",
          "Separating this from retirement keeps goals distinct.",
        ],
        howToDo: [
          "Calculate target: 20% of expected home price + closing costs",
          "Timeline 3-5 years: high-yield savings",
          "Timeline 5+ years: consider conservative bond funds",
          "Don't raid retirement accounts — penalties and taxes hurt",
          "Keep fully funded emergency fund separate",
        ],
      },
      "taxable-investing": {
        whyMatters: [
          "Only do this after maxing all tax-advantaged accounts.",
          "More flexibility than retirement accounts — no age restrictions.",
          "Tax-efficient investing minimizes annual tax drag.",
        ],
        howToDo: [
          "Use a taxable brokerage account (Vanguard, Fidelity, Schwab)",
          "Invest in tax-efficient funds: VTI, VTSAX, or similar",
          "Avoid high-turnover funds and bonds (use retirement accounts for those)",
          "Tax-loss harvest to offset gains",
          "Hold at least 1 year for long-term capital gains treatment",
        ],
      },
    };

    return details[stepId] || { whyMatters: [], howToDo: [] };
  };

  const detail = getDetailedInfo(step.id);

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-white px-4 py-6 shadow-md">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">{step.icon}</div>
              <h1 className="text-2xl" style={{ fontWeight: 700 }}>
                {step.title}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="opacity-95">{step.why}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Why It Matters */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-xl" style={{ fontWeight: 700 }}>
                Why It Matters
              </h2>
            </div>
            <ul className="space-y-3">
              {detail.whyMatters.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p className="text-muted-foreground">{point}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* How To Do It */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-xl" style={{ fontWeight: 700 }}>
                How To Do It
              </h2>
            </div>
            <ol className="space-y-4">
              {detail.howToDo.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5 text-sm" style={{ fontWeight: 600 }}>
                    {index + 1}
                  </div>
                  <p className="flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-accent/10 border-accent/20">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Quick Actions
            </h3>
            <ul className="space-y-2">
              {step.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onClose} className="w-full" size="lg">
            Back to Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
