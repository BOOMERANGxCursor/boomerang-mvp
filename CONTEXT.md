# BOOMERANG — Project context

Baseline 1.2.0 · 7 November 2026 · Europe/Berlin

## Confirmed

- Team BOOMERANG; slogan: “Experience does not retire.”
- Three people: frontend, backend, product/pitch.
- Finish the product demonstration and pitch deliverables by 17:00 today.
- Use the approved guided expert workflow, opt-in business examples and speech-only video processing.
- This checkout is the actual MVP repository at `/Users/star/Workspace/boomerang-mvp`. Task 1 was initially built in the planning checkout by mistake, then copied here at the user’s request.

## Current decisions

- [PRD/SPEC.md](PRD/SPEC.md) owns the detailed product workflow W1–W10 and acceptance criteria AC1–AC9.
- [ARCHITECTURE.md](ARCHITECTURE.md) owns the frozen stack, contracts and system boundaries.
- [DESIGN.md](DESIGN.md) owns the screens and interaction states.
- [PRD/PLAN.md](PRD/PLAN.md) owns task order, roles and build gates.
- [AGENTS.md](AGENTS.md) governs agent work. This file records implementation status and validation.

## Status and next action

The user approved and requested implementation of [the guided design](PRD/EXPERT-CAPTURE-DESIGN.md). The implementation is in this MVP checkout, using the unchanged exact Bun stack. [PRD/EXPERT-CAPTURE-PLAN.md](PRD/EXPERT-CAPTURE-PLAN.md) records the build slices.

Implemented: empty expert profile; opt-in Keller Elektro/Nordform examples; six-step guided capture; source upload/paste/readable-text correction; snippet approval/correction/second review/exclusion/addition; same-role predecessor comparison; expert answer review/acceptance; scenario authoring/proposals and explicit applicability approval; separate final manual test; immutable publication; validated v2 localStorage restoration/recovery/reset. No top-level Practise tab or default roleplay remains.

Text uploads are read locally. Server read/extraction/scenario routes are implemented using the pinned OpenAI SDK/model and ElevenLabs HTTP Scribe v2. Video is spoken-content-only, as selected by the user. Files/requests/duration/evidence are validated. Live work cannot silently inherit example fixtures or labels.

Provider smoke tests remain blocked: `OPENAI_API_KEY`, `DEMO_ACCESS_CODE` and `ELEVENLABS_API_KEY` are not configured. A real local request returned sanitized 503 NOT_CONFIGURED with no provider call; a browser extraction attempt kept its uploaded source. No successful live-media or model call is claimed. Next operational step: configure these server variables, restart, enter the demo access code in Connection settings, and run the live model/media checks with fictional data.

All source changes remain uncommitted and unpushed. No deployment or submission is claimed. See the validation record below for actual checks; the old Task 1 record is historical.

## Guided version validation

- 38 domain/storage/provider/upload/media tests pass; new behavior tests were added before implementation, including regressions for review findings. Typecheck passes under Node 24.22.2 / Bun 1.4.3.
- Fresh independent review found example/live provenance, predecessor coverage invalidation, stale predecessor selections, server duration verification, question context and error-classification issues. These were corrected; affected/full tests passed. Historical attempts now snapshot their exact scenario and guidance; same-capture publication increments history correctly.
- Browser: empty required-field errors; Keller correction → second approval → prepared reply → answer review/approval → scenario approval → test selection validation → correct feedback → publish → reload. Uncovered C2 hid all choices and created an expert question. Nordform loaded its own profile/source/draft without Keller content.
- Mobile at 390×844: review controls, settings and source upload fit the viewport. A real UTF-8 text file was selected through Browse files and appeared as a readable source; live extraction displayed missing configuration and retained it.
- Final production preview is running from this MVP checkout at `http://localhost:3000`; desktop (1440×1000) and mobile (390×844) profiles were visually inspected. Screenshot artifacts: `/private/tmp/boomerang-new-desktop.png`, `/private/tmp/boomerang-new-mobile.png`.
- Mechanical design detector returned no findings. Production build passed with all three API routes; frozen install left the lockfile unchanged. Links and anchors across 15 documents and `git diff --check` passed. Reset returned the test workspace to an empty profile. The model smoke command exited 1 with an explicit missing-configuration blocker; no provider call was made.

## Product demo video

Created [the 83-second vertical MP4](output/boomerang-video/BOOMERANG_Product_Demo_90s.mp4) from actual browser captures of the fictional Keller Elektro dataset. It shows review, human approval, a manual test, an uncovered case, an expert answer and successful retesting. The team network is labelled Product vision. Export: 1080×1920, H.264, 30 fps, AAC original synthesized audio; full FFmpeg decode passed. Editable renderer, timing, captures and thumbnail are in the same output directory. No upload or submission is claimed. Application code was preserved; live provider configuration remains the next development blocker described above.

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
