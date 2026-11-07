# BOOMERANG

**Experience does not retire.** Baseline 1.2.0 · 7 November 2026.

## Read in order

1. [PRD/SPEC.md](PRD/SPEC.md) — product requirements, detailed workflow and acceptance criteria.
2. [DESIGN.md](DESIGN.md) — screens and interaction states.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — fixed stack, shared contracts and API boundaries.
4. [PRD/PLAN.md](PRD/PLAN.md) — implementation tasks, ownership and verification.

[AGENTS.md](AGENTS.md) governs agent work. [CONTEXT.md](CONTEXT.md) records decisions and actual status.

## Run the guided MVP

Work in `/Users/star/Workspace/boomerang-mvp`. Use Node **24.22.2** (`.nvmrc`) and Bun **1.4.3** (`packageManager`). Next.js runs on Node; Bun installs dependencies and invokes scripts.

```sh
bun install --frozen-lockfile
bun run dev
bun run test
bun run typecheck
bun run build
bun run start
```

Open [the local app](http://localhost:3000). Start with an empty profile or choose Keller Elektro / Nordform GmbH from **Try an example**. No roleplay identity or Practise tab is imposed on the expert.

The flow is Profile → Add knowledge → Review snippets → Confirm corrections / previous memory → Expert questions → Ready to share. Green check approves the exact snippet revision; red cross opens correction. Saved corrections receive a second review. Expert answers are saved for review, then explicitly approved as memory. Unanswered questions remain owned and visible.

The final step reviews scenario facts, choices, correct answers and source links. **Run a manual test** opens the separate answer-choice test; uncovered cases never show a guessed answer. Publish requires a current correct test and approved content. Published memories and old test snapshots remain unchanged when the draft changes.

The workspace is validated and saved in localStorage (`boomerang.workspace.v2`) after hydration. Prior captures match organization, position and example/live context on this device. Start a new memory preserves published history; Reset workspace removes this local workspace after confirmation. Invalid storage opens recovery without overwriting saved content. Raw files, access codes and provider credentials are never saved in the bundle.

### Sources and live processing

Text files (TXT/MD/CSV/SRT/VTT) are read locally. PDF/DOCX and JPEG/PNG/WebP files use the pinned OpenAI model to obtain readable text; MP3/WAV/M4A/OGG/WebM audio and MP4/WebM video use ElevenLabs `scribe_v2` for speech only. Inspect/correct readable text before extracting skills. Sources are immutable; a correction creates a new source. Unsupported, unreadable or unconfigured processing produces a visible error and retains completed work.

Limits: six active sources, 10,000 source characters per extraction, 4 MB per file and recordings up to 60 seconds. Recording duration must be readable from container metadata on the server; streaming files with unverifiable duration need exporting or a pasted transcript. Large/long files are rejected rather than silently truncated.

The two examples use explicitly labelled, human-authored prepared drafts. Adding personal files/notes or editing example text requires replacing the prepared example context; live extraction never inherits example scenarios or an example label. Human approval remains required in both paths.

Set `OPENAI_API_KEY`, `DEMO_ACCESS_CODE`, and `ELEVENLABS_API_KEY` in `.env.local` using `.env.example`, then restart the server. Enter only the demo access code in **Connection settings**; it stays in memory. Keys stay server-side. Live endpoints are `/api/read`, `/api/extract`, `/api/scenarios`, with access checks, bounded input, sanitized errors and explicit retries.

Current limitation: real provider/media smoke tests remain **blocked by missing credentials**. Domain/adapter tests and the labelled example loop are verified; live AI accuracy, handwriting recognition and provider access are not claimed. No deployment, shared accounts or cross-device storage is claimed.

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

This standalone script uses only the fixed `gpt-5.4-mini-2026-03-17` snapshot, Responses structured output, `store: false`, reasoning effort `none`, zero retries and a 20-second timeout. It validates exact source quotes from fictional text without printing provider responses or credentials. It does not publish anything or substitute a model. The current run is **blocked: the required server variables are not configured**. Provider access is not proven.

Working notes: [customer evidence](docs/customer-evidence.md), [pitch](docs/pitch.md), [submission](docs/submission.md). These contain no claimed conversations or completed submission artifacts.

Targets, Europe/Berlin: complete loop 14:45; hosted text 15:15; feature freeze 16:00; recording 16:25; artifacts 16:45; submit by 17:00. Cut audio and decoration first if late.

Superpowers normally separates specifications and execution plans under `docs/superpowers/`. This project uses the team's requested `PRD/` container for those two artifacts. Older baselines remain in Git history.
