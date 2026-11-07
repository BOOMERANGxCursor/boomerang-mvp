import { WorkspaceSchema, type Workspace } from "./contracts";
import { validateEvidence } from "./memory";
export const STORAGE_KEY="boomerang.workspace.v2";
export function parseWorkspace(raw:string):Workspace {
 const w=WorkspaceSchema.parse(JSON.parse(raw));
 for(const c of [w.capture,...w.publications]){
  const rules="snippets" in c?c.snippets.map(s=>s.rule):c.rules;
  validateEvidence(rules,c.sources);
  for(const s of c.scenarios){
   if(s.ruleId&&!rules.some(r=>r.id===s.ruleId))throw new Error("Dangling scenario link.");
   if(s.approved&&(!s.ruleId||("snippets" in c&&!c.snippets.some(r=>r.id===s.ruleId&&r.status==="approved"))))throw new Error("Unapproved scenario coverage.");
  }
  if("snippets" in c){
   for(const s of c.snippets)if(s.id!==s.rule.id||(s.status==="approved"&&s.approvedRevision!==s.revision))throw new Error("Invalid approval revision.");
   for(const a of c.attempts){
    const scenario=a.scenario;
    if(scenario.id!==a.scenarioId||a.captureRevision>c.revision||a.ruleId!==a.rule?.id&&a.ruleId!==null)throw new Error("Dangling attempt.");
    if(a.outcome!=="gap"&&(!scenario.options.some(o=>o.id===a.selectedOptionId)||!a.rule||!scenario.approved||scenario.ruleId!==a.rule.id))throw new Error("Invalid attempt choice.");
    if(a.outcome==="correct"&&a.selectedOptionId!==scenario.correctOptionId||a.outcome==="incorrect"&&a.selectedOptionId===scenario.correctOptionId)throw new Error("Stored outcome does not match the answer.");
    if(a.rule)validateEvidence([a.rule],c.sources);
    if(a.outcome=== "gap"&&(a.selectedOptionId!==null||a.ruleId!==null||a.rule!==null))throw new Error("Invalid uncovered attempt.");
   }
  }
  for(const q of c.questions){if(q.sourceIds?.some(id=>!c.sources.some(s=>s.id===id)))throw new Error("Missing question source.");if(q.status==="accepted"&&(q.approvedRevision!==q.revision||!q.answer.trim()))throw new Error("Invalid question approval.");}
 }
 for(const p of w.publications)if(p.previousId&&!w.publications.some(v=>v.id===p.previousId))throw new Error("Missing previous memory.");
 return w;
}
export function loadWorkspace():Workspace|null {
 const raw=localStorage.getItem(STORAGE_KEY);return raw?parseWorkspace(raw):null;
}
export function saveWorkspace(w:Workspace):boolean {
 try{const valid=parseWorkspace(JSON.stringify(w));localStorage.setItem(STORAGE_KEY,JSON.stringify(valid));return true;}catch{return false;}
}
