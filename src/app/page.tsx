"use client";
import { useEffect,useReducer,useRef,useState } from "react";
import { CaptureSchema,ExtractionResultSchema,ScenarioSchema,type Capture,type DatasetId,type SourceSegment } from "@/lib/contracts";
import { createSession,sessionReducer } from "@/lib/session";
import { changed,findPrevious,validateEvidence,ownMaterial } from "@/lib/memory";
import { datasets,exampleDraft } from "@/lib/demo";
import { loadWorkspace,parseWorkspace,saveWorkspace,STORAGE_KEY } from "@/lib/storage";
import { decodeText,fileKind,mediaDuration,validateFile } from "@/lib/uploads";
import { ProfileStep } from "@/components/ProfileStep";
import { UploadStep,type FileRow } from "@/components/UploadStep";
import { SnippetReview } from "@/components/SnippetReview";
import { ConfirmStep } from "@/components/ConfirmStep";
import { QuestionsStep } from "@/components/QuestionsStep";
import { FinishStep } from "@/components/FinishStep";
import { TestRun } from "@/components/TestRun";
import { Icon } from "@/components/Icon";
const steps=[{title:"Your profile",detail:"The person behind the knowledge"},{title:"Add knowledge",detail:"Bring the material you have"},{title:"Review snippets",detail:"Check what we understood"},{title:"Confirm memory",detail:"Make corrections count"},{title:"Expert questions",detail:"Fill in the missing pieces"},{title:"Ready to share",detail:"Test it, then pass it on"}];
export default function Home(){
 const [state,dispatch]=useReducer(sessionReducer,undefined,createSession),[access,setAccess]=useState(""),[rows,setRows]=useState<FileRow[]>([]),[reading,setReading]=useState(false);
 const stateRef=useRef(state);stateRef.current=state;
 const [activeWork,setActiveWork]=useState("");const [reviewDirty,setReviewDirty]=useState(false),[questionDirty,setQuestionDirty]=useState(false);const c=state.workspace.capture;const pending=!!state.pending||reading;
 const headingRef=useRef<HTMLDivElement>(null);const lastStep=useRef(c.step);
 useEffect(()=>{try{dispatch({type:"hydrated",workspace:loadWorkspace()});}catch(error){if(error instanceof DOMException){dispatch({type:"hydrated",workspace:null});dispatch({type:"temporary"});}else dispatch({type:"recovery"});}},[]);
 useEffect(()=>{if(state.hydration==="ready"&&!saveWorkspace(state.workspace)&&!state.temporary)dispatch({type:"temporary"});},[state.workspace,state.hydration,state.temporary]);
 useEffect(()=>{if(lastStep.current!==c.step){headingRef.current?.focus();window.scrollTo({top:0,behavior:"instant"});lastStep.current=c.step;}},[c.step]);
 function update(capture:Capture){dispatch({type:"capture",capture});}
 function go(step:number){update({...c,step});}
 function error(message:string){dispatch({type:"notice",message});}
 function chooseDataset(datasetId:DatasetId|null){if((c.profile.name||c.sources.length||c.snippets.length)&&!window.confirm("Start a new capture? Your current draft will be replaced. Published memories will stay on this device."))return;dispatch({type:"newCapture",datasetId});setRows([]);}
 async function post(path:string,body:unknown,form=false){
  const response=await fetch(path,{method:"POST",headers:{"x-demo-access":access,...(!form?{"content-type":"application/json"}:{})},body:form?body as FormData:JSON.stringify(body)});
  const data=await response.json();if(!response.ok)throw new Error(data.message??"Processing did not finish. Your work is kept; retry.");return data;
 }
 async function extract(){
  const sources=c.sources.filter(s=>s.active!==false);if(!sources.length)return;
  if(c.snippets.length&&!window.confirm("Rebuild the draft from these sources? Your current snippet review will be replaced; published memories are kept."))return;
  const token=crypto.randomUUID();dispatch({type:"begin",token});setActiveWork("Finding skills in your sources");
  try{
   const sample=c.datasetId?datasets[c.datasetId]:null;
   const isExample=!!sample&&sources.every(s=>sample.sources.some(original=>original.id===s.id&&original.text===s.text));
   const result=ExtractionResultSchema.parse(isExample?exampleDraft({...c,sources}):await post("/api/extract",{sources}));
   validateEvidence(result.rules,c.sources);
   if(!result.rules.length){dispatch({type:"failed",token,message:"No supported guidance was found. Keep your notes and add a concrete decision, then try again."});return;}
   dispatch({type:"draftResult",token,result});
  }catch(e){dispatch({type:"failed",token,message:e instanceof Error?e.message:"The draft could not be read. Your sources are kept."});}
  finally{setActiveWork("");}
 }
 async function readFiles(files:File[]){
  if(pending||!files.length)return;
  if(c.datasetId&&!window.confirm("Replace the prepared example with your own files? The example draft will be cleared after a file is read successfully; published memories are kept."))return;
  if(c.sources.filter(s=>s.active!==false).length+files.length>6){error("Use at most six sources at a time. Remove a source before adding more.");return;}
  const context={id:c.id,revision:c.revision};const freshRows=files.map(file=>({id:crypto.randomUUID(),file,status:"queued" as const}));
  setRows(old=>[...old.filter(r=>!files.some(f=>f===r.file)),...freshRows]);setReading(true);setActiveWork("Reading your files");dispatch({type:"notice",message:null});
  const successes:SourceSegment[]=[];
  for(const row of freshRows){
   setRows(old=>old.map(r=>r.id===row.id?{...r,status:"reading"}:r));
   try{
    const bytes=new Uint8Array(await row.file.arrayBuffer());const kind=validateFile(row.file.name,bytes,row.file.type);
    if(kind==="audio"||kind==="video"){const duration=await mediaDuration(row.file);if(duration>60)throw new Error("Use a recording no longer than 60 seconds.");}
    let text:string;let warnings:string[]=[];
    if(kind==="text")text=decodeText(bytes);else{const form=new FormData();form.set("file",row.file);const data=await post("/api/read",form,true);text=data.text;warnings=data.warnings??[];}
    if(!text.trim()||text.length>10000)throw new Error("Use a source with 1–10,000 readable characters.");
    successes.push({id:crypto.randomUUID(),text,author:c.profile.name,name:row.file.name,kind,active:true,warnings});
    setRows(old=>old.map(r=>r.id===row.id?{...r,status:"done"}:r));

   }catch(e){setRows(old=>old.map(r=>r.id===row.id?{...r,status:"error",error:e instanceof Error?e.message:"Could not read this file. Try another copy."}:r));}
  }
  const latest=stateRef.current.workspace.capture;
  if(successes.length&&latest.id===context.id&&latest.revision===context.revision){const next=changed(ownMaterial(latest));next.sources.push(...successes);update(next);}
  else if(successes.length)error("Newer changes were kept. Add the files again to this capture.");
  setReading(false);setActiveWork("");
 }
 async function generateScenarios(){
  if(c.scenarios.length&&!window.confirm("Replace the current scenario proposals? Previous test results stay in history."))return;
  const token=crypto.randomUUID();dispatch({type:"begin",token});setActiveWork("Preparing scenario proposals");
  try{
   const rules=c.snippets.filter(s=>s.status==="approved").map(s=>s.rule);const ids=new Set(rules.flatMap(r=>r.evidence.map(e=>e.sourceId)));const sources=c.sources.filter(s=>ids.has(s.id));
   const data=await post("/api/scenarios",{rules,sources});const scenarios=ScenarioSchema.array().max(3).parse(data.scenarios);
   if(!scenarios.length)throw new Error("No supported scenario could be proposed. Write a scenario or add more concrete guidance.");
   dispatch({type:"scenarioResult",token,scenarios});
  }catch(e){dispatch({type:"failed",token,message:e instanceof Error?e.message:"Could not prepare scenarios."});}finally{setActiveWork("");}
 }
 const kept=c.snippets.filter(s=>s.status!=="excluded");const reviewReady=kept.length>0&&kept.every(s=>s.status==="approved"||s.status==="revised");const allApproved=kept.length>0&&kept.every(s=>s.status==="approved");
 const completed=[!!(c.profile.name.trim()&&c.profile.position.trim()&&c.profile.organization.trim()&&c.profile.owner.trim()),!!c.sources.filter(s=>s.active!==false).length,reviewReady,allApproved&&c.comparisonComplete,!questionDirty&&(c.step===5||c.questions.some(q=>q.status==="accepted")),state.workspace.publications.some(p=>p.captureId===c.id&&p.revision===c.revision)];
 if(state.hydration==="recovery")return <div className="recovery-screen"><Icon name="shield" size={36}/><h1>Your saved workspace needs attention.</h1><p>The saved data could not be validated. It has not been overwritten.</p><p>Reset removes this browser’s saved workspace. Keep a copy first if you need to recover it.</p><button className="primary" onClick={()=>{if(window.confirm("Remove the invalid workspace and start fresh?")){try{localStorage.removeItem(STORAGE_KEY);}catch{}dispatch({type:"reset"});}}}>Reset this workspace</button></div>;
 return <div className="workspace-shell">
  <aside className="workspace-rail"><a className="wordmark" href="/" aria-label="BOOMERANG home"><svg viewBox="0 0 30 30" width="30" height="30" fill="none" aria-hidden="true"><path d="m6 24 8-18 10 9-13 2" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/></svg>boomerang<span className="brand-period">.</span></a><p className="rail-tagline">Experience does not retire.</p>
   <div className="rail-journey"><div className="rail-section-title">BUILD YOUR MEMORY</div><nav aria-label="Capture progress"><ol>{steps.map((step,i)=><li key={step.title} className={`${c.step===i&&!state.testing?"active":""} ${completed[i]?"complete":""}`}><button disabled={pending||state.hydration!=="ready"||i>c.step&&(!completed.slice(0,i).every(Boolean)||reviewDirty||questionDirty||(i===2&&!c.snippets.length))} aria-current={c.step===i&&!state.testing?"step":undefined} onClick={()=>{dispatch({type:"testing",value:false});go(i);}}><span className="step-number">{completed[i]?<Icon name="check" size={14}/>:i+1}</span><span><strong>{step.title}</strong><small>{step.detail}</small></span></button></li>)}</ol></nav></div>
   <div className="rail-footer"><div className="rail-footer-icon"><Icon name="book" size={21}/></div><p>A little of what you know.<br/><strong>A lot for who comes next.</strong></p><span>Made for the knowledge worth keeping.</span></div>
  </aside>
  <div className="workspace-main"><header className="workspace-topbar"><div className="workspace-location"><span>Your workspace</span><Icon name="chevron" size={13}/><strong>{c.profile.name?`${c.profile.name.split(" ")[0]}’s memory`:"New memory"}</strong></div><div className="topbar-actions"><label className="dataset-picker"><span>Try an example</span><select aria-label="Try an example" value={c.datasetId??""} disabled={pending||state.hydration!=="ready"} onChange={e=>chooseDataset((e.target.value||null) as DatasetId|null)}><option value="">Your own knowledge</option><option value="keller-elektro">Keller Elektro</option><option value="nordform">Nordform GmbH</option></select></label><details className="connection-menu"><summary aria-label="Connection settings" title="Connection settings"><Icon name="settings" size={19}/></summary><div><h3>Connection settings</h3><label>Demo access code<input type="password" autoComplete="off" value={access} onChange={e=>setAccess(e.target.value)} placeholder="Enter for live processing"/></label><p>Kept in memory only. Provider credentials are configured on the server.</p><button className="text-button" disabled={pending} onClick={()=>chooseDataset(null)}><Icon name="plus" size={15}/>Start a new memory</button><button className="text-button danger" disabled={pending} onClick={()=>{if(window.confirm("Reset all local captures and published memories? This removes the saved workspace on this device.")){dispatch({type:"reset"});setRows([]);}}}>Reset workspace</button></div></details></div></header>
   <main className="workspace-content"><div className="progress-heading"><span>{state.testing?"Manual test run":`Step ${c.step+1} of ${steps.length}`}<span className="progress-separator">/</span>{state.testing?`Revision ${c.revision}`:steps[c.step].title}</span><span className="save-label"><span className="save-dot"/>{state.hydration==="loading"?"Restoring workspace…":state.temporary?"Temporary session":"Saved on this device"}</span></div><div className="segmented-progress" role="progressbar" aria-label="Capture progress" aria-valuemin={0} aria-valuemax={6} aria-valuenow={completed.filter(Boolean).length}>{steps.map((s,i)=><span key={s.title} className={completed[i]?"done":c.step===i?"current":""}/>)}</div>
    {c.datasetId&&<div className="example-note"><Icon name="file" size={15}/><span>{datasets[c.datasetId].label} · Fictional example dataset. Prepared drafts are labelled; your uploads use live processing.</span></div>}
    {state.temporary&&<div className="notice">Storage is unavailable. Your changes stay in this session and will be lost on reload.</div>}
    {state.notice&&<div className="notice" role="alert"><p>{state.notice}</p><button aria-label="Dismiss message" onClick={()=>dispatch({type:"notice",message:null})}><Icon name="close" size={16}/></button></div>}
    <div role="status" aria-live="polite" className={activeWork?"processing-line":"visually-hidden"}>{activeWork&&<Icon name="spark" size={17}/>} {activeWork}</div>
    <div ref={headingRef} tabIndex={-1} className="step-focus">
    {state.hydration!=="ready"?<div className="loading-workspace">Restoring your workspace…</div>:state.testing?<TestRun capture={c} onChange={update} onClose={()=>dispatch({type:"testing",value:false})} onQuestions={()=>{dispatch({type:"testing",value:false});go(4);}}/>:<div key={c.id}>
     <div hidden={c.step!==0}><ProfileStep capture={c} onChange={update} onNext={()=>go(1)}/></div>
     <div hidden={c.step!==1}><UploadStep capture={c} onChange={update} onFiles={readFiles} onRemoveRow={id=>setRows(old=>old.filter(r=>r.id!==id))} rows={rows} busy={pending} onNext={extract} onBack={()=>go(0)}/></div>
     <div hidden={c.step!==2}><section className="step-surface wide"><div className="page-heading"><h1>Did I understand<br/><span>you correctly?</span></h1><p>Review each snippet. Approve what’s right, adjust what isn’t, and add anything we missed.</p></div><div className="review-counts"><span><strong>{kept.filter(s=>s.status==="approved").length}</strong> approved</span><span><strong>{kept.filter(s=>s.status==="revised").length}</strong> corrected</span><span><strong>{kept.filter(s=>s.status==="pending"||s.status==="correction").length}</strong> to review</span>{c.origin==="example"&&<span className="fixture-label">Prepared example draft</span>}</div><SnippetReview capture={c} onChange={update} onDirtyChange={setReviewDirty}/><div className="step-actions"><button className="back-button" onClick={()=>go(1)}><Icon name="back" size={17}/>Sources</button><button className="primary" disabled={!reviewReady||reviewDirty} onClick={()=>go(3)}>Review corrections<Icon name="arrow" size={18}/></button></div></section></div>
     <div hidden={c.step!==3}><ConfirmStep capture={c} onChange={update} previous={findPrevious(c,state.workspace.publications)} onBack={()=>go(2)} onNext={()=>update({...c,comparisonComplete:true,step:4})}/></div>
     <div hidden={c.step!==4}><div className="expert-tabs"><button onClick={()=>go(2)}><Icon name="book" size={16}/>Memory</button><button className="active"><Icon name="question" size={16}/>Expert questions</button></div><QuestionsStep capture={c} onChange={update} onDirtyChange={setQuestionDirty} onNext={()=>go(5)} onBack={()=>go(3)}/></div>
     <div hidden={c.step!==5}><FinishStep capture={c} onChange={update} publications={state.workspace.publications} onGenerate={generateScenarios} busy={pending} onTest={()=>dispatch({type:"testing",value:true})} onPublish={()=>dispatch({type:"publish",now:new Date().toISOString()})} onBack={()=>go(4)}/></div>
    </div>}</div>
   </main><footer className="workspace-footer"><span>Keep the experience. Pass on the confidence.</span><span>boomerang</span></footer>
  </div>
 </div>;
}
