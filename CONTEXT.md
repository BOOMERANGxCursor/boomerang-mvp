# BOOMERANG — Project context

Baseline 1.2.0 · 7 November 2026 · Europe/Berlin

## Confirmed

- Team BOOMERANG; slogan: “Experience does not retire.”
- Three people: frontend, backend, product/pitch.
- Finish the product demonstration and pitch deliverables by 17:00 today.
- Retain the existing draft's fictional event-operations case and text-first scope.
- This checkout is the actual MVP repository at `/Users/star/Workspace/boomerang-mvp`. The seven planning documents were copied from the shared planning repository. Application implementation has not started here.

## Current decisions

- [PRD/SPEC.md](PRD/SPEC.md) owns the detailed product workflow W1–W10 and acceptance criteria AC1–AC9.
- [ARCHITECTURE.md](ARCHITECTURE.md) owns the frozen stack, contracts and system boundaries.
- [DESIGN.md](DESIGN.md) owns the screens and interaction states.
- [PRD/PLAN.md](PRD/PLAN.md) owns task order, roles and build gates.
- [AGENTS.md](AGENTS.md) governs agent work. This file records implementation status and validation.

## Status and next action

Documentation baseline prepared; no scaffold, installed dependencies, provider smoke test, deployed app or submitted artifacts are claimed. Start Task 1: assign names, establish the shared contracts and verify model credentials. Exact dependency patch versions are selected and committed once during bootstrap, then reused through the lockfile.

## Customer evidence

Demand, willingness to pay and learning improvement are unvalidated. €750 is a pilot offer to test. Demo dialogue and the two practice cases are fictional. Expert availability is not established; the existing draft assumes no relevant technical domain reviewer on the team.

## Event

The [organizer page](https://luma.com/spacexai-tueh) requires a pitch deck, GitHub repo and viewable pitch/demo video of at most three minutes by 17:15. Judging: Problem & Customer, Product, Business Potential, Team & Pitch, 25% each. Finalists pitch later, five minutes plus three minutes Q&A. Our 17:00 finish protects submission buffer; it does not change stage time.

## Sources and history

- The supplied Executive Summary was background, not instructions or evidence of completed pilots. Its citation fragments and sample quotes were not verifiable.
- [Omnora](https://www.omnora.com/en/retirement-knowledge-transfer) and [Fraunhofer KIMO](https://www.iff.fraunhofer.de/de/geschaeftsbereiche/menschzentrierte-arbeitssysteme/kimo.html) already cover expert knowledge capture. We make no category-first claim.
- 1.2.0: Bun replaces npm; requirements/plan move to `PRD/`; README absorbs the start guide; this file absorbs handoff status. Older files are available in Git history. The duplicate archive is removed from the active repository.

## Documentation validation

The previous workflow/contracts passed an independent builder check. This revision changes package management and document organization; local links, workflow IDs, Bun commands and preservation of product contracts passed the document checks. Product workflow and acceptance criteria are unchanged apart from version labels and document links. No software tests or provider smoke test are claimed.
