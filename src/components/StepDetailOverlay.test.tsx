import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { StepDetailOverlay } from "./StepDetailOverlay";
import {
  STEP_DEFINITION_MAP,
  applyDefinitionToModel,
} from "@/lib/decision/registry";
import type { StepCardModel } from "@/lib/decision";

function createStep(id: keyof typeof STEP_DEFINITION_MAP): StepCardModel {
  return applyDefinitionToModel(STEP_DEFINITION_MAP[id], "active");
}

describe("StepDetailOverlay", () => {
  beforeEach(() => {
    const portal = document.createElement("div");
    portal.id = "modal-root";
    document.body.appendChild(portal);
  });

  afterEach(() => {
    cleanup();
    const portal = document.getElementById("modal-root");
    portal?.remove();
  });

  it("renders full-screen detail content for a predefined step", () => {
    const step = createStep("step0_budget");
    render(<StepDetailOverlay step={step} onClose={() => {}} />);

    expect(screen.getByRole("heading", { name: /Build a simple spending plan/i })).toBeVisible();
    expect(screen.getByText(/Why It Matters/i)).toBeVisible();
    expect(
      screen.getByText(/You can't manage what you don't measure/i),
    ).toBeVisible();
    expect(screen.getByText(/How To Do It/i)).toBeVisible();
    expect(
      screen.getByText(/Download a budgeting app/i),
    ).toBeVisible();
    expect(screen.getByText(/Quick Actions/i)).toBeVisible();
  });

  it("calls onClose when the close button is clicked", () => {
    const step = createStep("step1_emergency_fund");
    const onClose = jest.fn();
    render(<StepDetailOverlay step={step} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

