# BOOMERANG — Build plan

Version 1.2.0 · Three people · Finish including pitch by 17:00, 7 November 2026, Europe/Berlin.

**Goal:** demonstrate capture → review → publish → practise → gap → expert reply → publish update → retry.

**Spec:** [PRD/SPEC.md](SPEC.md). **System contracts and fixed stack:** [ARCHITECTURE.md](../ARCHITECTURE.md). **Screens:** [DESIGN.md](../DESIGN.md).

Agentic execution uses installed `superpowers:executing-plans` task by task. Checkboxes below represent future work. These documents do not scaffold the app.

## Ownership and constraints

| Owner | Files/work |
| --- | --- |
| F — frontend | Components, page shell, session reducer, storage |
| B — backend | Scaffold/lockfile, shared contracts, extraction, knowledge/practice functions and tests |
| P — product/pitch | Demo copy, customer evidence, deck, recording, submission |

B owns contract changes and shares them before integration. F/B agree reducer events at Task 1. Use fictional data, keep provider keys server-side, require explicit approval before publication, preserve version history and follow the architecture freeze. P protects the clock. Each task ends at an observable gate; commit a verified slice when the team requests commits.

## Review focus

1. Input or model output attempting to approve content → remains untrusted draft data.
2. Edits or late responses after approval/reset → approvals clear; stale responses never restore old content.
3. Missing/conflicting coverage or invalid selection → no guessed action or passing result.
4. Refusal, malformed evidence, timeout or missing credentials → retained state and explicit error.
5. Hydration/corrupt storage → no overwrite of saved data; visible recovery or temporary mode.

## Task 1 — Shared contract and shell (F+B; P supplies incident)

**Files:** package/config/lock files, `contracts.ts`, `demo.ts`, `session.ts`, app layout/page, components.
**Consumes:** PRD demo fixtures and architecture sections 1–4. **Produces:** shared types, initial bundle, three views and fixed dependency resolution.

- [ ] B resolves compatible exact dependency versions within the frozen stack, records Node/Bun/SDK versions, sets the exact Bun packageManager version, creates the planned scripts and commits `bun.lock` when commits are requested. Teammates and deployment use `bun install --frozen-lockfile`.
- [ ] B defines schemas/types and fixtures C1/C2/options exactly as specified. Initial bundle has S1 only and no draft/version/attempt/gap. Keep S2 and replay output out of active sources.
- [ ] F implements the three-view shell, persistent mode/version/demo labels, reducer events and fixture adapter. Define pending-extraction tokens and hydration state outside the persisted bundle.
- [ ] B smoke-tests the fixed model once with fictional text; validate a source quote. If credentials fail, record the blocker; F continues with labelled fixtures, without replacing the provider.
- [ ] P opens `docs/customer-evidence.md`, `docs/pitch.md` and `docs/submission.md`; assigns names to F/B/P and begins actual conversations.
- [ ] Verify `bun run typecheck` and `bun run build`; switch views with the initial fixture.

**Gate:** shared contracts compile; shell works; provider access is proven or explicitly blocked. Maps to W1.

## Task 2 — Live extraction (B; F integrates Capture)

**Files:** API route, `extract.ts`, Capture, `tests/extract.test.ts`.
**Consumes:** immutable source segments. **Produces:** validated unapproved cards/questions.

- [ ] Write failing tests for valid S1 evidence; missing/empty/invented quote; duplicate source IDs; blank input; >6 segments; >10,000 characters; >64 KiB body; unauthorized/missing configuration; malformed/refused/incomplete response; provider timeout. Expected API statuses come from ARCHITECTURE section 6.
- [ ] Run `bun run test tests/extract.test.ts` and confirm the missing behavior fails. Implement the route/adapter with the fixed model and no hidden retries; rerun until green.
- [ ] F implements loading/errors, retained text, explicit retry and no-supported-guidance state. Save source IDs immutably; reject stale extraction results using the request token and captured draft context.
- [ ] Add an adversarial extraction fixture quoting S1 but reversing its meaning: evidence syntax may pass, but the card remains unapproved and cannot publish. This checks the review boundary, not automatic semantic truth.
- [ ] Manually submit a novel fictional paraphrase in Live AI mode; inspect the real response and exact source.

**Gate:** AC1 and AC8; live output is a draft. Maps to W2.

## Task 3 — Review and publication (B+F)

**Files:** `knowledge.ts`, Review, `tests/knowledge.test.ts`.
**Consumes:** draft rules/sources. **Produces:** approved case links and immutable snapshots.

- [ ] Write failing tests for empty/unapproved publish, invalid evidence, stale draft ID/revision/base version, edited approval/link invalidation, rejection cleanup, duplicate case link, unknown case/rule and missing reviewer/owner.
- [ ] Run `bun run test tests/knowledge.test.ts`; implement the architecture's exact domain signatures and rerun.
- [ ] F renders card/evidence review, edit/reject/approve, explicit case-link confirmation and publication blockers. Publish v1 with C1 only; show the playbook and version badge.
- [ ] Create the update-draft path and change summary. Test that publishing v2 leaves serialized v1 byte-identical and unchanged approved R1 retains its link.

