// This store is client-only because it relies on sessionStorage.
"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type PersistStorage,
} from "zustand/middleware";
import {
  buildPlan,
  featureFlags,
  type Intake,
  type StepCardModel,
  type StepId,
  type StepState,
} from "@/lib/decision";

type PlanStep = StepCardModel;
type PersistedSubset = Pick<
  PrimeDirectiveState,
  "intakeDraft" | "intake" | "steps" | "activeStepId" | "monthlyIncomeEstimate"
>;

export interface PrimeDirectiveState {
  intakeDraft: Partial<Intake>;
  intake: Intake | null;
  steps: PlanStep[];
  activeStepId: StepId | null;
  featureFlags: typeof featureFlags;
  monthlyIncomeEstimate: number | null;
  updateIntakeDraft: (input: Partial<Intake>) => void;
  setMonthlyIncomeEstimate: (value: number) => void;
  resetIntake: () => void;
  recomputePlan: (input: Intake) => void;
  completeActive: () => void;
  skipActive: () => void;
  unskip: (id: StepId) => void;
}

type StepUpdater = (steps: PlanStep[]) => PlanStep[];

const defaultState = {
  intakeDraft: {} as Partial<Intake>,
  intake: null as Intake | null,
  steps: [] as PlanStep[],
  activeStepId: null as StepId | null,
  monthlyIncomeEstimate: null as number | null,
};

export const INITIAL_PRIME_DIRECTIVE_STATE = {
  ...defaultState,
  featureFlags,
} satisfies Pick<
  PrimeDirectiveState,
  | "intakeDraft"
  | "intake"
  | "steps"
  | "activeStepId"
  | "featureFlags"
  | "monthlyIncomeEstimate"
>;

function withNextActive(steps: PlanStep[]): {
  steps: PlanStep[];
  activeStepId: StepId | null;
} {
  const nextActiveIndex = steps.findIndex((step) => step.state === "pending");
  if (nextActiveIndex === -1) {
    return {
      steps,
      activeStepId: null,
    };
  }

  const updated = steps.map((step, idx) =>
    idx === nextActiveIndex
      ? { ...step, state: "active" as StepState }
      : step,
  );

  return {
    steps: updated,
    activeStepId: updated[nextActiveIndex].id,
  };
}

function updateSteps(steps: PlanStep[], updater: StepUpdater): {
  steps: PlanStep[];
  activeStepId: StepId | null;
} {
  const updatedSteps = updater(steps);
  const stillActive = updatedSteps.find((step) => step.state === "active");

  if (!stillActive) {
    return withNextActive(updatedSteps);
  }

  return {
    steps: updatedSteps,
    activeStepId: stillActive.id,
  };
}

const sessionStorageAvailable =
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const storage: PersistStorage<PersistedSubset> | undefined =
  sessionStorageAvailable
    ? (createJSONStorage(
        () => window.sessionStorage,
      ) as PersistStorage<PersistedSubset>)
    : undefined;

export const usePrimeDirectiveStore = create<PrimeDirectiveState>()(
  persist(
    (set) => ({
      ...INITIAL_PRIME_DIRECTIVE_STATE,
      updateIntakeDraft: (input) =>
        set((state) => ({
          intakeDraft: { ...state.intakeDraft, ...input },
        })),
      setMonthlyIncomeEstimate: (value) =>
        set({ monthlyIncomeEstimate: value }),
      resetIntake: () =>
        set({
          ...defaultState,
        }),
      recomputePlan: (input) =>
        set((state) => {
          const plan = buildPlan(input);
          return {
            intakeDraft: input,
            intake: input,
            steps: plan,
            activeStepId: plan[0]?.id ?? null,
            monthlyIncomeEstimate: state.monthlyIncomeEstimate,
          };
        }),
      completeActive: () =>
        set((state) => {
          if (!state.steps.length) return state;
          const { steps, activeStepId } = updateSteps(state.steps, (steps) =>
            steps.map((step) =>
              step.state === "active"
                ? { ...step, state: "completed" as StepState }
                : step,
            ),
          );
          return {
            ...state,
            steps,
            activeStepId,
          };
        }),
      skipActive: () =>
        set((state) => {
          if (!state.steps.length) return state;
          const { steps, activeStepId } = updateSteps(state.steps, (steps) =>
            steps.map((step) =>
              step.state === "active"
                ? { ...step, state: "skipped" as StepState }
                : step,
            ),
          );
          return {
            ...state,
            steps,
            activeStepId,
          };
        }),
      unskip: (id) =>
        set((state) => {
          if (!state.steps.length) return state;
          const currentActiveIndex = state.steps.findIndex(
            (step) => step.state === "active",
          );
          const targetIndex = state.steps.findIndex((step) => step.id === id);

          if (targetIndex === -1) {
            return state;
          }

          const steps = state.steps.map((step, idx) => {
            if (idx === targetIndex) {
              return { ...step, state: "active" as StepState };
            }
            if (idx === currentActiveIndex && step.state === "active") {
              return { ...step, state: "pending" as StepState };
            }
            return step;
          });

          return {
            ...state,
            steps,
            activeStepId: steps[targetIndex].id,
          };
        }),
    }),
    {
      name: "prime-directive-store",
      storage,
      partialize: (state) => ({
        intakeDraft: state.intakeDraft,
        intake: state.intake,
        steps: state.steps,
        activeStepId: state.activeStepId,
        monthlyIncomeEstimate: state.monthlyIncomeEstimate,
      } satisfies PersistedSubset),
      skipHydration: !sessionStorageAvailable,
    },
  ),
);

export const selectActiveStep = (state: PrimeDirectiveState) =>
  state.steps.find((step) => step.state === "active") ?? null;

export const selectRoadmapBuckets = (state: PrimeDirectiveState) => {
  const active: PlanStep[] = [];
  const pending: PlanStep[] = [];
  const completed: PlanStep[] = [];
  const skipped: PlanStep[] = [];

  state.steps.forEach((step) => {
    switch (step.state) {
      case "active":
        active.push(step);
        break;
      case "pending":
        pending.push(step);
        break;
      case "completed":
        completed.push(step);
        break;
      case "skipped":
        skipped.push(step);
        break;
    }
  });

  const byOrder = (a: PlanStep, b: PlanStep) => a.order - b.order;

  return {
    active: active.sort(byOrder),
    pending: pending.sort(byOrder),
    completed: completed.sort(byOrder),
    skipped: skipped.sort(byOrder),
  };
};
