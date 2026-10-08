# PROJECT STATUS

## Current Phase

Phase 1 — Complete UI Implementation

## Overall Progress

100% — Phase 1 complete. All 9 screens built, connected and verified against the
Definition of Done (see below).

## Completed

- [x] Project setup
- [x] App shell
- [x] Sidebar
- [x] Header
- [x] Dashboard
- [x] Basic Information
- [x] Job Responsibilities
- [x] Competencies
- [x] Technologies / Skills
- [x] Company & Candidate Level
- [x] Review & Generate
- [x] Project Generation Progress
- [x] Generated Project Details

All 9 routes are wired. The flow runs end-to-end: Dashboard → 6 wizard steps → Generate →
live progress → `/projects/:id` (success banner, tabs, real ZIP download). New projects also
appear in the Dashboard's Recent Assessments and on `/projects` (Generated Projects list).

## Phase 1 Definition of Done (project spec) — verified 2026-10-08

| Requirement | Status | Evidence |
|---|---|---|
| All 9 screens exist | ✅ | Routes in `src/app/router.tsx`; each screen has tests |
| Screens connected through navigation | ✅ | Link crawl from all screens: 16 internal URLs, 0 dead links |
| Assessment wizard works end-to-end | ✅ | Browser run Dashboard CTA → 6 steps → Generate |
| Data persists between wizard steps | ✅ | sessionStorage draft; tests for step changes, remount, reload |
| Buttons and interactions work | ✅ | 84 tests + browser checks (drag, keyboard, modals, menus) |
| Generation flow works with mock data | ✅ | 7 stages, logs, %, cancel/restart, resume after reload |
| Generated project screen works | ✅ | 5 tabs, real ZIP (passes `unzip -t`), preview actions |
| Responsive behavior works | ✅ | All 9 screens at 1440 / 1024 / 390px, no horizontal overflow |
| Shared components are reused | ✅ | One AppShell, stepper, Button/Input/Card/Badge/Table/etc.; CTA, StepError, SelectableCard extracted instead of duplicated |
| No major TypeScript errors | ✅ | `npm run typecheck` clean (strict) |
| No major console errors | ✅ | 0 console errors/warnings across all browser runs |
| Lint passes | ✅ | `npm run lint` clean |
| Production build passes | ✅ | `npm run build`, no chunk-size warnings |
| UI visually matches the reference | ✅ | 3×3 contact sheet compared with the reference grid; deviations listed under Known Issues |

## Visual Consistency Audit (measured in Chrome, all 9 screens)

Identical on every screen at 1440 / 1024 / 390px: sidebar width (256px), header height,
content x-position and width (1120px at 1440), page title (26px / 700, same y), description
style, font (Inter Variable), canvas color, card radius (14px) and border, primary button
color, stepper position and size on all 6 wizard steps. Button heights use the 32 / 40 / 44
scale only; every input and select is 40px.

Fixed during the audit:
- Basic Info selects were 44px while all other controls are 40px → unified to 40px.
- Scroll restoration bug: every freshly loaded document shares history key "default", so
  opening a URL in a new tab could restore another page's scroll offset (reproduced: project
  page opened 159px down). Fresh loads are now keyed by URL; in-app navigation still starts
  at the top and Back still restores.

## Shared Components

- [x] Button (+ ButtonLink) — variants: primary, secondary, dark, soft, ghost, danger; sizes sm/md/lg/icon
- [x] Input
- [x] Textarea
- [x] Select (native, optional leading icon)
- [x] Card (+ CardHeader, CardBody)
- [x] Badge
- [x] Tabs
- [x] Modal (native `<dialog>`)
- [x] Dropdown (+ DropdownItem, DropdownSeparator)
- [x] Progress
- [x] Assessment Stepper (6 steps; current / complete / upcoming; compact variant < md)
- [x] List Editor (`SectionedListEditor`: sections + counts, add (rapid entry), inline edit, delete with undo, drag/keyboard reorder, add/rename/delete section)
- [x] Extra: Table (THead/TBody/TR/TH/TD), FormField (label/required/error/counter), IconTile, Avatar, EmptyState,
  SelectableCard (native checkbox/radio card; shared selected state), Tag, TagInput,
  CtaPanel (peach CTA — shared by Dashboard and Review), Markdown (safe subset renderer)
