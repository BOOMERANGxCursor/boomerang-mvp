import { describe, expect, it } from "vitest";
import { createCapture, installDraft, approveSnippet, reviseSnippet, approveScenario, evaluateScenario, publishMemory, findPrevious, acceptAnswer, reviseAnswer,resolvePrevious } from "../src/lib/memory";
import { parseWorkspace } from "../src/lib/storage";
import { exampleDraft, datasets } from "../src/lib/demo";
import { createSession, sessionReducer } from "../src/lib/session";

function ready() {
  let c = createCapture("keller-elektro");
  c = installDraft(c, exampleDraft(c));
  c = approveSnippet(c, c.snippets[0].id);
  c.comparisonComplete = true;
  c.scenarios = structuredClone(datasets["keller-elektro"].scenarios);
  c = approveScenario(c, "C1", c.snippets[0].id);
  return c;
}

describe("guided memory approval boundaries", () => {
  it("starts without a fictional person, sources or memory", () => {
    const c = createCapture();
    expect(c.profile.name).toBe(""); expect(c.datasetId).toBeNull();
    expect(c.sources).toEqual([]); expect(c.snippets).toEqual([]);
  });
  it("keeps both example sources and scenarios separate", () => {
    const a = createCapture("keller-elektro"), b = createCapture("nordform");
    expect(a.profile.name).toBe("Marta Keller"); expect(b.profile.name).toBe("Helmut Kruse");
    expect(a.sources).toHaveLength(1); expect(a.sources[0].text).not.toContain("Nordform");
    expect(b.sources[0].text).toContain("Nordform");
  });
  it("rejects invented evidence instead of installing a draft", () => {
    const c = createCapture("keller-elektro"), result = exampleDraft(c);
    result.rules[0].evidence[0].quote = "invented";
    expect(() => installDraft(c, result)).toThrow(/evidence/i);
  });
  it("clears approval and test readiness when a snippet is corrected", () => {
    let c = ready(); const id = c.snippets[0].id;
    c = evaluateScenario(c, "C1", "C1-A");
    const oldRevision = c.revision;
    c = reviseSnippet(c, id, { ...c.snippets[0].rule, action: "Stop and ask the content owner." });
    expect(c.snippets[0].status).toBe("revised"); expect(c.snippets[0].approvedRevision).toBeNull();
    expect(c.revision).toBeGreaterThan(oldRevision); expect(c.scenarios[0].approved).toBe(false);
    expect(() => publishMemory(c, [], "2026-11-07T14:00:00Z")).toThrow();
    expect(c.sources.at(-1)?.text).toContain("Stop and ask the content owner.");
  });
  it("does not treat a fixture answer key as coverage", () => {
    let c = ready(); c.scenarios.push(structuredClone(datasets["keller-elektro"].scenarios[1]));
    c = evaluateScenario(c, "C2", "C2-B");
    expect(c.attempts.at(-1)?.outcome).toBe("gap");
    expect(c.attempts.at(-1)?.selectedOptionId).toBeNull();
    const count = c.questions.length;
    c = evaluateScenario(c, "C2", null);
    expect(c.questions).toHaveLength(count);
  });
  it("rejects missing or unknown selections on covered cases", () => {
    expect(() => evaluateScenario(ready(), "C1", null)).toThrow(/choose/i);
    expect(() => evaluateScenario(ready(), "C1", "bogus")).toThrow();
  });
  it("requires scenario approval against an approved snippet", () => {
    const c = createCapture("keller-elektro"); c.scenarios = structuredClone(datasets["keller-elektro"].scenarios);
    expect(() => approveScenario(c, "C1", "unknown")).toThrow();
  });
  it("publishes an independent snapshot only after a current correct attempt", () => {
    let c = ready(); expect(() => publishMemory(c, [], "2026-11-07T14:00:00Z")).toThrow(/test/i);
    c = evaluateScenario(c, "C1", "C1-A");
    const published = publishMemory(c, [], "2026-11-07T14:00:00Z");
    const before = JSON.stringify(published);
    c.snippets[0].rule.action = "changed";
    expect(JSON.stringify(published)).toBe(before);
  });
  it("finds predecessors only in the same organization, position and example context", () => {
    let c = ready(); c = evaluateScenario(c,"C1","C1-A"); const p = publishMemory(c,[],"2026-11-07T14:00:00Z");
    expect(findPrevious(createCapture("keller-elektro"),[p])).toHaveLength(1);
    expect(findPrevious(createCapture("nordform"),[p])).toHaveLength(0);
    const custom = createCapture(); custom.profile = c.profile;
    expect(findPrevious(custom,[p])).toHaveLength(0);
  });
  it("keeps the exact tested scenario and guidance in historical attempts",()=>{
    let c=ready();c=evaluateScenario(c,"C1","C1-A");
    const original=c.attempts[0];
    c.scenarios[0].title="Changed scenario";c.snippets[0].rule.action="Changed guidance";
    expect(original.scenario.title).toBe("Lights out, labelled breaker tripped");
    expect(original.rule?.action).not.toBe("Changed guidance");
  });
  it("increments publication history when the same capture is revised",()=>{
    let c=ready();c=evaluateScenario(c,"C1","C1-A");const first=publishMemory(c,[],"2026-11-07T14:00:00Z");
    c=reviseSnippet(c,c.snippets[0].id,{...c.snippets[0].rule,action:"Check the visible cause and call the owner if unsure."});
    c=approveSnippet(c,c.snippets[0].id);c=approveScenario(c,"C1",c.snippets[0].id);c=evaluateScenario(c,"C1","C1-A");
    const second=publishMemory(c,[first],"2026-11-07T14:10:00Z");
    expect(second.version).toBe(2);expect(second.previousId).toBe(first.id);
  });
  it("answer revisions require renewed acceptance", () => {
    let c = ready(); const q = c.questions[0];
    c = reviseAnswer(c,q.id,"Ask Jonas before changing unfamiliar equipment.");
    expect(c.questions[0].status).toBe("draft");
    c = acceptAnswer(c,q.id); expect(c.questions[0].status).toBe("accepted");
    c = reviseAnswer(c,q.id,"Stop and call Jonas.");
    expect(c.questions[0].status).toBe("draft"); expect(c.questions[0].approvedRevision).toBeNull();
  });
  it("never installs example scenarios or labels for live extraction",()=>{
    const c=createCapture("keller-elektro"),sample=exampleDraft(c);
    const live=installDraft(c,{...sample,origin:"live"});
    expect(live.datasetId).toBeNull();expect(live.origin).toBe("live");expect(live.scenarios).toEqual([]);
  });
  it("keeping predecessor guidance clears discarded snippet coverage and remains persistable",()=>{
    let old=ready();old=evaluateScenario(old,"C1","C1-A");const p=publishMemory(old,[],"2026-11-07T14:00:00Z");
    const c=ready();const next=resolvePrevious(c,p,p.rules[0].id,"keep",c.snippets[0].id);
    expect(next.scenarios[0].approved).toBe(false);
    expect(()=>parseWorkspace(JSON.stringify({schemaVersion:2,capture:next,publications:[p]}))).not.toThrow();
    expect(()=>resolvePrevious(next,p,p.rules[0].id,"new",c.snippets[0].id)).toThrow(/current/i);
  });
});

describe("request isolation", () => {
  it("does not install a late result after reset", () => {
    let s = createSession(); s = sessionReducer(s,{type:"hydrated",workspace:{schemaVersion:2,capture:createCapture("keller-elektro"),publications:[]}});
    const c = s.workspace.capture;
    s = sessionReducer(s,{type:"begin",token:"old"});
    s = sessionReducer(s,{type:"reset"});
    s = sessionReducer(s,{type:"draftResult",token:"old",result:exampleDraft(c)});
    expect(s.workspace.capture.snippets).toEqual([]); expect(s.pending).toBeNull();
  });
  it("does not mutate before hydration", () => {
    const s = createSession(); expect(sessionReducer(s,{type:"reset"})).toBe(s);
  });
});
