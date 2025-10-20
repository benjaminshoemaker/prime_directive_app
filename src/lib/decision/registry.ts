import type { StepCardModel, StepId } from "./types";

export interface StepDefinition {
  id: StepId;
  order: number;
  title: string;
  why: string;
  howBullets: string[];
  links: { label: string; href: string }[];
}

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: "step0_budget",
    order: 0,
    title: "Build a simple spending plan",
    why: "Knowing where each dollar goes makes the rest of the plan possible.",
    howBullets: [
      "List every source of take-home pay and the date it arrives.",
      "Write down the bills, needs, and regular wants you must cover each month.",
      "Match your paychecks to those costs so nothing is missed.",
    ],
    links: [
      {
        label: "CFPB budgeting worksheet",
        href: "https://www.consumerfinance.gov/consumer-tools/budgeting/worksheet/",
      },
      {
        label: "FDIC Money Smart spending plan",
        href: "https://moneysmartcbi.fdic.gov/spending-plan",
      },
    ],
  },
  {
    id: "step1_emergency_fund",
    order: 1,
    title: "Set up an emergency fund",
    why: "Cash savings shields you from using credit when life happens.",
    howBullets: [
      "Open a no-fee savings account you will not touch for everyday spending.",
      "Automate a transfer each payday, even if it is a small amount.",
      "Aim for one month of bare-bones costs, then build toward three.",
    ],
    links: [
      {
        label: "FDIC emergency savings tips",
        href: "https://www.fdic.gov/resources/consumers/money/savings.html",
      },
      {
        label: "America Saves emergency fund guide",
        href: "https://americasaves.org/resource-center/save-for-emergencies/",
      },
    ],
  },
  {
    id: "step2_employer_match",
    order: 2,
    title: "Capture your employer match",
    why: "Leaving matching dollars is the same as passing up free pay.",
    howBullets: [
      "Review your plan summary to confirm the match formula and vesting rules.",
      "Increase your contribution to at least the percentage that earns the full match.",
      "Set reminders to verify the match posts with each paycheck.",
    ],
    links: [
      {
        label: "DOL guide to workplace plans",
        href: "https://www.dol.gov/sites/dolgov/files/ebsa/about-ebsa/our-activities/resource-center/publications/savings-fitness.pdf",
      },
      {
        label: "FINRA employer match explainer",
        href: "https://www.finra.org/investors/learn-to-invest/types-investments/retirement/employer-sponsored-plans",
      },
    ],
  },
  {
    id: "step3_high_apr_debt",
    order: 3,
    title: "Knock out high interest debt",
    why: "High APR balances cost more than most investments earn.",
    howBullets: [
      "List each credit card or loan with its APR and minimum payment.",
      "Pay the minimums on all debts and send any extra money to the highest APR.",
      "Call lenders about hardship programs or lower-rate options if you fall behind.",
    ],
    links: [
      {
        label: "FTC guidance on dealing with debt",
        href: "https://consumer.ftc.gov/articles/dealing-debt",
      },
      {
        label: "NFCC certified credit counseling",
        href: "https://www.nfcc.org/get-help/",
      },
    ],
  },
  {
    id: "step4_ira",
    order: 4,
    title: "Open or fund an IRA",
    why: "An IRA adds tax-advantaged savings for your future self.",
    howBullets: [
      "Choose between a Roth or Traditional IRA based on your expected tax rate.",
      "Open the account at a low-cost provider with no annual maintenance fee.",
      "Automate monthly contributions that fit your spending plan.",
    ],
    links: [
      {
        label: "IRS IRA contribution rules",
        href: "https://www.irs.gov/retirement-plans/individual-retirement-arrangements-iras",
      },
      {
        label: "FINRA IRA basics",
        href: "https://www.finra.org/investors/learn-to-invest/types-investments/retirement/iras",
      },
    ],
  },
  {
    id: "step5_increase_workplace_retirement",
    order: 5,
    title: "Increase workplace retirement savings",
    why: "Small contribution bumps now build large balances later.",
    howBullets: [
      "Check your plan's annual contribution limits for this year.",
      "Raise your deferral rate by 1–2% and line it up with a pay increase.",
      "Review your investment mix to confirm it matches your target risk level.",
    ],
    links: [
      {
        label: "DOL contribution limit overview",
        href: "https://www.dol.gov/general/topic/retirement/401k",
      },
      {
        label: "Investor.gov compound interest calculator",
        href: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
      },
    ],
  },
  {
    id: "step6a_hsa",
    order: 6,
    title: "Use a Health Savings Account",
    why: "HSAs offer triple tax benefits for health costs.",
    howBullets: [
      "Confirm you are enrolled in an HSA-eligible high deductible health plan.",
      "Set contributions through payroll to capture the tax break.",
      "Save receipts so you can reimburse yourself later tax-free.",
    ],
    links: [
      {
        label: "Treasury overview of HSAs",
        href: "https://www.treasury.gov/resource-center/faqs/Taxes/Pages/Health-Savings-Accounts.aspx",
      },
      {
        label: "Healthcare.gov HSA explainer",
        href: "https://www.healthcare.gov/high-deductible-health-plans/",
      },
    ],
  },
  {
    id: "step6b_529",
    order: 7,
    title: "Start a 529 education fund",
    why: "529 plans keep education savings growing tax-free.",
    howBullets: [
      "Compare your state's plan with low-fee national options.",
      "Name a beneficiary and automate monthly transfers.",
      "Select an age-based portfolio that adjusts risk over time.",
    ],
    links: [
      {
        label: "SEC 529 plan highpoints",
        href: "https://www.sec.gov/fast-answers/answers529htm.html",
      },
      {
        label: "Federal Student Aid saving guide",
        href: "https://studentaid.gov/resources/prepare-for-college/choosing-schools/save",
      },
    ],
  },
  {
    id: "step6c_down_payment",
    order: 8,
    title: "Plan a down payment fund",
    why: "Dedicated savings keeps home goals on track.",
    howBullets: [
      "Estimate your target price range and set a goal of 5–20% for the down payment.",
      "Place the savings in a high-yield account or CD to protect the timeline.",
      "Automate transfers each payday and track progress every quarter.",
    ],
    links: [
      {
        label: "HUD homebuyer tools",
        href: "https://www.hud.gov/topics/buying_a_home",
      },
      {
        label: "CFPB down payment guide",
        href: "https://www.consumerfinance.gov/owning-a-home/down-payment/",
      },
    ],
  },
  {
    id: "step6d_taxable",
    order: 9,
    title: "Invest in a taxable brokerage account",
    why: "Taxable investing grows wealth once tax-advantaged buckets are full.",
    howBullets: [
      "Open a low-cost brokerage account that supports automatic investing.",
      "Use broad-market index funds and reinvest dividends.",
      "Track cost basis and plan for the taxes due on gains each year.",
    ],
    links: [
      {
        label: "SEC beginner investing guide",
        href: "https://www.sec.gov/investor/pubs/ib_beginnerstrategies.pdf",
      },
      {
        label: "FINRA brokerage account overview",
        href: "https://www.finra.org/investors/learn-to-invest/types-investments/brokerage-accounts",
      },
    ],
  },
];

export const STEP_DEFINITION_MAP: Record<StepId, StepDefinition> =
  STEP_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.id] = definition;
    return acc;
  }, {} as Record<StepId, StepDefinition>);

export interface ProgramRegistry {
  id: string;
  locale: string;
  stepOverrides?: Partial<Record<StepId, Partial<StepDefinition>>>;
}

export const featureFlags = {
  seattleResourcePack: false,
  enableAutomationPreview: false,
};

export function applyDefinitionToModel(
  definition: StepDefinition,
  state: StepCardModel["state"],
): StepCardModel {
  return {
    ...definition,
    state,
  };
}

