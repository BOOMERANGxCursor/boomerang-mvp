# BOOMERANG — Interface design

Version 1.2.0 · Implements [PRD/SPEC.md](PRD/SPEC.md), W1–W10.

## Layout

One application, three views: **Capture**, **Review**, **Practise**. View switching does not impersonate authenticated roles.

Persistent header: BOOMERANG, “Experience does not retire,” current published version or “Not published,” and **Live AI** / **Fixture replay**. Display “Fictional training example” beside the case title. Keep Reset demo available in a secondary menu.

Desktop: 960px content width, readable cards, 24px section gaps. Stack columns on narrow screens. Use system sans-serif, 16px body text and 1.5 line height. Palette: warm white `#FAFAF7`, ink `#1C2522`, muted text `#52605A`, green `#176145`, amber `#805600`, error red `#A82626`. Status always includes text, not color alone.

## Capture — W1, W2, W8

Top: expert name, content owner and incident title. Main area: the five incident prompts, editable text, **Use demo incident**, **Extract draft**. Source preview appears after submission; immutable saved text is separate from the editable field.

Below: **Expert questions**, showing open/resolved status, case, originating version and owner. Opening a gap displays its full facts/question above the reply field. After extraction, navigate to Review with the new cards highlighted. Replies never display “Resolved” before publication.

| State | Display/action |
| --- | --- |
| Empty | Explain the incident prompts; disable extraction for whitespace-only input |
| Ready | Show character count and enabled extraction |
| Extracting | Keep text visible; show progress label; disable duplicate extraction |
| No supported rule | Retain text and show the PRD's message; allow revision |
| Error | Inline error, retained text and one Retry; fixture mode is a separate action |
| Stale response | Explain that newer edits were kept; offer a fresh extraction |

## Review — W3–W5, W8

Each card shows situation, conditions, action, why, when to stop, source quote and **Draft / Approved**. Desktop: card content beside its evidence; mobile: evidence immediately below. Quote links expand the full source segment and author.

Actions: **Edit**, **Reject**, **Approve**. Editing shows Save/Cancel; Save clears approval and links. Empty rationale displays “Not provided.” Rejection returns the card count immediately.

Coverage section lists C1 and C2 with facts. A select control lists approved cards only; **Confirm link** records the reviewer's choice. An unlinked case reads **Not covered**. Replacing a link removes the old link first; a visible warning explains that applicability is reviewed manually.

Publication bar shows approved-card count, covered-case count, reviewer/owner fields and **Publish vN**. If blocked, display the reason beside the disabled action. Editing a published playbook starts an update draft; it never edits the published card in place.

After publication: show version, time and reviewer. For v2, show added/edited cards and case-link changes compared with v1. No modal celebration is needed.

## Practise — W6, W7, W9

First section: approved playbook cards using **Notice / Do / Why / Stop**. Each has an expandable source. Before publication show “Publish a reviewed playbook first.”

Case chooser: two cards with title and coverage status. Covered case: facts, three option buttons, **Check answer**. After submission show result, approved explanation/source, version and **Try again**. Selecting an option alone does not submit or show feedback.

Uncovered case: hide choices, show the exact PRD gap message and **View expert question**. The gap is created automatically; the button only navigates to it. Repeat visits reuse the same gap. Show no correct answer or unsupported action.

Below: attempt history with case, chosen option or “No guidance,” outcome and knowledge version. Publication of v2 must not recolor the old v1 gap as a successful attempt. Show a separate **Retry with v2** action.

## Session controls — W10

Reset confirmation: “Reset this demo? Saved guidance, attempts and questions will be removed.” Buttons: Cancel / Reset demo. After reset show Capture with the S1 example and no published version.

Storage failure: persistent temporary-session notice. Corrupt storage: recovery panel with Reset; never display partially trusted guidance. Restore state before enabling controls so a reload cannot flash or save a fresh session over existing data.

## Interaction checks

- Keyboard access, visible focus, associated field labels and error messages.
- Radio/option selection exposes selected state; statuses have readable text.
- Announce loading, extraction completion and errors through an appropriate live region.
- Long source text wraps inside cards; primary actions remain reachable without horizontal scrolling.
- Use plain labels and short feedback. Keep model names and implementation details out of the learner flow.
