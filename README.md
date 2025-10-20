## NextStep Money v0.1

NextStep Money guides a household to its next best financial action in under a minute. The v0.1 scope implements the MVP described in the PRD: landing, 6-step intake, loading experience, and an interactive “Your Next Best Step” plan driven by a deterministic decision engine. All state lives in `sessionStorage`; nothing is persisted server-side.

### Prerequisites

- Node.js 18.18+ (Next.js 14 requirement)
- npm (ships with Node)

### Install & Run

```bash
npm install
npm run dev      # start dev server on http://localhost:3000

npm run lint     # eslint using the flat config
npm run typecheck
npm run test     # jest + RTL test suite
npm run build    # production build
npm run start    # start production server
```

### Project map

```
src/
  app/(public)/
    page.tsx                Landing
    intake/[step]/page.tsx  Intake flow (steps 1-6)
    loading.tsx             2s plan-building spinner
    results/                Results experience
    privacy/page.tsx        Static privacy notice
  components/               UI kit from Figma pass + custom pieces
  lib/
    decision/               Step catalog, buildPlan, types, feature flags
    state/                  Zustand store + intake flow metadata
    utils/                  Shared helpers (class names, sleep, etc.)
assets/Design Mobile UX_UI Flow.zip  Original Figma export (reference only)
src/figma/                  Raw Figma code output (ignored by tooling)
```

### Architecture highlights

- **Decision engine** (`src/lib/decision`)
  - `types.ts` defines the canonical step IDs and intake contract.
  - `registry.ts` holds the v0.1 content catalog (why, how bullets, trusted links) plus `featureFlags` and a `ProgramRegistry` interface placeholder so locale packs or partner data can slot in for v1.0+.
  - `buildPlan(intake)` turns the registry into an ordered set of `StepCardModel`s; the first step is active, the rest pending.

- **State management** (`src/lib/state/store.ts`)
  - Zustand store with `persist` middleware targeting `sessionStorage` for reload tolerance.
  - Actions: `recomputePlan`, `completeActive`, `skipActive`, `unskip`, and `resetIntake` enforce the single-active-step invariant.
  - Selectors (`selectActiveStep`, `selectRoadmapBuckets`) keep the UI simple and guarantee the roadmap ordering (Active → Pending → Completed → Skipped).

- **Intake flow** (`src/lib/state/intake-flow.ts` + `intake/[step]/page.tsx`)
  - Declarative metadata drives the 6 screens (input type, copy, validation). Navigation relies on route params (`/intake/1` … `/intake/6`).
  - Each answer updates the persisted `intakeDraft`; on the final step the store recomputes the plan and the app transitions through the loading screen to results.

- **Results experience** (`results/page.tsx` + `ResultsClient.tsx`)
  - Server boundary delays rendering by 2 seconds, allowing `loading.tsx` to show “Building your plan…”.
  - Client component renders the active `StepCard`, progress snapshot, roadmap (with collapsed completed/skipped accordions), and a learn-more modal fed by the registry content.
  - Accessibility guard rails: `aria-live` announcements on active step changes, focus management, 44px targets, and semantic buttons/links.

- **UI kit** (`src/components`)
  - Tailwind-based components derived from the Figma handoff: buttons, inputs, slider, radio group, status pill, cards, roadmap rows, modal, accordion, progress bar, progress dots.
  - Components are mobile-first (~390px) with responsive behaviors up to desktop.

- **Testing** (`npm run test`)
  - Jest + React Testing Library cover the store reducer logic and the critical StepCard/Roadmap interactions.

### Evolving the plan (v1.0 and v2 hooks)

- **Adding new steps**: Extend `STEP_DEFINITIONS` in `src/lib/decision/registry.ts`. Each definition carries the order, copy bundle, and link set. `buildPlan` consumes the registry, so new entries appear without refactoring other code.
- **Locale-specific content / Seattle resources**: Implement a `ProgramRegistry` entry that overrides pieces of the base catalog, then swap `featureFlags.seattleResourcePack` (or a future locale flag) to inject the alternate copy/links.
- **Automation / Plaid (v2)**: The Zustand store keeps plan state isolated from presentation; new reminders, tasks, or account-linking features can subscribe to store selectors without rewriting the results UI. The `featureFlags.enableAutomationPreview` flag is reserved for gating that work.
- **Swapping link sets per locale**: Externalize a locale pack (JSON or TS module) that mirrors the step IDs and provides localized link arrays. Merge it in via `ProgramRegistry` before calling `buildPlan`.

### Privacy & data

- All intake answers and plan progress stay in `sessionStorage`. Clearing the tab or pressing “Start over” resets state immediately.
- No analytics, cookies, or network persistence are present in v0.1. Future features must revisit the privacy policy in `src/app/(public)/privacy/page.tsx` before shipping.

### Contributing & tooling notes

- Tailwind configuration lives in `tailwind.config.ts`; custom colors and fonts match the v0.1 palette.
- ESLint uses the Next.js flat config; `src/figma` is ignored so the raw export never blocks builds.
- Tests and lint both run in CI-friendly scripts (`npm run test`, `npm run lint`). Keep them green before committing changes.
