import { render, screen, fireEvent } from "@testing-library/react";
import ResultsClient from "./ResultsClient";
import {
  usePrimeDirectiveStore,
  INITIAL_PRIME_DIRECTIVE_STATE,
} from "@/lib/state/store";
import type { Intake } from "@/lib/decision";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("canvas-confetti", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const SAMPLE_INTAKE: Intake = {
  zip: "98101",
  householdSize: 2,
  takeHomeBand: "4to5k",
  highAprDebt: "yes",
  employerMatch: "yes",
  efMonths: 1,
};

describe("ResultsClient", () => {
  beforeEach(() => {
    usePrimeDirectiveStore.setState({
      ...INITIAL_PRIME_DIRECTIVE_STATE,
    });
    usePrimeDirectiveStore.persist?.clearStorage?.();
    usePrimeDirectiveStore.getState().recomputePlan(SAMPLE_INTAKE);
  });

  it("advances to the next step when completing the active card", async () => {
    render(<ResultsClient />);

    expect(await screen.findByText(/Step 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Complete/i }));

    expect(await screen.findByText(/Step 2/i)).toBeInTheDocument();
  });

  it("marks the step as skipped when choosing skip", async () => {
    render(<ResultsClient />);

    fireEvent.click(screen.getByRole("button", { name: /Skip for now/i }));

    expect(await screen.findByText(/Step 2/i)).toBeInTheDocument();
  });
});
