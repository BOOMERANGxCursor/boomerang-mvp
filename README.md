# BOOMERANG

**Experience does not retire.** Baseline 1.2.0 · 7 November 2026.

## Read in order

1. [PRD/SPEC.md](PRD/SPEC.md) — product requirements, detailed workflow and acceptance criteria.
2. [DESIGN.md](DESIGN.md) — screens and interaction states.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — fixed stack, shared contracts and API boundaries.
4. [PRD/PLAN.md](PRD/PLAN.md) — implementation tasks, ownership and verification.

[AGENTS.md](AGENTS.md) governs agent work. [CONTEXT.md](CONTEXT.md) records decisions and actual status.

```text
AGENTS.md
ARCHITECTURE.md
CONTEXT.md
DESIGN.md
README.md
PRD/
  SPEC.md
  PLAN.md
```

## Start

Assign frontend/backend/product-pitch owners. Backend establishes contracts and verifies the model; frontend builds against labelled fixtures; product/pitch collects actual customer evidence and prepares submission. Start Task 1.

Use Bun for dependencies and scripts. After initial setup, install with `bun install --frozen-lockfile` and use `bun run dev`, `bun run test`, `bun run typecheck`, `bun run build`. The stack and runtime distinction are defined in ARCHITECTURE.

Targets, Europe/Berlin: complete loop 14:45; hosted text 15:15; feature freeze 16:00; recording 16:25; artifacts 16:45; submit by 17:00. Cut audio and decoration first if late.

Superpowers normally separates specifications and execution plans under `docs/superpowers/`. This project uses the team's requested `PRD/` container for those two artifacts. Older baselines remain in Git history.
