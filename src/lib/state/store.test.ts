import { act } from "@testing-library/react";
import {
  INITIAL_PRIME_DIRECTIVE_STATE,
  selectRoadmapBuckets,
  usePrimeDirectiveStore,
} from "./store";
import type { Intake, StepCardModel } from "@/lib/decision";

const SAMPLE_INTAKE: Intake = {
  zip: "98101",
  householdSize: 2,
  takeHomeBand: "4to5k",
  highAprDebt: "yes",
  employerMatch: "yes",
  efMonths: 1,
};

function resetStore() {
  act(() => {
    usePrimeDirectiveStore.setState({
      ...INITIAL_PRIME_DIRECTIVE_STATE,
    });
  });
  usePrimeDirectiveStore.persist?.clearStorage?.();
}

describe("prime directive store", () => {
  beforeEach(() => {
    resetStore();
  });

  test("recomputePlan sets the first step active and others pending", () => {
    act(() => {
      usePrimeDirectiveStore.getState().recomputePlan(SAMPLE_INTAKE);
    });

    const steps = usePrimeDirectiveStore.getState().steps;
    expect(steps).toHaveLength(10);
    expect(steps[0].state).toBe("active");
    expect(steps.slice(1).every((step) => step.state === "pending")).toBe(
      true,
    );
  });

  test("completeActive promotes the next pending step", () => {
    act(() => {
      const store = usePrimeDirectiveStore.getState();
      store.recomputePlan(SAMPLE_INTAKE);
      store.completeActive();
    });

    const steps = usePrimeDirectiveStore.getState().steps;
    expect(steps[0].state).toBe("completed");
    expect(steps[1].state).toBe("active");
  });

  test("skipActive marks the step skipped and advances", () => {
    act(() => {
      const store = usePrimeDirectiveStore.getState();
      store.recomputePlan(SAMPLE_INTAKE);
      store.skipActive();
    });

    const steps = usePrimeDirectiveStore.getState().steps;
    expect(steps[0].state).toBe("skipped");
    expect(steps[1].state).toBe("active");
  });

  test("unskip brings a skipped step back to active", () => {
    act(() => {
      const store = usePrimeDirectiveStore.getState();
      store.recomputePlan(SAMPLE_INTAKE);
      store.skipActive();
    });

    const skippedStepId = usePrimeDirectiveStore.getState().steps[0].id;

    act(() => {
      usePrimeDirectiveStore.getState().unskip(skippedStepId);
    });

    const steps = usePrimeDirectiveStore.getState().steps;
    expect(steps[0].state).toBe("active");
    expect(steps[1].state).toBe("pending");
  });

  test("roadmap buckets maintain ordering", () => {
    act(() => {
      const store = usePrimeDirectiveStore.getState();
      store.recomputePlan(SAMPLE_INTAKE);
      store.completeActive();
      store.completeActive();
      store.skipActive();
    });

    const state = usePrimeDirectiveStore.getState();
    const buckets = selectRoadmapBuckets(state);

    expect(isOrdered(buckets.active)).toBe(true);
    expect(isOrdered(buckets.pending)).toBe(true);
    expect(isOrdered(buckets.completed)).toBe(true);
    expect(isOrdered(buckets.skipped)).toBe(true);
    expect(buckets.active[0]?.state).toBe("active");
    expect(buckets.completed.every((step) => step.state === "completed")).toBe(
      true,
    );
    expect(buckets.skipped.every((step) => step.state === "skipped")).toBe(
      true,
    );
  });
});

function isOrdered(steps: StepCardModel[]): boolean {
  return steps.every((step, index) => {
    const next = steps[index + 1];
    if (!next) return true;
    return step.order <= next.order;
  });
}

