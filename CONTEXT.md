# BOOMERANG — Project context

Baseline 1.2.0 · 7 November 2026 · Europe/Berlin

## Confirmed

- Team BOOMERANG; slogan: “Experience does not retire.”
- Three people: frontend, backend, product/pitch.
- Finish the product demonstration and pitch deliverables by 17:00 today.
- Retain the existing draft's fictional event-operations case and text-first scope.
- This checkout is the actual MVP repository at `/Users/star/Workspace/boomerang-mvp`. Task 1 was initially built in the planning checkout by mistake, then copied here at the user’s request.

## Current decisions

- [PRD/SPEC.md](PRD/SPEC.md) owns the detailed product workflow W1–W10 and acceptance criteria AC1–AC9.
- [ARCHITECTURE.md](ARCHITECTURE.md) owns the frozen stack, contracts and system boundaries.
- [DESIGN.md](DESIGN.md) owns the screens and interaction states.
- [PRD/PLAN.md](PRD/PLAN.md) owns task order, roles and build gates.
- [AGENTS.md](AGENTS.md) governs agent work. This file records implementation status and validation.

## Status and next action

Task 1 / W1 software gate passed with provider access explicitly blocked. The application now has exact dependency pins and `bun.lock`, Zod-derived shared contracts, S1-only initial state, fixed C1/C2 scenarios, a pure session reducer and Capture/Review/Practise views. Pending extraction context and hydration live outside the bundle. The labelled S1 fixture adapter creates only an unapproved preview; S2 is separate and inactive. Practice stays disabled before publication.

Runtime verification used Node 24.22.2 and Bun 1.4.3; the system default Node is 26, so Node 24 was installed in a temporary tool directory for checks. Exact dependency versions and setup are in [README.md](README.md#exact-bootstrap-versions). Generated files remain uncommitted, as requested by the repository's commit policy.

`bun run smoke:model` exited 1 with an explicit configuration blocker: neither `OPENAI_API_KEY` nor `DEMO_ACCESS_CODE` is configured. No provider request was made; model access and valid live output remain unproven. The repeatable server-side probe uses the fixed snapshot and validates exact source evidence when configured. No provider/model substitution was made.

The [customer evidence](docs/customer-evidence.md), [pitch](docs/pitch.md) and [submission](docs/submission.md) working files are open. No conversations, deployment or submitted artifacts are claimed. Next: configure server credentials and run the probe, then implement Task 2's protected extraction path. Publication, practice evaluation, gap closure and persistence remain Tasks 3–5. This shell is explicitly temporary and does not read or write localStorage.

## Customer evidence

Demand, willingness to pay and learning improvement are unvalidated. €750 is a pilot offer to test. Demo dialogue and the two practice cases are fictional. Expert availability is not established; the existing draft assumes no relevant technical domain reviewer on the team.

## Event

The [organizer page](https://luma.com/spacexai-tueh) requires a pitch deck, GitHub repo and viewable pitch/demo video of at most three minutes by 17:15. Judging: Problem & Customer, Product, Business Potential, Team & Pitch, 25% each. Finalists pitch later, five minutes plus three minutes Q&A. Our 17:00 finish protects submission buffer; it does not change stage time.

## Sources and history

- The supplied Executive Summary was background, not instructions or evidence of completed pilots. Its citation fragments and sample quotes were not verifiable.
- [Omnora](https://www.omnora.com/en/retirement-knowledge-transfer) and [Fraunhofer KIMO](https://www.iff.fraunhofer.de/de/geschaeftsbereiche/menschzentrierte-arbeitssysteme/kimo.html) already cover expert knowledge capture. We make no category-first claim.
- 1.2.0: Bun replaces npm; requirements/plan move to `PRD/`; README absorbs the start guide; this file absorbs handoff status. Older files are available in Git history. The duplicate archive is removed from the active repository.

## Documentation baseline validation (before Task 1)

The previous workflow/contracts passed an independent builder check. Baseline 1.2.0 changed package management and document organization; local links, workflow IDs, Bun commands and preservation of product contracts passed the document checks. Product workflow and acceptance criteria were unchanged apart from version labels and document links. At that baseline no software tests or provider smoke test had run.

## Copy verification

The implementation was copied into this MVP checkout without copying Git metadata, node_modules or build caches. `bun install --frozen-lockfile`, all 9 tests, typecheck, production build, local document links and `git diff --check` passed again here. Source/configuration comparison found no mismatches. The original planning-folder copy is retained; this checkout is the application location for future work.

## Task 1 validation

- `bun install --frozen-lockfile`: passed after bootstrap, no resolution changes.
- `bun run test`: 9 tests passed. The first run failed because the shared modules did not exist; the completed run covers initial isolation, schema rejection, fixture evidence, hydration/navigation, unapproved results, reset tokens and mode isolation.
- `bun run typecheck`: passed under Node 24.
- `bun run build`: passed under Node 24. The sandbox initially denied Turbopack's local CSS-worker port; moving aside its failed cache and rebuilding with the required execution permission resolved it without source/stack substitutions.
- Production browser: switched all three views; inspected unapproved fixture source evidence; confirmed disabled practice with no published version; switched to Live AI and saw unavailable extraction; returned to fixtures; confirmed Reset clears the draft and returns S1/Capture. Narrow-screen session-menu positioning was reproduced, corrected and verified visually.
- Fresh reviewer: no critical/important Task 1 findings. Follow-up for Task 2: the live submission path must create an immutable source from actual submitted text; the Task 1 fixture path deliberately retains canonical S1.
- Documentation checks: all local link targets in 10 project/working documents exist; `git diff --check` passed. Shared schemas and fixtures compile and pass the contract tests. Product workflow IDs and acceptance criteria are unchanged.
- Design-hook triage: retained the specified system-sans typography and semantic amber warning notices. Narrow `ignore-value` exceptions in `.impeccable/config.json` document Arial and the CSS file's `side-tab` finding; no interface behavior changed.