- [x] Layout: AppShell, Sidebar, TopHeader, SearchBar, NotificationsMenu, ProfileMenu, DraftCard, PageHeader, Logo
- [x] Wizard: WizardLayout (route guard), StepCard, WizardFooter (Back/Next + validation hook), StepError,
  LevelCardGroup, ComplexityPreviewPanel, TechnologyTile, TechChip, ReviewPanel, SummaryTiles
- [x] Projects: StageList, TerminalLog, useGenerationProgress, ProjectOverview, RequirementsTab,
  TestCasesTab, ProjectStructure (file tree + preview), ReadmeTab, CopyButton
- [x] Lib: zip.ts (dependency-free ZIP writer), download.ts, sequentialId.ts, useCopyToClipboard

## Tech Stack

- Vite 8, React 19, TypeScript 6 (strict), React Router 8
- Tailwind CSS 4 — all design tokens in `src/styles/globals.css` (`@theme`)
- Zustand (wizard state), @dnd-kit (sortable lists), lucide-react icons, Inter Variable (self-hosted)
- ESLint 10 (flat config), Prettier (+ tailwind plugin), Vitest 5 + Testing Library

## Design Tokens (sampled from the reference image)

- Canvas `#f8f6f2`, sidebar `#f6f3ee`, cards white, lines `#ece9e4`
- Primary `#bf3d10` (primary-600), hover `#a3330d`; tint scale primary-50…800
- Active nav pill `#f0e4d7`; dark CTA `#23252b`
- Radius: control 10px, tile 12px, card 14px
- Control height 40px (sm 32, lg 44); header 68px; sidebar 256px; content max-width 1312px

## Wizard Architecture

- Draft store: `src/features/wizard/store.ts` (Zustand + `persist` → sessionStorage key
  `interview-assessment:draft`). Pages read/write the store directly; no per-page wizard state.
- Steps config: `src/features/wizard/steps.ts` (label, path, per-step page title/description).
- Completion rules: `stepComplete` in `src/features/wizard/validation.ts`.
- `useWizardProgress()` derives current / previous / next step, completion and reachability.
- Guard: a deep link to a step whose predecessors are incomplete redirects to the first
  incomplete step.
- Technology catalog: `src/services/mock/technologies.ts` (16 popular, in reference order, plus
  15 searchable). Icons are keys mapped in the UI layer (`techIcons.ts`).
- Project Complexity Preview: pure function `previewComplexity()` in
  `src/features/wizard/complexity.ts` (company + candidate level + selected technologies →
  tier, time estimate, feature list). Enterprise + Senior + Kafka reproduces the reference list.
- Generation job: `useGeneration` store (`src/features/projects/generationStore.ts`, sessionStorage
  key `interview-assessment:generation`) holds the current `GenerationJob` — id, pre-assigned
  `projectId` (PROJ-1003, 1004…), a deep-copied snapshot of the draft, status, startedAt.
  Created by `projectService.startGeneration()` (mock; Phase 2 → API).
- Generation simulation: `buildGenerationPlan()` (7 stages, assessment-aware log lines, ~13.4 s
  total) + pure `snapshotAt(plan, elapsedMs)` in `src/features/projects/generationPlan.ts`.
  Progress is derived from wall-clock time since `job.startedAt`, so a reload resumes.
