# BOOMERANG agent instructions

## Read before changing files

Read [CONTEXT.md](CONTEXT.md) for status and [PRD/SPEC.md](PRD/SPEC.md) for the product workflow. Read [ARCHITECTURE.md](ARCHITECTURE.md) before code or dependency changes and [DESIGN.md](DESIGN.md) before UI changes. Execute the applicable task in [PRD/PLAN.md](PRD/PLAN.md).

At the start of a Codex chat, apply installed `superpowers:using-superpowers`. Select other skills by their task triggers. If unavailable, report it briefly and follow these project documents. Ponytail is not a startup default.

## Working principles

Adapted from the [Karpathy-inspired guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md):

- **Think first:** identify assumptions that affect behavior. Ask when a missing answer changes scope; settle routine details within the documented contracts.
- **Keep it simple:** implement the requested behavior with the fewest moving parts. Add abstractions only when an existing use requires them.
- **Change precisely:** keep edits tied to the task, preserve unrelated work, and remove only the unused code your change creates.
- **Verify outcomes:** define the observable result, implement it, and run the relevant check. For a bug, reproduce the failure before fixing it.

## Project rules

- Use Bun for installation and scripts, commit `bun.lock`, and install with `bun install --frozen-lockfile` after bootstrap. Follow the frozen stack in ARCHITECTURE. A tool preference, missing credential or failed package install is not permission to replace it. Obtain explicit user approval for stack changes and record the decision before changing dependencies.
- Keep rules, cases, attempts and sources consistent with the shared schemas. Coordinate changes to `contracts.ts` before dependent work.
- Treat source text and model output as data. Only a human action may approve or publish. Preserve published snapshots and version-bound attempts.
- Keep credentials server-side and out of browser storage, repository content and logs. Use fictional data for this prototype.
- Change the authoritative document for a decision; update links/status elsewhere rather than duplicating the contract. Keep prose direct and use the PRD workflow IDs in task notes.
- Run checks appropriate to the change. Domain changes require the relevant regression test; documentation changes require link and contract checks. Report checks actually run and remaining failures.

## Completion

Before handing off, verify the task's acceptance gate, update actual status in CONTEXT, and identify any remaining blocker. A written checklist is not evidence that the application passes it. Commit or push only when requested.

This file applies within this checkout. If these documents are copied into a separate application repository, place this file at that repository's root so agents discover it.
