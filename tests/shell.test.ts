import { describe, expect, it } from "vitest";
import { RuleSchema, SessionBundleSchema } from "../src/lib/contracts";
import { createInitialBundle, scenarios, sourceS1, fixtureExtraction } from "../src/lib/demo";
import { createSession, sessionReducer } from "../src/lib/session";

describe("W1 contract and fixture boundary", () => {
  it("starts without publishable or learner history and without S2", () => {
    const bundle = SessionBundleSchema.parse(createInitialBundle());
    expect(bundle.sources.map(source => source.id)).toEqual(["S1"]);
    expect(bundle.draft).toBeNull();
    expect(bundle.versions).toEqual([]);
    expect(bundle.attempts).toEqual([]);
    expect(bundle.gaps).toEqual([]);
  });

  it("returns independent initial state on reset", () => {
    const first = createInitialBundle();
    first.sources[0].text = "changed";
    expect(createInitialBundle().sources[0].text).toBe(sourceS1.text);
  });

  it("rejects empty actions and evidence", () => {
    const rule = fixtureExtraction([sourceS1]).rules[0];
    expect(RuleSchema.safeParse({ ...rule, action: " " }).success).toBe(false);
    expect(RuleSchema.safeParse({ ...rule, evidence: [] }).success).toBe(false);
    expect(RuleSchema.safeParse({ ...rule, evidence: [{ sourceId: "S1", quote: "" }] }).success).toBe(false);
  });

  it("keeps the fixed choices aligned with their supported answers", () => {
    expect(scenarios.map(s => [s.id, s.options.map(o => o.id), s.correctOptionId])).toEqual([
      ["C1", ["C1-A", "C1-B", "C1-C"], "C1-A"],
      ["C2", ["C2-A", "C2-B", "C2-C"], "C2-B"],
    ]);
  });

  it("only adapts the known source, never claims to extract novel text", () => {
    const result = fixtureExtraction([sourceS1]);
    expect(result.rules[0].evidence.every(e => e.sourceId === "S1" && sourceS1.text.includes(e.quote))).toBe(true);
    expect(() => fixtureExtraction([{ ...sourceS1, text: "novel notes" }])).toThrow();
  });
});

describe("shell transitions", () => {
  it("keeps navigation and hydration outside the persisted bundle", () => {
    const state = sessionReducer(createSession(), { type: "hydrated" });
    const next = sessionReducer(state, { type: "view", view: "review" });
    expect(next.view).toBe("review");
    expect(next.hydration).toBe("ready");
    expect(SessionBundleSchema.parse(next.bundle)).toEqual(state.bundle);
    expect("pending" in next.bundle).toBe(false);
  });

  it("blocks extraction until hydration, and never adds approvals from a result", () => {
    const request = { type: "extractionStarted", token: "first", sources: [sourceS1] } as const;
    expect(sessionReducer(createSession(), request).pending).toBeNull();
    let state = sessionReducer(createSession(), { type: "hydrated" });
    state = sessionReducer(state, request);
    state = sessionReducer(state, { type: "extractionSucceeded", token: "first", draftId: "draft-1", result: fixtureExtraction([sourceS1]) });
    expect(state.bundle.draft?.approvedRuleIds).toEqual([]);
    expect(state.bundle.draft?.caseLinks).toEqual([]);
    expect(state.bundle.versions).toEqual([]);
    expect(state.view).toBe("review");
  });

  it("invalidates a pending response on reset", () => {
    let state = sessionReducer(createSession(), { type: "hydrated" });
    state = sessionReducer(state, { type: "extractionStarted", token: "old", sources: [sourceS1] });
    state = sessionReducer(state, { type: "reset" });
    state = sessionReducer(state, { type: "extractionSucceeded", token: "old", draftId: "late", result: fixtureExtraction([sourceS1]) });
    expect(state.bundle.draft).toBeNull();
    expect(state.pending).toBeNull();
    expect(state.view).toBe("capture");
  });

  it("switches modes with a fresh bundle instead of mixing fixture history", () => {
    let state = sessionReducer(createSession(), { type: "hydrated" });
    state = sessionReducer(state, { type: "extractionStarted", token: "fixture", sources: [sourceS1] });
    state = sessionReducer(state, { type: "mode", mode: "live" });
    expect(state.bundle.mode).toBe("live");
    expect(state.bundle.draft).toBeNull();
    expect(state.pending).toBeNull();
    expect(state.bundle.sources.map(s => s.id)).toEqual(["S1"]);
  });
});
