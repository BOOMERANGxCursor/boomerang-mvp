import { CaptureSchema, ExtractionResultSchema, RuleSchema, ScenarioSchema, type Capture, type DatasetId, type ExtractionResult, type PublishedMemory, type Rule, type Scenario, type SourceSegment } from "./contracts";
import { datasets } from "./demo";

export function createCapture(datasetId:DatasetId|null=null):Capture {
  return {id:crypto.randomUUID(),revision:0,datasetId,origin:datasetId?"example":"live",profile:datasetId?structuredClone(datasets[datasetId].profile):{name:"",position:"",organization:"",experience:null,owner:""},step:0,sources:datasetId?[structuredClone(datasets[datasetId].sources[0])]:[],snippets:[],questions:[],scenarios:[],attempts:[],comparisons:[],comparisonComplete:false};
}
export function validateEvidence(rules:Rule[],sources:SourceSegment[]) {
  if(new Set(sources.map(s=>s.id)).size!==sources.length) throw new Error("Duplicate source IDs.");
  for(const rule of rules) {
    RuleSchema.parse(rule);
    for(const e of rule.evidence) if(!e.quote.trim() || !sources.find(s=>s.id===e.sourceId)?.text.includes(e.quote)) throw new Error("Source evidence does not match the original text.");
  }
}
export function changed(c:Capture):Capture {
  const next=structuredClone(c); next.revision++; return next;
}
export function installDraft(c:Capture,result:ExtractionResult):Capture {
  result=ExtractionResultSchema.parse(result); validateEvidence(result.rules,c.sources);
  const next=changed(c);next.origin=result.origin;if(result.origin==="live")next.datasetId=null;
  next.snippets=result.rules.map(rule=>({id:rule.id,rule:structuredClone(rule),revision:0,approvedRevision:null,status:"pending"}));
  next.questions=result.questions.map(text=>({id:crypto.randomUUID(),text,answer:"",status:"open",origin:result.origin==="example"?"example":"extraction",sourceIds:c.sources.filter(s=>s.active!==false).map(s=>s.id),fromRevision:next.revision,revision:0,approvedRevision:null}));
  next.scenarios=result.origin==="example"&&c.datasetId?structuredClone(datasets[c.datasetId].scenarios):[];
  next.comparisonComplete=false; next.comparisons=[]; next.step=2; return next;
}
export function approveSnippet(c:Capture,id:string):Capture {
  const next=structuredClone(c),s=next.snippets.find(s=>s.id===id);
  if(!s || s.status==="excluded") throw new Error("Snippet not available.");
  validateEvidence([s.rule],next.sources); s.status="approved";s.approvedRevision=s.revision; return next;
}
export function reviseSnippet(c:Capture,id:string,rule:Rule):Capture {
  const next=changed(c),s=next.snippets.find(s=>s.id===id); if(!s)throw new Error("Unknown snippet.");
  const text=[rule.situation,...rule.conditions,rule.action,rule.rationale,...rule.exceptions].filter(Boolean).join("\n");
  const source={id:crypto.randomUUID(),text,author:c.profile.name||"Expert",name:"Expert correction",kind:"text" as const};
  s.rule=RuleSchema.parse({...rule,id:s.id,evidence:[{sourceId:source.id,quote:text}]});
  next.sources.push(source);s.revision++;s.approvedRevision=null;s.status="revised";
  next.scenarios=next.scenarios.map(x=>x.ruleId===id?{...x,approved:false}:x);return next;
}
export function addSnippet(c:Capture,action:string):Capture {
  if(!action.trim())throw new Error("Write the missing knowledge first.");
  const id=crypto.randomUUID(); const next=structuredClone(c);
  next.snippets.push({id,revision:0,approvedRevision:null,status:"pending",rule:{id,situation:"Additional expert knowledge",conditions:[],action,rationale:null,exceptions:[],evidence:[]}});
  return reviseSnippet(next,id,next.snippets.at(-1)!.rule);
}
export function setSnippetStatus(c:Capture,id:string,status:"correction"|"excluded"|"pending"):Capture {
  const next=changed(c),s=next.snippets.find(x=>x.id===id);if(!s)throw new Error("Unknown snippet.");
  s.status=status;s.approvedRevision=null;
  next.scenarios=next.scenarios.map(x=>x.ruleId===id?{...x,approved:false}:x);return next;
}
export function reviseAnswer(c:Capture,id:string,answer:string):Capture {
  const next=changed(c),q=next.questions.find(q=>q.id===id);if(!q)throw new Error("Unknown question.");
  q.answer=answer;q.revision++;q.approvedRevision=null;q.status=answer.trim()?"draft":"open";
  const s=next.snippets.find(s=>s.id===`answer-${id}`);if(s){s.status=answer.trim()?"correction":"excluded";s.approvedRevision=null;}
  next.scenarios=next.scenarios.map(x=>x.ruleId===`answer-${id}`?{...x,approved:false}:x);return next;
}
export function acceptAnswer(c:Capture,id:string):Capture {
  const next=changed(c),q=next.questions.find(q=>q.id===id);if(!q?.answer.trim())throw new Error("Write an answer before accepting it.");
  q.status="accepted";q.approvedRevision=q.revision;
  const source={id:crypto.randomUUID(),text:q.answer,author:c.profile.name,name:"Expert answer",kind:"text" as const};next.sources.push(source);
  const rule:Rule={id:`answer-${id}`,situation:q.text,conditions:[],action:q.answer,rationale:null,exceptions:[],evidence:[{sourceId:source.id,quote:source.text}]};
  const index=next.snippets.findIndex(s=>s.id===rule.id);
  const revision=index<0?0:next.snippets[index].revision+1;
  const snippet={id:rule.id,rule,revision,approvedRevision:revision,status:"approved" as const};
  if(index<0)next.snippets.push(snippet);else next.snippets[index]=snippet;
  return next;
}
export function approveScenario(c:Capture,id:string,ruleId:string):Capture {
  const next=changed(c),scenario=next.scenarios.find(x=>x.id===id),snippet=next.snippets.find(x=>x.id===ruleId);
  if(!scenario||snippet?.status!=="approved"||snippet.approvedRevision!==snippet.revision)throw new Error("Link this scenario to an approved snippet.");
  ScenarioSchema.parse(scenario);scenario.ruleId=ruleId;scenario.approved=true;return next;
}
export function evaluateScenario(c:Capture,id:string,selected:string|null):Capture {
  const scenario=c.scenarios.find(x=>x.id===id);if(!scenario)throw new Error("Unknown scenario.");
  const rule=c.snippets.find(s=>s.id===scenario.ruleId && s.status==="approved" && s.approvedRevision===s.revision);
  const covered=scenario.approved && !!rule;
  if(covered && !selected)throw new Error("Choose an answer before checking.");
  if(covered && !scenario.options.some(o=>o.id===selected))throw new Error("Unknown answer choice.");
  const next=structuredClone(c);
  next.attempts.push({id:crypto.randomUUID(),scenarioId:id,captureRevision:c.revision,selectedOptionId:covered?selected:null,outcome:covered?(selected===scenario.correctOptionId?"correct":"incorrect"):"gap",ruleId:covered?rule!.id:null,scenario:structuredClone(scenario),rule:covered?structuredClone(rule!.rule):null});
  if(!covered) {
    const text=`${scenario.title}: ${scenario.facts.join("; ")}. What should someone do, why, and when should they stop or escalate?`;
    if(!next.questions.some(q=>q.text===text))next.questions.push({id:crypto.randomUUID(),text,answer:"",status:"open",origin:"scenario",sourceIds:[],fromRevision:c.revision,scenarioId:id,revision:0,approvedRevision:null});
  }
  return next;
}
export function findPrevious(c:Capture,publications:PublishedMemory[]) {
  const norm=(s:string)=>s.trim().toLocaleLowerCase().replace(/\s+/g," ");
  return publications.filter(p=>p.captureId!==c.id && p.datasetId===c.datasetId && norm(p.profile.organization)===norm(c.profile.organization) && norm(p.profile.position)===norm(c.profile.position)).sort((a,b)=>b.version-a.version);
}
export function resolvePrevious(c:Capture,p:PublishedMemory,ruleId:string,decision:"keep"|"new"|"combine"|"different",currentId?:string,combined?:string):Capture {
  if(!findPrevious(c,[p]).length)throw new Error("This memory is not a matching predecessor.");
  let next=changed(c);const old=p.rules.find(r=>r.id===ruleId);if(!old)throw new Error("Unknown previous snippet.");
  if(["new","combine"].includes(decision)&&!next.snippets.some(s=>s.id===currentId&&s.status!=="excluded"))throw new Error("Choose a current retained snippet for this comparison.");
  if(decision==="keep") {
    for(const source of p.sources)if(!next.sources.some(s=>s.id===source.id))next.sources.push(structuredClone(source));
    const newId=crypto.randomUUID(); const copied={...structuredClone(old),id:newId};
    if(currentId){const s=next.snippets.find(s=>s.id===currentId);if(s){s.status="excluded";s.approvedRevision=null;next.scenarios=next.scenarios.map(x=>x.ruleId===currentId?{...x,approved:false}:x);}}
    next.snippets.push({id:newId,rule:copied,status:"revised",revision:0,approvedRevision:null});
  }
  if(decision==="combine") {
    if(!currentId||!combined?.trim())throw new Error("Choose a current snippet and write the combined guidance.");
    const current=next.snippets.find(s=>s.id===currentId);if(!current)throw new Error("Unknown current snippet.");
    next=reviseSnippet(next,currentId,{...current.rule,action:combined});
  }
  next.comparisons=next.comparisons.filter(x=>!(x.previousId===p.id&&x.ruleId===ruleId));
  next.comparisons.push({previousId:p.id,ruleId,decision});next.comparisonComplete=false;return next;
}
export function publicationBlocker(c:Capture,publications:PublishedMemory[]) {
  if(!c.profile.name.trim()||!c.profile.organization.trim()||!c.profile.position.trim()||!c.profile.owner.trim())return "Complete the expert profile first.";
  const kept=c.snippets.filter(s=>s.status!=="excluded");
  if(!kept.length||kept.some(s=>s.status!=="approved"||s.approvedRevision!==s.revision))return "Approve every retained snippet.";
  if(c.questions.some(q=>q.status==="draft"))return "Approve or clear the unfinished expert answers.";
  const prior=findPrevious(c,publications)[0];
  if(!c.comparisonComplete || (prior&&prior.rules.some(r=>!c.comparisons.some(d=>d.previousId===prior.id&&d.ruleId===r.id))))return "Complete the previous-memory comparison.";
  if(!c.attempts.some(a=>a.captureRevision===c.revision&&a.outcome==="correct"))return "Complete a successful manual test of this revision.";
  return null;
}
export function publishMemory(c:Capture,publications:PublishedMemory[],now:string):PublishedMemory {
  CaptureSchema.parse(c); const blocker=publicationBlocker(c,publications);if(blocker)throw new Error(blocker);
  const rules=c.snippets.filter(s=>s.status==="approved").map(s=>s.rule);validateEvidence(rules,c.sources);
  const prior=[...findPrevious(c,publications),...publications.filter(p=>p.captureId===c.id)].sort((a,b)=>b.version-a.version)[0];
  return structuredClone({id:crypto.randomUUID(),version:(prior?.version??0)+1,captureId:c.id,revision:c.revision,datasetId:c.datasetId,profile:c.profile,sources:c.sources,rules,questions:c.questions,scenarios:c.scenarios.filter(s=>s.approved),publishedAt:now,previousId:prior?.id??null});
}

export function ownMaterial(c:Capture):Capture {
 if(!c.datasetId)return c;
 return {...changed(c),datasetId:null,origin:"live",sources:c.sources.map(s=>({...s,active:false})),snippets:[],questions:[],scenarios:[],attempts:[],comparisons:[],comparisonComplete:false};
}
