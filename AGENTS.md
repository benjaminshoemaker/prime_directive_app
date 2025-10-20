# Repository Guidelines

## Project Structure & Module Organization
- `src/app/(public)/` — App Router entrypoints: landing, intake steps (`intake/[step]/`), loading, results, privacy.
- `src/components/` — Tailwind-based UI primitives (buttons, StepCard, RoadmapRow, Modal, etc.).
- `src/lib/decision/` — Plan catalog, types, feature flags, and `buildPlan` engine.
- `src/lib/state/` — Zustand store plus intake step metadata.
- `src/lib/utils/` — Shared helpers (`cn`, `sleep`).
- `assets/` & `src/figma/` — Original Figma export for reference; excluded from lint/typecheck.
- Tests live alongside sources (e.g., `src/lib/state/store.test.ts`; `src/components/StepCard.test.tsx`).

## Build, Test, and Development Commands
- `npm run dev` — Start Next.js dev server at `http://localhost:3000`.
- `npm run build` / `npm run start` — Production build and launch.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`); fails on warnings treated as errors.
- `npm run typecheck` — TypeScript `--noEmit` using `tsconfig.json`.
- `npm run test` — Jest + React Testing Library suite with `ts-jest`.

## Coding Style & Naming Conventions
- TypeScript + React with strict mode (`tsconfig.json`); prefer explicit types.
- TailwindCSS for styling; reuse classes/colors defined in `tailwind.config.ts`.
- Components and modules use PascalCase (e.g., `StepCard.tsx`); hooks/selectors camelCase.
- Run `npm run lint` before committing; it enforces Next.js best practices and ignores `src/figma/**`.
- Follow existing folder segmentation when adding screens/modules.

## Testing Guidelines
- Frameworks: Jest, React Testing Library, Zustand store tests.
- Add `.test.ts`/`.test.tsx` colocated with implementation.
- Ensure new store actions or UI flows have coverage mirroring existing tests (`store.test.ts`, `Roadmap.integration.test.tsx`).
- Tests should pass via `npm run test` before PR submission; no snapshot output committed.

## Commit & Pull Request Guidelines
- Commit messages: imperative summary (~50 chars) followed by optional body (e.g., `feat: add roadmap modal`).
- Keep commits scoped; avoid bundling unrelated refactors.
- Pull requests should include: summary of changes, testing notes (`npm run lint`, `npm run test`), relevant screenshots/GIFs for UI work, and linked issue IDs if applicable.
- Verify `npm run lint`, `npm run typecheck`, and `npm run test` locally before requesting review.

