import type { Intake } from "@/lib/decision";
import type { RadioOption } from "@/components/RadioGroup";

export type IntakeStepKey =
  | "zip"
  | "householdSize"
  | "takeHomeBand"
  | "highAprDebt"
  | "employerMatch"
  | "efMonths";

export interface IntakeStepConfig {
  index: number;
  key: IntakeStepKey;
  title: string;
  description?: string;
  inputType: "text" | "number" | "radio" | "slider";
  placeholder?: string;
  helperText?: string;
  radioOptions?: RadioOption[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export const INTAKE_STEPS: IntakeStepConfig[] = [
  {
    index: 0,
    key: "zip",
    title: "What's your ZIP code?",
    description: "This helps us understand your area's cost of living.",
    inputType: "text",
    placeholder: "12345",
    helperText: "5-digit ZIP code",
    required: true,
  },
  {
    index: 1,
    key: "householdSize",
    title: "Household size?",
    description: "Including yourself and any dependents.",
    inputType: "radio",
    radioOptions: [
      { value: "1", label: "1 person" },
      { value: "2", label: "2 people" },
      { value: "3", label: "3 people" },
      { value: "4", label: "4 people" },
      { value: "5+", label: "5 or more" },
    ],
    required: true,
  },
  {
    index: 2,
    key: "takeHomeBand",
    title: "Monthly take-home income?",
    description: "After taxes and deductions.",
    inputType: "slider",
    min: 500,
    max: 15000,
    step: 100,
    helperText: "Slide to the closest amount.",
  },
  {
    index: 3,
    key: "highAprDebt",
    title: "Do you have high-interest debt?",
    description: "Credit cards, payday loans, or debt over 10% APR.",
    inputType: "radio",
    radioOptions: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
    required: true,
  },
  {
    index: 4,
    key: "employerMatch",
    title: "Employer retirement match?",
    description: "Does your employer match 401(k) or similar contributions?",
    inputType: "radio",
    radioOptions: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
    required: true,
  },
  {
    index: 5,
    key: "efMonths",
    title: "Emergency fund coverage?",
    description: "How many months of expenses do you have saved?",
    inputType: "slider",
    min: 0,
    max: 6,
    step: 1,
    helperText: "Update this anytime as your savings grows.",
  },
];

export const TOTAL_INTAKE_STEPS = INTAKE_STEPS.length;

export function isIntakeComplete(intake: Partial<Intake>): intake is Intake {
  return (
    typeof intake.zip === "string" &&
    intake.zip.length === 5 &&
    typeof intake.householdSize === "number" &&
    intake.householdSize >= 1 &&
    typeof intake.takeHomeBand === "string" &&
    typeof intake.highAprDebt === "string" &&
    typeof intake.employerMatch === "string"
  );
}
