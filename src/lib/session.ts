import { ExtractionResultSchema, type ExtractionResult, type SessionBundle, type SourceSegment } from "./contracts";
import { createInitialBundle, sourceS1 } from "./demo";

export type View = "capture" | "review" | "practise";
export type PendingExtraction = { token: string; draftId: string | null; revision: number | null };
export type SessionState = {
  bundle: SessionBundle; view: View; hydration: "loading" | "ready";
  pending: PendingExtraction | null; expert: string; contentOwner: string;
  incident: string; questions: string[]; notice: string | null;
};
export type SessionEvent =
  | { type: "hydrated" }
  | { type: "view"; view: View }
  | { type: "field"; field: "expert" | "contentOwner" | "incident"; value: string }
  | { type: "mode"; mode: SessionBundle["mode"] }
  | { type: "reset" }
  | { type: "extractionStarted"; token: string; sources: readonly SourceSegment[] }
  | { type: "extractionSucceeded"; token: string; draftId: string; result: ExtractionResult }
  | { type: "extractionFailed"; token: string; message: string };

export function createSession(mode: SessionBundle["mode"] = "fixture"): SessionState {
  return {
    bundle: createInitialBundle(mode), view: "capture", hydration: "loading", pending: null,
    expert: "Alex", contentOwner: "Duty technician", incident: sourceS1.text, questions: [], notice: null,
  };
}

export function sessionReducer(state: SessionState, event: SessionEvent): SessionState {
  if (event.type === "hydrated") return { ...state, hydration: "ready" };
  if (state.hydration !== "ready") return state;
  switch (event.type) {
    case "view": return { ...state, view: event.view };
    case "field": return { ...state, [event.field]: event.value };
    case "mode": return { ...createSession(event.mode), hydration: "ready" };
    case "reset": return { ...createSession(state.bundle.mode), hydration: "ready" };
    case "extractionStarted": {
      if (state.pending) return state;
      const sources = [...state.bundle.sources];
      for (const source of event.sources) {
        const existing = sources.find(s => s.id === source.id);
        if (existing && (existing.text !== source.text || existing.author !== source.author)) {
          return { ...state, notice: "Submitted sources cannot be changed. Use a new source ID." };
        }
        if (!existing) sources.push({ ...source });
      }
      return {
        ...state, notice: null, bundle: { ...state.bundle, sources },
        pending: { token: event.token, draftId: state.bundle.draft?.id ?? null, revision: state.bundle.draft?.revision ?? null },
      };
    }
    case "extractionSucceeded": {
      if (!state.pending || state.pending.token !== event.token) return state;
      if (state.pending.draftId !== (state.bundle.draft?.id ?? null) || state.pending.revision !== (state.bundle.draft?.revision ?? null)) {
        return { ...state, pending: null, notice: "Newer edits were kept. Extract a fresh draft." };
      }
      const result = ExtractionResultSchema.parse(event.result);
      return {
        ...state, pending: null, view: "review", questions: result.questions,
        bundle: { ...state.bundle, draft: {
          id: event.draftId, revision: 0, baseVersion: state.bundle.versions.at(-1)?.version ?? 0,
          rules: result.rules, approvedRuleIds: [], caseLinks: [],
        } },
      };
    }
    case "extractionFailed": return state.pending?.token === event.token
      ? { ...state, pending: null, notice: event.message } : state;
  }
}
