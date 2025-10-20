import { applyDefinitionToModel, STEP_DEFINITIONS } from "./registry";
import type { Intake } from "./types";

/**
 * Deterministic builder for the initial plan.
 * Keeps the first step active and all remaining steps pending.
 */
export function buildPlan(intake: Intake) {
  void intake;
  const orderedDefinitions = [...STEP_DEFINITIONS].sort(
    (a, b) => a.order - b.order,
  );

  return orderedDefinitions.map((definition, index) =>
    applyDefinitionToModel(definition, index === 0 ? "active" : "pending"),
  );
}
