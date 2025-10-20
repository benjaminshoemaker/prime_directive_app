export type StepId =
  | "step0_budget"
  | "step1_emergency_fund"
  | "step2_employer_match"
  | "step3_high_apr_debt"
  | "step4_ira"
  | "step5_increase_workplace_retirement"
  | "step6a_hsa"
  | "step6b_529"
  | "step6c_down_payment"
  | "step6d_taxable";

export type StepState = "active" | "pending" | "completed" | "skipped";

export interface StepCardModel {
  id: StepId;
  title: string;
  why: string;
  howBullets: string[];
  links: { label: string; href: string }[];
  state: StepState;
  order: number;
}

export interface Intake {
  zip: string;
  householdSize: number;
  takeHomeBand: "lt2k" | "2to3k" | "4to5k" | "6to9k" | "gte10k";
  highAprDebt: "yes" | "no" | "unsure";
  employerMatch: "yes" | "no" | "unsure";
  efMonths?: number;
}