**Gate:** AC2/AC3; an edit blocks publication until re-approved. Maps to W3–W5.

## Task 4 — Practice and gap return (B+F)

**Files:** `practice.ts`, `session.ts`, Practise, Capture inbox, `tests/practice.test.ts`.
**Consumes:** scenarios and a published snapshot. **Produces:** version-bound attempts, gaps and reviewed closure.

- [ ] Write failing tests: C1-A/v1 correct; another valid choice incorrect; null/unknown choice cannot pass; no C2 link → gap even if a caller supplies its answer; unknown case rejected; conflicting links → gap; repeated C2/v1 deduplicates.
- [ ] Add tests: reply without publication stays open; same-version resolution stays open; v2 with approved C2 link closes G1; original v1 attempt stays unchanged; a fresh C2-B/v2 attempt succeeds.
- [ ] Run `bun run test tests/practice.test.ts`; implement pure functions and reducer transitions, then rerun.
- [ ] F adds playbook, case choice, feedback/history and pre-publication empty state. For uncovered C2 hide answers and create the gap automatically; the question button only opens the inbox.
- [ ] Run S2 through the existing extraction/review path, approve C2 link, publish v2, then retry. Verify no fixture/source-code edits are needed during the demonstration.
- [ ] Test delayed extraction after Reset and after a newer draft edit: neither may overwrite the current session.

**Gate:** AC4–AC6; complete loop works by 14:45. Maps to W6–W9.

## Task 5 — Persistence and deployment (F+B)

**Files:** `storage.ts`, `tests/storage.test.ts`, shell restoration, README, environment example.
**Consumes:** complete bundle. **Produces:** repeatable deployed demo.

- [ ] Test valid round-trip, malformed JSON/schema, dangling source/rule/version references, blocked storage and reset. Test that hydration cannot write a default bundle over saved state.
- [ ] Run `bun run test tests/storage.test.ts`; implement validation/recovery and the architecture's reset contract; rerun.
- [ ] Run `bun run test`, `bun run typecheck`, `bun run build`. Deploy the verified build and configure server secrets without committing them.
- [ ] On deployment check unauthorized/configuration errors, a real extraction, full loop, refresh/reset, and separately labelled fixture mode in a private window. Inspect client responses for credential leakage.
- [ ] README records exact setup/runtime/SDK versions, commands, model snapshot, actual working features and demo reset instructions.
- [ ] Run the full operator acceptance checklist twice from reset.

**Gate:** AC7/AC8; hosted text path works by 15:15. Maps to W10.

## Task 6 — Optional audio (F+B; at most 20 minutes)

- [ ] Begin only after Task 5 passes and before 15:15; otherwise skip. Smoke-test the fixed ElevenLabs model/format first.
- [ ] Add one upload/record control and protected transcription route under the architecture's limits. Returned text remains editable before extraction.
- [ ] Verify denied microphone permission, oversized/invalid recording, transcription failure and working text fallback. Persist no raw audio.
- [ ] Stop by 15:35. Disable unreliable audio and preserve the tested text flow.

**Gate:** optional entry path works without changing W2–W10; no effect on core acceptance if omitted.

## Task 7 — Evidence, pitch and submission (P throughout; all finish)

- [ ] Attempt three relevant external conversations. Log actual roles, incidents, workaround, objections and next commitment; obtain permission before quoting.
- [ ] Build the six-slide narrative and 180-second script from PRD section 7. Use only actual product/customer evidence; label the pilot price as a hypothesis.
- [ ] At 16:00 freeze features. Record the working flow and pitch by 16:25, keeping the complete video at or below 3:00.
- [ ] By 16:45 export deck, verify repository/README and video permissions, and open exact artifact links signed out. Keep a local video backup.
- [ ] Submit by 17:00 and save the confirmation and exact URLs in `docs/submission.md`.

**Gate:** AC9. The 17:15 organizer deadline is contingency buffer.

## Operator acceptance run

- [ ] Reset: S1 only, no publication; practice disabled.
- [ ] Extract S1 live; inspect source; approve R1 and C1 link; publish v1.
- [ ] Read playbook; C1-A succeeds with source-backed feedback.
- [ ] Open C2: no answer shown; one gap/question appears.
- [ ] Add S2; extract/review R2; approve C2 link; publish v2.
- [ ] G1 closes to v2; C2-B succeeds in a new attempt; old C2/v1 is unchanged.
- [ ] Reload preserves the bundle; Reset clears it; late requests cannot restore it.
- [ ] Failure retains state; live/fixture labels remain accurate.

## Time and cut rules

Start Task 1 now; the previous 12:15 start is obsolete. F builds against fixtures while B integrates; P handles evidence and submission throughout. Keep gates at 14:45 complete loop, 15:15 deployed text, 16:00 freeze, 16:25 recording, 16:45 artifacts and 17:00 finish.

Cut optional audio, decoration and export first. If no complete loop exists at 14:45, pair F/B on it. With 90 minutes left, preserve what works and prepare an honest recording/submission. Never describe fixture playback as live AI.

## Version history

1.2.0 — Bun replaces npm; moved specification/plan into PRD; removed duplicate guides and archive from the active tree. Product workflow and contracts are retained. Earlier baselines remain in Git history.
