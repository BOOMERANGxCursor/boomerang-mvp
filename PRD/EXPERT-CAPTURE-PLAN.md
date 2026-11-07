# Guided capture implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` task by task. The user approved the design by instructing “start building the new version.” No further design or execution-method approval is needed. Do not commit or push.

**Goal:** Deliver the approved profile → sources → review → corrections/comparison → questions → scenario test → publish workflow.

**Architecture:** Keep the frozen Bun stack. A version-2 Zod bundle stores captures and immutable published memories in localStorage. Pure domain functions and a reducer enforce explicit approval/revision boundaries. Next routes normalize files, extract rules and propose scenarios through the existing providers.

**Tech Stack:** Existing exact dependency pins; no added dependencies.

**Spec:** [EXPERT-CAPTURE-DESIGN.md](EXPERT-CAPTURE-DESIGN.md).

## Global constraints

- Work only in `/Users/star/Workspace/boomerang-mvp`.
- Preserve exact Bun/Node/dependency/model pins. No automatic provider fallback.
- Empty start; Keller Elektro and Nordform are opt-in labelled examples.
- Video is speech only. Binary uploads max 4 MB, audio/video max 60 seconds; six sources and 10,000 normalized characters per extraction.
- Credentials, File objects, pending promises and request tokens stay outside saved bundles.
- Human approvals bind exact revisions. Publication requires a current successful scenario test; history stays immutable.

## Review focus

1. Edited/late responses cannot reapprove or restore superseded content.
2. Example datasets must not contaminate custom work or each other.
3. Missing/invalid evidence and scenario selection cannot become a passing test or publication.
4. Storage corruption/hydration must not overwrite saved work.
5. Upload/provider failures must retain completed work and never fake file understanding.

## Task 1 — Contracts, examples, domain and persistence

Files: `src/lib/contracts.ts`, `demo.ts`, `memory.ts`, `session.ts`, `storage.ts`; replace obsolete shell-only tests with `tests/memory.test.ts` and `tests/storage.test.ts`.

Interfaces: `createSession(): SessionState`, `sessionReducer(state, event): SessionState`, `validateEvidence(rules, sources): void`, `approveSnippet`, `reviseSnippet`, `approveScenario`, `evaluateScenario`, `publishMemory`, `findPrevious`, `loadWorkspace`, `saveWorkspace`. Workspace schema v2 stores current capture and prior publications; UI state stays separate.

- [x] Write/run failing tests for empty start, source evidence, revision approval invalidation, scenario applicability/answers, publication snapshots, comparison scope, hydration/reset, storage corruption and stale results.
- [x] Implement schemas, exact business fixtures and pure transitions; run `bun run test` until all pass.

## Task 2 — Real file and model boundaries

Files: `src/lib/server.ts`, `src/lib/uploads.ts`, `src/app/api/read/route.ts`, `src/app/api/extract/route.ts`, `src/app/api/scenarios/route.ts`; `tests/server.test.ts`, `tests/uploads.test.ts`.

Interfaces: file kind/signature validation; bounded body readers; server access check; Responses structured proposals with app-generated IDs and validated quotes; ElevenLabs transcription. Inputs and output contracts use shared schemas. `read` returns normalized text/warnings, not approval.

- [x] Test unauthorized/missing config, byte/source limits, malformed/refused output, quote rejection, timeout and file-type detection before implementation.
- [x] Implement binary normalization, extraction and scenario proposal adapters without changing providers; run tests and typecheck.

## Task 3 — Guided expert interface

Files: `src/app/page.tsx`, `globals.css`, focused components under `src/components/`; remove unused old Capture/Review/Practise shell components.

- [x] Implement empty profile, confirmed example switch, readable step rail and progress, upload list/paste/source preview and honest processing states.
- [x] Implement check/cross/correction/reapproval/exclusion, manual addition, same-role comparison, Q&A revisions and final scenario editor/test/publication.
- [x] Wire hydration/recovery and temporary-storage notices. Use revision tokens for all server results. Run tests, typecheck and production build.

## Task 4 — Verification and handoff

- [x] Browser-test desktop and narrow layouts: empty validation, both examples, correction second pass, question acceptance, scenario answer choice, uncovered case, publish, reload and reset.
- [x] Obtain fresh independent code review; fix consequential findings and rerun affected/full checks.
- [x] Record actual checks and credential blockers in CONTEXT/README. Keep docs links valid. No live-processing claims without successful provider probes.

## Execution record

Implemented in the requested MVP checkout without changing dependencies. All 38 tests and typecheck pass; production build and frozen install pass. Desktop/mobile browser checks covered the labelled Keller loop, Nordform isolation, correction approval, expert answer acceptance, covered/uncovered scenarios, explicit publication, reload, real text upload, retained-source configuration errors and reset. Fresh review findings were fixed with regressions; provider/media smoke tests are explicitly blocked by missing server credentials. No commit, push or deployment was performed.
