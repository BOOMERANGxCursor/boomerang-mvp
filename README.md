# BOOMERANG

**Experience does not retire.** Baseline 1.2.0 · 7 November 2026.

## Read in order

1. [PRD/SPEC.md](PRD/SPEC.md) — product requirements, detailed workflow and acceptance criteria.
2. [DESIGN.md](DESIGN.md) — screens and interaction states.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — fixed stack, shared contracts and API boundaries.
4. [PRD/PLAN.md](PRD/PLAN.md) — implementation tasks, ownership and verification.

[AGENTS.md](AGENTS.md) governs agent work. [CONTEXT.md](CONTEXT.md) records decisions and actual status.

## Run the Task 1 shell

Use Node **24.22.2** (`.nvmrc`) and Bun **1.4.3** (`packageManager`). Next.js runs on Node; Bun installs dependencies and invokes scripts. The default system Node may need switching before running these commands.

```sh
bun install --frozen-lockfile
bun run dev
bun run test
bun run typecheck
bun run build
bun run start
```

Open [the local demo](http://localhost:3000). Capture, Review and Practise are available from the header. The initial bundle has only S1, with no draft, publication, attempt or gap. **Fixture replay** is the default; **Extract fixture draft** shows an unapproved S1 preview. Editing the fixture text produces an explicit error; it does not run AI on new text.

Review approval/publication, practice evaluation, gap handling and browser persistence belong to subsequent tasks. Practice is disabled. This build uses memory only and says so visibly; reload clears it. Session settings offers Reset demo (with confirmation) and mode selection; mode changes start a clean session so fixture history cannot enter Live AI mode. Live extraction is unavailable in this build. No deployment is claimed.

### Exact bootstrap versions

| Dependency | Version |
| --- | --- |
| Next.js | 16.4.5 |
| React / React DOM | 19.2.9 |
| TypeScript | 5.9.3 |
| Tailwind CSS / PostCSS plugin | 4.3.5 |
| Zod | 4.6.7 |
| Official OpenAI SDK | 7.53.0 |
| Vitest | 4.1.12 |
| Node types | 24.19.2 |
| React / React DOM types | 19.2.18 / 19.2.7 |

Direct dependencies use exact pins; `bun.lock` records resolution. No other dependency lockfile is used. Version selection follows the frozen lines in [ARCHITECTURE.md](ARCHITECTURE.md#1-stack-freeze), with [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Tailwind setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs) and the [official SDK](https://github.com/openai/openai-node) as implementation references.

### Model access probe

Copy `.env.example` to `.env.local` and configure `OPENAI_API_KEY` and `DEMO_ACCESS_CODE` server-side. Never use `NEXT_PUBLIC_` prefixes. No credentials are shipped or stored in the browser.

```sh
bun run smoke:model
```

This standalone script uses only the fixed `gpt-5.4-mini-2026-03-17` snapshot, Responses structured output, `store: false`, reasoning effort `none`, zero retries and a 20-second timeout. It validates exact source quotes from fictional text without printing provider responses or credentials. It does not publish anything or substitute a model. The initial run is **blocked: neither required server variable is configured**. Provider access is not proven.

Working notes: [customer evidence](docs/customer-evidence.md), [pitch](docs/pitch.md), [submission](docs/submission.md). These contain no claimed conversations or completed submission artifacts.

Targets, Europe/Berlin: complete loop 14:45; hosted text 15:15; feature freeze 16:00; recording 16:25; artifacts 16:45; submit by 17:00. Cut audio and decoration first if late.

Superpowers normally separates specifications and execution plans under `docs/superpowers/`. This project uses the team's requested `PRD/` container for those two artifacts. Older baselines remain in Git history.
