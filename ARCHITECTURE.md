# BOOMERANG — Architecture and frozen stack

Version 1.2.0 · Decision A002 · 7 November 2026

## 1. Stack freeze

This is the single source of truth for technology choices. Implement this stack. Changing a component, major version, model, persistence strategy or hosting platform requires explicit user approval, a recorded reason/impact and an updated baseline before implementation. Missing credentials or setup errors are blockers to resolve, not permission to switch providers.

| Area | Fixed choice | Purpose |
| --- | --- | --- |
| Runtime | Node.js 24 LTS | Stable Next.js runtime for local tools and deployed Vercel functions |
| Package manager | Bun 1.4 | Dependency installation, committed bun.lock and script commands |
| Application | Next.js 16 App Router; React 19.2; TypeScript 5 strict | UI and server routes in one application |
| Styling | Tailwind CSS 4; native semantic controls | Shared visual tokens without a component-library dependency |
| Client state | React `useReducer` with pure domain functions | Explicit, testable transitions |
| Validation | Zod 4 | Shared runtime schemas and inferred types |
| Model integration | Official OpenAI TypeScript SDK; Responses API; structured JSON output | One server-side extraction path |
| Model | `gpt-5.4-mini-2026-03-17` | Pinned snapshot; no moving alias or automatic fallback |
| Storage | Browser localStorage, one versioned JSON bundle | Fictional, single-browser demonstration |
| Tests | Vitest 4 for domain/API adapter tests; manual browser acceptance run | Validate behavior without an extra browser-test framework |
| Hosting | One Vercel project; Node.js server runtime | Deploy the app and extraction route together |
| Optional audio | ElevenLabs HTTP speech-to-text API, `scribe_v2` | Transcribe a short recording into the existing text path |

Task 1 resolved exact compatible versions within these lines. [README.md](README.md#exact-bootstrap-versions) records the runtime, Bun and SDK versions; `package.json` pins direct dependencies and `bun.lock` records resolution. Commit the lockfile with the application when commits are requested. Use `bun install --frozen-lockfile` on every teammate machine and deployment. Commit only `bun.lock` as the dependency lockfile. No `latest` ranges or unreviewed lockfile regeneration after this initial resolution. Audio model access is verified only if its optional gate is reached.

We chose one app over Next.js + separate API/database because all demo state fits in one browser and only extraction requires a server. There is no requirement for shared accounts or server-authoritative publication today. A production data model would be a separate approved change.

### Why this stack fits

Next.js keeps the three screens and extraction endpoint in one deployable app. TypeScript and Zod keep frontend/backend contracts aligned. React state and localStorage cover this small fictional demo without another service. A single server-side provider handles extraction; practice and publication remain deterministic. Vitest runs through `bun run test`; no second test runner is introduced. Tailwind supplies shared design tokens without a component framework.

Bun replaces npm for package management and script invocation. Running `bun run dev` does not itself switch Next.js to Bun's runtime: the CLI and deployed functions retain Node.js 24. This avoids an extra runtime migration while honoring the requested package-manager change. Pin Bun during bootstrap and verify the deployed build.

This is a demo architecture, not a production knowledge platform. A production pilot needs authenticated roles, shared durable storage and server-enforced publication. Those requirements would justify a separate architecture decision after the hackathon.

**Decision A002:** user requested Bun instead of npm. All other fixed choices remain unchanged. Exact dependency pins are established once in Task 1; architecture changes still require explicit approval.

## 2. Guided capture baseline — A003

The user approved the guided-capture redesign in [PRD/EXPERT-CAPTURE-DESIGN.md](PRD/EXPERT-CAPTURE-DESIGN.md). This supersedes the v1 Demo Hall workflow and bundle contracts below the stack freeze. Media input is required, video means spoken content only, and tests use short scenarios with answer choices. No new dependencies or provider substitutions are authorized or needed.

## 3. Version-2 contracts

`src/lib/contracts.ts` owns runtime schemas and inferred types. The version-2 workspace contains one editable capture and immutable published memories. Captures contain a profile, opt-in dataset ID, source segments, revision-bound snippets, expert questions, scenarios, attempts and previous-memory comparison decisions. Sources are append-only; corrections/additions create new expert-authored sources. Snippet approval binds its exact revision. Edited questions/scenarios clear their acceptance and invalidate test readiness. Persist no credentials, raw files, promises or pending tokens.

`memory.ts` owns evidence checks, approvals, revisions, scenario validation/evaluation, prior-memory matching and publication. `session.ts` owns pure UI transitions and request context. `storage.ts` validates complete JSON and cross-references before restoration; corrupt/old data goes to recovery rather than being overwritten. The localStorage key is `boomerang.workspace.v2`; the old `boomerang.demo.v1` key is never silently overwritten.

Only same-organization, same-position memories in the same dataset/live context are predecessor candidates. A human confirms use-case applicability and resolves differences. Prior snapshots remain unchanged. A successful manual scenario attempt must match the current capture revision before publication. Open questions/uncovered use cases stay visibly open and never gain guessed answers.

## 4. Server boundaries

Next Node routes `/api/read`, `/api/extract` and `/api/scenarios` use the same server-only `DEMO_ACCESS_CODE` check (`x-demo-access`) before paid provider work. Missing configuration: 503; unauthorized: 401; invalid input: 400; oversized: 413; provider/refusal/malformed evidence: 502; timeout: 504. Errors are sanitized `{code,message}`. Use a 20-second timeout, no automatic retries and explicit UI retry.

Read one binary/multipart file per request, max 4 MB plus bounded multipart overhead. Validate supported extensions/content type and binary signatures, not filename alone. Browser text reading supports TXT/MD/CSV/SRT/VTT. OpenAI reads PDF/DOCX and JPEG/PNG/WebP using the pinned snapshot; ElevenLabs HTTP `scribe_v2` transcribes audio/video speech. Clips are limited to 60 seconds. Normalized text is inspectable/editable before extraction. No arbitrary URL fetching and no raw media persistence.

Extraction accepts 1–6 immutable sources, max 10,000 total characters and 64 KiB JSON. Return at most six proposed rules and three questions. App-generate IDs, enforce exact nonempty quotes and known source IDs. Scenario proposals (max three, three choices each) need human approval of the answer key and rule applicability before testing. Model text and uploads cannot approve/publish. OpenAI uses Responses strict structured output, `store:false`, reasoning `none` and the fixed model.

## 5. Runtime and validation

Continue using the exact Node/Bun/dependency versions in [README.md](README.md), only `bun.lock`, and `bun install --frozen-lockfile`. Scripts remain dev/build/start/typecheck/test plus the server model smoke probe. Domain and adapter changes require regression tests; release verification requires all tests, typecheck, production build and a desktop/mobile operator run. Provider access is only proven by real credential-backed smoke tests.
