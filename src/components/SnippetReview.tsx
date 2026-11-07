import { useEffect,useState } from "react";
import type { Capture,Rule,Snippet } from "@/lib/contracts";
import { addSnippet,approveSnippet,reviseSnippet,setSnippetStatus } from "@/lib/memory";
import { Icon } from "./Icon";
export function SnippetReview({capture,onChange,confirmOnly=false,onDirtyChange}:{capture:Capture;onChange:(c:Capture)=>void;confirmOnly?:boolean;onDirtyChange?:(dirty:boolean)=>void}){
 const [adding,setAdding]=useState(false),[extra,setExtra]=useState("");
 useEffect(()=>{onDirtyChange?.(adding&&!!extra.trim());},[adding,extra,onDirtyChange]);
 const visible=confirmOnly?capture.snippets.filter(s=>s.status!=="approved"&&s.status!=="excluded"):capture.snippets;
 return <><div className="review-list">{visible.map(s=><SnippetCard key={`${s.id}-${s.revision}-${s.status}`} snippet={s} capture={capture} onChange={onChange} confirmOnly={confirmOnly}/>)}{confirmOnly&&!visible.length&&<div className="completion-line"><span className="completion-icon"><Icon name="check"/></span><div><h2>Everything is reviewed.</h2><p>No outstanding corrections. Your approved snippets are ready.</p></div></div>}</div>
  {!confirmOnly&&<>{adding?<div className="inline-editor"><label htmlFor="extra-knowledge">What is missing?</label><textarea id="extra-knowledge" rows={4} value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Write the knowledge you want your successor to have."/><div className="row-end"><button className="secondary small" onClick={()=>setAdding(false)}>Cancel</button><button className="primary small" disabled={!extra.trim()} onClick={()=>{onChange(addSnippet(capture,extra));setExtra("");setAdding(false);}}>Save for review</button></div></div>:<button className="add-knowledge" onClick={()=>setAdding(true)}><Icon name="plus" size={18}/>Add something that’s missing</button>}</>}
 </>;
}
function SnippetCard({snippet:s,capture,onChange,confirmOnly}:{snippet:Snippet;capture:Capture;onChange:(c:Capture)=>void;confirmOnly:boolean}){
 const [rule,setRule]=useState<Rule>(structuredClone(s.rule));
 const status={pending:"To review",correction:"Needs correction",revised:"Review again",approved:"Approved",excluded:"Excluded"}[s.status];
 const update=(key:keyof Rule,value:string)=>setRule({...rule,[key]:key==="conditions"||key==="exceptions"?value.split("\n").filter(Boolean):key==="rationale"?value||null:value});
 if(s.status==="excluded")return <div className="excluded-row"><span>{s.rule.situation}</span><button className="text-button" onClick={()=>onChange(setSnippetStatus(capture,s.id,"pending"))}>Undo exclusion</button></div>;
 return <article className={`snippet ${s.status==="approved"?"approved":""}`}>
  <div className="snippet-top"><span className={`status ${s.status}`}>{s.status==="approved"&&<Icon name="check" size={13}/>} {status}</span><div className="snippet-decisions">
   <button className="decision approve" title="Approve this snippet" aria-label={`Approve snippet: ${s.rule.situation}`} disabled={s.status==="approved"||s.status==="correction"||(!confirmOnly&&s.status==="revised")} onClick={()=>onChange(approveSnippet(capture,s.id))}><Icon name="check" size={18}/></button>
   <button className="decision correct" title="Needs correction" aria-label={`Correct snippet: ${s.rule.situation}`} onClick={()=>onChange(setSnippetStatus(capture,s.id,"correction"))}><Icon name="close" size={18}/></button>
  </div></div>
  <h2>{s.rule.situation}</h2>
  {s.status==="correction"?<div className="correction-editor"><label>What should this say?<textarea rows={4} value={rule.action} onChange={e=>update("action",e.target.value)}/></label><details className="edit-details"><summary>Edit the situation, context and exceptions</summary><label>Situation<input value={rule.situation} onChange={e=>update("situation",e.target.value)}/></label><label>When this applies<textarea rows={2} value={rule.conditions.join("\n")} onChange={e=>update("conditions",e.target.value)}/></label><label>Why<textarea rows={2} value={rule.rationale??""} onChange={e=>update("rationale",e.target.value)}/></label><label>When to stop or escalate<textarea rows={2} value={rule.exceptions.join("\n")} onChange={e=>update("exceptions",e.target.value)}/></label></details><div className="row-between"><span className="field-help">Your correction will need a fresh approval.</span><button className="primary small" disabled={!rule.action.trim()||!rule.situation.trim()} onClick={()=>onChange(reviseSnippet(capture,s.id,rule))}>Save correction<Icon name="arrow" size={16}/></button></div></div>:<>
   <p className="snippet-action">{s.rule.action}</p><dl className="snippet-context">{!!s.rule.conditions.length&&<div><dt>When</dt><dd>{s.rule.conditions.join(" ")}</dd></div>}<div><dt>Why</dt><dd>{s.rule.rationale??"Not provided in the source."}</dd></div>{!!s.rule.exceptions.length&&<div><dt>Stop / escalate</dt><dd>{s.rule.exceptions.join(" ")}</dd></div>}</dl>
   {s.status==="revised"&&!confirmOnly&&<p className="review-next">Correction saved. You’ll approve the updated version in the next step.</p>}
  </>}
  <div className="snippet-footer"><details className="evidence-details"><summary><Icon name="file" size={15}/>View source {s.rule.evidence.length>1?`(${s.rule.evidence.length})`:""}</summary>{s.rule.evidence.map((e,i)=><div className="evidence-quote" key={i}><p>{capture.sources.find(x=>x.id===e.sourceId)?.name??"Source"} · {capture.sources.find(x=>x.id===e.sourceId)?.author}</p><blockquote>{e.quote}</blockquote></div>)}</details><button className="text-button subtle" onClick={()=>onChange(setSnippetStatus(capture,s.id,"excluded"))}>Exclude</button></div>
 </article>;
}
