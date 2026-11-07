import { expect, it } from "vitest";
import { createCapture } from "../src/lib/memory";
import { installDraft,approveSnippet,approveScenario,evaluateScenario } from "../src/lib/memory";
import { exampleDraft,datasets } from "../src/lib/demo";
import { parseWorkspace } from "../src/lib/storage";

it("round trips a valid empty workspace", () => {
  const w = {schemaVersion:2,capture:createCapture(),publications:[]};
  expect(parseWorkspace(JSON.stringify(w))).toEqual(w);
});
it("rejects corrupt or unsupported storage instead of partially trusting it", () => {
  expect(() => parseWorkspace("{bad")).toThrow();
  expect(() => parseWorkspace('{"schemaVersion":1}')).toThrow();
});
it("rejects dangling source references", () => {
  const c = createCapture("keller-elektro");
  c.snippets = [{id:"r",revision:0,approvedRevision:null,status:"pending",rule:{id:"r",situation:"x",conditions:[],action:"y",rationale:null,exceptions:[],evidence:[{sourceId:"missing",quote:"x"}]}}];
  expect(() => parseWorkspace(JSON.stringify({schemaVersion:2,capture:c,publications:[]}))).toThrow();
});
it("rejects stored attempts whose outcome contradicts the selected answer",()=>{
 let c=createCapture("keller-elektro");c=installDraft(c,exampleDraft(c));c=approveSnippet(c,c.snippets[0].id);c.scenarios=structuredClone(datasets["keller-elektro"].scenarios);c=approveScenario(c,"C1",c.snippets[0].id);c=evaluateScenario(c,"C1","C1-B");c.attempts[0].outcome="correct";
 expect(()=>parseWorkspace(JSON.stringify({schemaVersion:2,capture:c,publications:[]}))).toThrow();
});
