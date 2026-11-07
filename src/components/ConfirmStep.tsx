import { useState } from "react";
import type { Capture,PublishedMemory } from "@/lib/contracts";
import { resolvePrevious } from "@/lib/memory";
import { SnippetReview } from "./SnippetReview";
import { Icon } from "./Icon";
export function ConfirmStep({capture,onChange,previous,onNext,onBack}:{capture:Capture;onChange:(c:Capture)=>void;previous:PublishedMemory[];onNext:()=>void;onBack:()=>void}){
 const latest=previous[0];const unresolved=latest?.rules.some(r=>!capture.comparisons.some(d=>d.previousId===latest.id&&d.ruleId===r.id));
 const valid=capture.snippets.filter(s=>s.status!=="excluded").every(s=>s.status==="approved");
 return <section className="step-surface wide"><div className="page-heading"><h1>A final look.<br/><span>Make it yours.</span></h1><p>Confirm the corrections you made. Then check whether earlier knowledge from this role should carry forward.</p></div>
  <SnippetReview capture={capture} onChange={onChange} confirmOnly/>
  <div className="previous-section"><h2>Has this role been captured before?</h2>{!latest?<div className="empty-inline"><Icon name="book"/><p>No previous memory for this organization and position on this device. This will be the first.</p></div>:<><p className="quiet">Compare with {latest.profile.name}’s memory · Version {latest.version} · {new Date(latest.publishedAt).toLocaleDateString("en-GB")}. Confirm each use case before carrying guidance forward.</p>{latest.rules.map(rule=><PreviousRule key={rule.id} capture={capture} previous={latest} ruleId={rule.id} onChange={onChange}/>)}</>}</div>
  <div className="step-actions"><button className="back-button" onClick={onBack}><Icon name="back" size={17}/>Back</button><button className="primary" disabled={!valid||!!unresolved} onClick={onNext}>Confirm & continue<Icon name="arrow" size={18}/></button></div>
 </section>;
}
function PreviousRule({capture,previous,ruleId,onChange}:{capture:Capture;previous:PublishedMemory;ruleId:string;onChange:(c:Capture)=>void}){
 const old=previous.rules.find(r=>r.id===ruleId)!;const [currentId,setCurrentId]=useState(capture.snippets.find(s=>s.status!=="excluded")?.id??""),[merge,setMerge]=useState(false),[text,setText]=useState("");
 const current=capture.snippets.find(s=>s.id===currentId&&s.status!=="excluded");const decision=capture.comparisons.find(d=>d.previousId===previous.id&&d.ruleId===ruleId);
 return <article className="comparison"><div className="comparison-columns"><div><span className="quiet">Previous capture</span><h3>{old.situation}</h3><p>{old.action}</p><details><summary>Previous source</summary>{old.evidence.map((e,i)=><blockquote key={i}>{e.quote}</blockquote>)}</details></div><div><label>Compare with your snippet<select value={currentId} onChange={e=>setCurrentId(e.target.value)}>{capture.snippets.filter(s=>s.status!=="excluded").map(s=><option key={s.id} value={s.id}>{s.rule.situation}</option>)}</select></label><p>{current?.rule.action}</p></div></div>
  {decision?<p className="comparison-done"><Icon name="check" size={16}/>Decision recorded: {decision.decision==="different"?"different use case":decision.decision==="keep"?"carry previous guidance forward":decision.decision==="new"?"use current guidance":"combined guidance requires review"}</p>:<><p className="field-help">Are these the same use case? Choose how the guidance should continue.</p><div className="comparison-actions"><button className="secondary small" onClick={()=>onChange(resolvePrevious(capture,previous,ruleId,"keep",currentId))}>Keep previous</button><button className="secondary small" disabled={!current} onClick={()=>onChange(resolvePrevious(capture,previous,ruleId,"new",currentId))}>Use mine</button><button className="secondary small" disabled={!current} onClick={()=>{setMerge(true);setText(current?.rule.action??"");}}>Combine</button><button className="text-button" onClick={()=>onChange(resolvePrevious(capture,previous,ruleId,"different"))}>Different use case</button></div></>}
  {merge&&!decision&&<div className="inline-editor"><label>Combined guidance<textarea rows={4} value={text} onChange={e=>setText(e.target.value)}/></label><button className="primary small" disabled={!text.trim()} onClick={()=>{onChange(resolvePrevious(capture,previous,ruleId,"combine",currentId,text));setMerge(false);}}>Save combined snippet for review</button></div>}
 </article>;
}
