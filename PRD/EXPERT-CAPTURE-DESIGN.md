# Guided expert capture — approved design

7 November 2026 · Proposal for the MVP in `/Users/star/Workspace/boomerang-mvp`.

Status: approved by the user’s instruction to start building the new version. This design replaces the old demo-first capture/review navigation. The fixed Bun/Next/React/Tailwind/Zod/OpenAI stack stays in place.

## Outcome

An experienced employee can turn their own material into a reviewed memory without understanding the system's internal contracts. They move through short forms, confirm or correct individual snippets, answer follow-up questions, then test the resulting memory manually. Publication remains an explicit human action.

No roleplay, learner identity switch or always-visible Practise tab appears in this expert flow. Real-person demo content will be supplied later. The two existing fictional cases remain opt-in example datasets, clearly identified as examples rather than live AI output.

## Approaches considered

1. **Guided form with a review queue — recommended.** Profile and upload are short steps; review shows a few understandable snippets with visible decisions. This directly supports the requested workflow while keeping sources and corrections accessible.
2. **Chat interview.** Friendly for capture but makes it harder to track which snippets were approved, revisit a source or compare predecessors. Do not use as the primary flow.
3. **Workspace dashboard.** Useful later for administrators managing many people, but exposes too much before the first handover is complete. Do not build it into this capture flow.