- Generated projects: `useProjects` store (`src/features/projects/projectsStore.ts`, sessionStorage
  key `interview-assessment:projects`), seeded with PROJ-1001 (Spring Boot) and PROJ-1002
  (NestJS). `useGeneration.complete()` saves the project. Ids (PROJ-####, ASM-###) are derived
  from existing ids via `nextSequentialId()` — no in-memory counter.
- Project content: pure `buildProjectContent()` in `src/features/projects/content.ts` →
  requirements (from responsibilities), test cases (2 per competency + 4 E2E), file tree per
  boilerplate (Java / Node / Web / Python / Go), README, contents list. Counts match the
  generation log. The ZIP is built client-side (`createZip`) and verified with `unzip -t`.
- Project tabs live in the URL (`?tab=requirements`), so they are linkable and Back works.
- The draft starts from the reference example (`services/mock/draft.ts`) so every screen shows
  the reference data; Review → "Start over" (confirmed) calls `resetDraft('blank')`.

## Verification (last run: 2026-10-08)

- TypeScript: PASS (`npm run typecheck`)
- ESLint: PASS (`npm run lint`)
- Prettier: PASS (`npx prettier --check src`)
- Build: PASS (`npm run build`)
- Tests: PASS — 87/87 in 18 files (`npm test`): all previous suites + ZIP writer (CRC-32 check
  value, round-trip), Markdown renderer (incl. no HTML injection), project content builder,
  id allocation across "reloads", generation → saved project, Project Details (overview info,
  URL tabs, deep links, contents → file explorer, folder collapse, ZIP download, success
  banner, not-found), new projects on Dashboard + Generated Projects list
- Browser check (headless Chrome, production build): all 9 screens at 1440 / 1024 / 390px with
  no horizontal overflow; full flow Review → Generate → /projects/PROJ-1003 with success banner;
  tab Back navigation; real ZIP download passes `unzip -t` (14 files); link crawl (16 URLs,
  0 dead); consistency metrics audit; scroll restoration scenarios; no console errors.

## Known Issues / Notes

- All data is synchronous mock data behind `src/services/` (Phase 2 swaps in the API). Duplicate/Delete in the
  Recent Assessments table are in-memory and reset on reload.
- Sidebar items outside the 9 required screens (Assessments, Boilerplates, Candidates,
  Reports, Settings) intentionally show "coming soon". Generated Projects lists real projects.
- Reference image inconsistency: the Competencies mockup shows a 5-step stepper with wrong
  labels. Decision: use the same 6-step stepper on every wizard screen.
- Target Role and Project Type are marked required (asterisk) — the reference shows no
  asterisk, but both are needed to generate a project.
- The stepper shows checkmarks on steps already complete in the draft (with the sample draft,
  steps 2–5); the reference renders those as plain numbers.
- Section counts reflect real items (sample data has 2–6 per section), so they are smaller
  than the illustrative counts in the reference (25, 20, 100…).
- List editor layout: side-by-side at xl+ (≥1280px); below that the sections become a
  horizontal chip bar above a full-width list (the side-by-side layout truncated rows badly
  at 1024px).
- Drag-and-drop is only verified in a real browser; unit tests cover reordering via the store.
- Brand logos are not used (lucide has no brand icons); technology tiles use generic icons
  in brand-like colors.
- Typing a catalog technology into Custom Skills (e.g. "docker") selects that tile instead
  of creating a duplicate tag. Non-popular technologies picked via search stay visible in
  the default grid.
- Review step: the reference shows the Generate CTA as the only primary action, so the
  footer has Back + "Start over" and no Next/Generate duplicate.
- Generation takes ~13 s (demo pacing); the "may take a few minutes" note is the reference copy.
- FIXED: project ids used an in-memory counter that reset on reload (duplicate ids possible);
  ids are now derived from persisted projects. Covered by a regression test.
- "File Size" shows the real size of the downloadable ZIP (~11.5 KB), not the reference's
  illustrative 12.4 MB.
- Bundle: split into `react` (316 kB / 100 kB gzip), `vendor` (105 kB / 34 kB gzip) and app
  (124 kB / 36 kB gzip) chunks — no chunk-size warning, and framework/vendor code stays cached
  across deploys. Total download is unchanged; route-level lazy loading would reduce the first
  load further but makes every test's first render and navigation async — recommended for
  Phase 2 along with the real API.
- Tests that use fake timers click with `fireEvent` — `userEvent` stalls under fake timers.
- Git repository initialised; nothing committed yet.

## Change Log

- 2026-10-08 — Rebranded to **Ants Assessment** (sidebar logo, browser tab titles, `index.html`,
  package name). Internal sessionStorage keys keep the `interview-assessment:` prefix so existing
  sessions keep their data. The design file name is unchanged.
- 2026-10-08 — Sidebar "Upgrade to Pro" card (and its modal) replaced by `DraftCard`: shows the
  draft in progress, completed steps (n of 5) with a progress bar, and a Continue link to the
  next incomplete step (or "Review & generate" when ready); "Start assessment" when empty.
  Intentional deviation from the reference, which shows the upgrade card.

## Current Task

Phase 1 complete.

## Next Task

Awaiting direction for Phase 2. Suggested starting points:

1. Commit Phase 1 (nothing is committed yet).
2. Replace `src/services/*` mock implementations with real API calls (shapes are already
   typed in `src/types`), adding loading/error states.
3. Route-level lazy loading once data fetching makes routes async anyway.
4. Build the secondary areas currently marked "coming soon".