The user delegated reference selection. The recommended direction uses the focused, spacious interaction seen in [Frontify's Brand Libs on Awwwards](https://www.awwwards.com/sites/brand-libs), adapted into conventional accessible forms. [Level2's workspace](https://www.awwwards.com/sites/redesigning-trust-level2) was also inspected; its dense dark trading interface is a poor fit for this audience. These are inspiration, not copied layouts or a claim of proven usability for BOOMERANG.

## Visual direction

Use a light, editorial workspace with charcoal type, warm neutral surfaces, deep forest-green primary actions and restrained lime accents for progress. A narrow desktop rail explains the steps and current position; the active form sits on the main page surface, rather than inside layers of bordered cards. The rail becomes a compact progress header on mobile.

Keep BOOMERANG and the slogan. Use system sans-serif with a clear size hierarchy, generous spacing and a comfortable reading width. Inputs have persistent labels, short helper text and inline validation. Buttons have descriptive text; check/cross icon actions also have accessible names and visible tooltips. No decorative photography or distracting animations are necessary for this operating task.

A segmented progress bar shows real completed steps with a short transition and a textual count. Processing shows honest phases such as “Reading your files” and “Finding skills”; do not fabricate time estimates or percentages. Respect reduced motion. Place Back and Continue consistently, keeping the primary action reachable on mobile.

## Flow

### 1. About you — W1 revised

Ask for full name, position, years of experience, organization/team and continuing content owner. Require name, position, organization and owner; years of experience can be left blank. Never invent experience values for the supplied examples. Explain why the owner is needed.

Start empty. A secondary “Try an example” dropdown offers Keller Elektro and Nordform GmbH. Selecting one fills the known fields and makes its material available for the upload step; the expert can replace it. Switching examples with existing work requires a clear discard/cancel choice. Example data and live uploads never mix silently.

Continue validates only this step. Back preserves inputs.

### 2. Add your knowledge — W2 revised

Offer one obvious file drop area with a normal Browse files button, plus a secondary Paste text option. Users should not have to select a processing technology. List files with name, detected type, reading status, remove/retry actions and any actionable error.

Initial supported formats: TXT, Markdown, CSV, SRT/VTT transcripts; PDF and DOCX documents; JPEG/PNG/WebP images of typed or handwritten notes; common MP3/WAV/M4A/WebM audio and MP4/WebM video. Video understanding is **spoken content only**, explicitly selected by the user. Unsupported, encrypted, corrupt, silent or illegible inputs produce a specific error instead of invented text. Do not claim every conceivable format or perfect handwriting recognition.

Use the existing pinned OpenAI model for image/PDF reading and structured skill extraction. Use the existing ElevenLabs `scribe_v2` HTTP API for audio/video transcription; no additional SDK or transcoder is proposed. Both provider keys stay server-side.

Before deriving skills, let the expert inspect and correct the readable text generated from each file. Mark unreadable portions instead of guessing. Preserve file/page or timestamp context where available. These reviewed text segments become immutable sources; later corrections create new sources.

First-release bounds: at most six sources per extraction and 10,000 normalized text characters, preserving the current extraction bound. Each server upload stays below 4 MB, with audio/video clips up to 60 seconds. Send one binary/multipart file per request so base64 expansion cannot exceed the hosting request limit. Show the bounds before selection. Longer interviews or larger uploads require a separate storage/upload design; they are not silently accepted and truncated.

If a provider is not configured, retain the selected files and text in memory and explain what is unavailable. The UI must not pretend an unread file was processed. Example playback remains labelled and separately chosen.

### 3. Review your memory — W3 revised

Lead with: “Did I understand you correctly? Please review, adjust, and add anything that is missing.”

Each snippet contains a plain-language skill/decision title, when it applies, what to do, why, when to stop and an expandable source citation. Keep the source near the claim without making it dominate every card.

The top-right **green check** approves that snippet for the private reviewed draft. The adjacent **red cross** means “Needs correction”; it clears approval and opens an editable text area. It does not silently delete the snippet. Provide a separate explicit Exclude action with Undo for genuinely unwanted content.

Saving a correction creates a new revision in “Review again” state. A newly added snippet behaves the same way and requires evidence or an expert-authored source. The AI may help rewrite the correction, but never approves it. Other already-approved snippets stay approved unless their own content changes.

Show counts for To review / Needs correction / Approved. Continue requires every retained snippet to have either an approval or a saved correction, and at least one retained snippet. Unsaved correction fields block Continue. Saved corrections advance unapproved to Step 4; the user does not need to approve them once in each step. A green check saves approval to the draft, not publication.

### 4. Confirm corrections and previous knowledge — W3/W4 revised

Present changed/new snippets for explicit approval of the corrected revision. This is the second review pass, with one approval of each changed revision. Do not require users to reapprove unchanged snippets. Any further edit clears that snippet's approval again. If no corrections or additions exist, this section is already complete; the progress display does not create a needless empty page.

Look for previously published memory in the same local organization/team and position. A matching position only suggests candidates; the expert must confirm that the use case is the same. Show Previous / New side by side with citations and dates. Treat contradictions as unresolved decisions. Offer Keep previous, Use new, or Combine and review. A combined or edited result is unapproved until explicitly accepted.

Never overwrite an older published version. Keep its original expert/source attribution and save the new memory as a successor version. Do not compare across organizations or treat a similar job title as proof of equivalent procedures. If no previous capture exists, say so without inventing one.

This MVP uses prior captures saved in the same browser. Organization-wide retrieval across devices/accounts is outside the existing localStorage architecture and is not claimed.

### 5. Expert questions — W8 revised

After the guided review, land in Expert questions. The workspace navigation exposes Memory and Expert questions; practice is not a top-level destination.

Questions identify the uncertain or missing point and its source. An expert can type an answer, inspect the proposed resulting answer/snippet, accept it, or request/edit a correction. Every revision goes back to review until the expert explicitly accepts the final result. Unanswered questions can be kept open with an owner; unsupported content cannot become accepted guidance by default.

The initial queue contains questions returned by extraction about missing or uncertain information. The expert can also add a question explicitly. Repeated questions with the same normalized text and capture are reused. Later manual-test gaps enter the same queue with their tested revision. If no questions exist, show a positive empty state and a Continue action. Accepting a reply accepts that answer revision for the private memory; it does not close a published coverage gap until a successor snapshot includes the approved guidance.

For the two examples, G1 may be offered as a labelled prepared follow-up question. S2 remains separate from the initial source: the reply is introduced only when the expert explicitly uses it. Human-authored expected cards are reference fixtures, never represented as real extraction results.

### 6. Finish and test — W5/W6/W9 revised

Summarize reviewed snippets, accepted answers, unresolved questions and prior-version changes. Offer **Run a manual test** here. It opens a separate test view using this exact reviewed memory revision. For supplied examples, use their corresponding C1/C2 cases, never Demo Hall content.

The user selected short practice scenarios with answer choices. Each scenario shows concrete facts, three choices and an explicit Check answer action. Selecting a choice does not submit or reveal feedback. Validate a missing/unknown selection; only a submitted valid choice creates an attempt. Show the approved explanation and source after submission.

For ordinary uploads, propose up to three short scenarios from the reviewed memory. Before a scenario enters the test, the expert reviews its facts, choices, correct option and applicability link to an approved snippet. These are editable, unapproved model proposals; the expert can also write a scenario manually. Editing a scenario clears its approval and invalidates prior test readiness. If the memory cannot support a source-backed scenario, ask for missing knowledge instead of inventing a correct answer. Scenario-authoring preview may show the answer key; the subsequent test screen does not reveal it before submission.

For either example or custom scenarios, applicability needs explicit expert confirmation linking each test case to an approved snippet before it can be evaluated; no automatic link implies approval. Fixed example cases retain their human-authored answer keys and do not acquire coverage merely because their correct answers exist in fixture data.

An uncovered case returns “No approved guidance” and an expert question; it must not reveal a fixture answer. A test result records the memory revision it tested. Editing memory invalidates its ready/tested state and requires the changed content to be reviewed and tested again.

After the manual run, the expert can explicitly Publish the ready memory. The future employee experience consumes published versions and is outside this redesign's expert UI. No automatic publication occurs on upload, green-check approval, question acceptance or test completion.

Publication requires at least one successfully reviewed manual test tied to the current revision, all retained snippets/answers approved and no unresolved content-comparison conflicts. Unanswered questions or uncovered unrelated use cases may remain open with an owner: partial coverage must be named rather than blocking useful approved memory or claiming completeness. A failed or uncovered test cannot be counted as the required successful test. Test feedback remains bound to the old revision when memory changes.

## State and implementation boundaries

Extend the schemas deliberately to include an expert profile, dataset selection, uploaded-source metadata, review decisions/revisions, accepted question answers and memory ancestry. Keep raw File objects, access code, pending requests and reading progress outside the persisted JSON. Save reviewed text and drafts in localStorage only after successful hydration and validation. Preserve existing published snapshots when creating a successor.

Use pure reducer transitions with revision/request tokens. A late upload/extraction/rewrite response cannot overwrite newer edits, a dataset switch or Reset. Provider failures preserve prior completed work. Source text and uploaded instructions are data, never approval commands.

Before changing contracts, update the authoritative workflow, architecture and design documents to this approved baseline, then replace the Task 1-only shell in coherent tested slices. No component, provider or dependency change is currently proposed. Expanding media from optional to required and revising the workflow are explicit changes to the earlier product scope.

## Acceptance gates

- Start empty with no Alex/Demo Hall roleplay; example dropdown has exactly the two supplied businesses.
- Keyboard-accessible Back/Continue, validation, progress announcements and mobile layout work throughout.
- Every listed input category has either a real validated processing path or a clear unavailable/error state; no filename-only or fake AI classification.
- A source can be inspected before skill extraction; quotations point to immutable reviewed source text.
- Check approves; cross opens correction; edited/new snippets require explicit second approval; excluded content can be restored.
- Same-role comparison needs matching organization and human confirmation of applicability; older snapshots remain unchanged.
- Question revisions stay unapproved until accepted; unresolved questions cannot fabricate coverage.
- No Practise tab in the expert shell; final-step test uses the current memory and selected dataset, with no answer leakage for uncovered cases.
- Hydration, reset, mode/dataset changes, storage errors and stale asynchronous responses preserve the documented boundaries.
- Run domain/API regression tests, typecheck and production build. Verify the complete path on desktop and mobile. Real provider/media access is only claimed after successful smoke tests with fictional files.

## Known implementation blockers

No `OPENAI_API_KEY`, `DEMO_ACCESS_CODE` or `ELEVENLABS_API_KEY` is configured in the current process. Provider integrations can be implemented and tested with controlled responses, but live-media correctness cannot be certified until real smoke tests pass. Handwritten notes and speech need expert review; the product must not promise error-free classification.

## Design review

A fresh builder check identified the correction-step transition, ordinary-upload test interaction, coverage/publication readiness and question origin as gaps. The correction sequence, question origins, binary-upload bounds and publication requirements are now defined above. The user selected scenario tests with answer choices; custom scenario proposals require expert approval of both the answer key and source applicability. No dependency or provider substitution is needed for spoken-only video. The user subsequently approved this design by instructing “start building the new version.”
