import { useCallback,useEffect,useRef,useState } from "react";
import type { Capture, SourceSegment } from "@/lib/contracts";
import { changed,ownMaterial } from "@/lib/memory";
import { ACCEPTED_FILES } from "@/lib/uploads";
import { Icon } from "./Icon";
export type FileRow={id:string;file:File;status:"queued"|"reading"|"done"|"error";error?:string};
export function UploadStep({capture,onChange,onFiles,rows,busy,onNext,onBack,onRemoveRow}:{capture:Capture;onChange:(c:Capture)=>void;onFiles:(files:File[])=>void;rows:FileRow[];busy:boolean;onNext:()=>void;onBack:()=>void;onRemoveRow:(id:string)=>void}){
 const input=useRef<HTMLInputElement>(null);const [dragging,setDragging]=useState(false),[paste,setPaste]=useState(false),[text,setText]=useState("");
 const [dirty,setDirty]=useState<Record<string,boolean>>({});
 const reportDirty=useCallback((id:string,value:boolean)=>setDirty(old=>old[id]===value?old:{...old,[id]:value}),[]);
 const sources=capture.sources.filter(s=>s.active!==false); const total=sources.reduce((n,s)=>n+s.text.length,0);
 function addText(){if(!text.trim())return;if(capture.datasetId&&!window.confirm("Replace the prepared example with your own notes? The example draft will be cleared; published memories are kept."))return;const next=changed(ownMaterial(capture));next.sources.push({id:crypto.randomUUID(),text:text.trim(),author:capture.profile.name,name:"Pasted notes",kind:"text"});onChange(next);setText("");setPaste(false);}
 return <section className="step-surface" aria-labelledby="sources-heading">
  <div className="page-heading"><h1 id="sources-heading">Good knowledge comes<br/><span>in all kinds of files.</span></h1><p>Notes, conversations, documents. Add what you have—we’ll help you find the skills inside.</p></div>
  <div className={`dropzone ${dragging?"dragging":""}`} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);if(!busy)onFiles(Array.from(e.dataTransfer.files));}}>
   <div className="upload-glyph"><Icon name="upload" size={26}/></div><h2>Drop your knowledge here</h2><p>or choose files from your device</p>
   <button className="primary small" disabled={busy} onClick={()=>input.current?.click()}>Browse files<Icon name="plus" size={16}/></button>
   <input ref={input} type="file" multiple accept={ACCEPTED_FILES} className="visually-hidden" aria-label="Choose knowledge files" disabled={busy} onChange={e=>{onFiles(Array.from(e.target.files??[]));e.target.value="";}}/>
   <p className="upload-limits">Documents, images, audio & video · Up to 4 MB per file<br/>Recordings up to 60 seconds · Video speech only</p>
  </div>
  <div className="source-alternatives"><span>Prefer to write it down?</span><button className="text-button" onClick={()=>setPaste(!paste)} disabled={busy}><Icon name="plus" size={16}/>Paste or type notes</button></div>
  {paste&&<div className="inline-editor"><label htmlFor="pasted-notes">Your notes</label><textarea id="pasted-notes" rows={5} value={text} onChange={e=>setText(e.target.value)} placeholder="Describe a situation, what you do, and when you stop or ask for help."/><div className="row-end"><button className="secondary small" onClick={()=>setPaste(false)}>Cancel</button><button className="primary small" disabled={!text.trim()} onClick={addText}>Add notes</button></div></div>}
  {!!rows.filter(r=>r.status!=="done").length&&<div className="file-queue" aria-live="polite">{rows.filter(r=>r.status!=="done").map(r=><div className="file-row" key={r.id}><Icon name="file"/><div className="file-copy"><strong>{r.file.name}</strong><p className={r.status==="error"?"error-text":"quiet"}>{r.error??(r.status==="reading"?"Reading your file…":"Waiting to be read")}</p></div>{r.status==="error"&&<><button className="text-button" disabled={busy} onClick={()=>onFiles([r.file])}>Retry</button><button className="text-button" aria-label={`Remove ${r.file.name}`} disabled={busy} onClick={()=>onRemoveRow(r.id)}><Icon name="close" size={16}/></button></>}</div>)}</div>}
  {!!sources.length&&<div className="sources-list"><div className="section-label"><h2>Your sources</h2><span>{sources.length} of 6 · {total.toLocaleString()} characters</span></div>{sources.map(source=><SourcePreview key={source.id} source={source} capture={capture} onChange={onChange} busy={busy} reportDirty={reportDirty}/>)}</div>}
  {total>10000&&<p className="error-text">Keep the active source text under 10,000 characters. Shorten or remove a source before continuing.</p>}
  <div className="step-actions"><button className="back-button" onClick={onBack} disabled={busy}><Icon name="back" size={17}/>Back</button><button className="primary" disabled={busy||!sources.length||sources.length>6||total>10000||Object.values(dirty).some(Boolean)||(paste&&!!text.trim())} onClick={onNext}>{busy?"Finding the skills…":"Build my draft"}<Icon name={busy?"spark":"arrow"} size={18}/></button></div>
 </section>;
}
function SourcePreview({source,capture,onChange,busy,reportDirty}:{source:SourceSegment;capture:Capture;onChange:(c:Capture)=>void;busy:boolean;reportDirty:(id:string,dirty:boolean)=>void}){
 const [text,setText]=useState(source.text);const modified=text!==source.text;
 useEffect(()=>{reportDirty(source.id,modified);return()=>reportDirty(source.id,false);},[source.id,modified,reportDirty]);
 function save(){if(capture.datasetId&&!window.confirm("Use this edited text as your own material? The prepared example draft will be cleared."))return;const next=changed(ownMaterial(capture));next.sources=next.sources.map(s=>s.id===source.id?{...s,active:false}:s);next.sources.push({...source,id:crypto.randomUUID(),text,active:true,name:`${source.name??"Notes"} (corrected)`});onChange(next);}
 return <details className="source-preview"><summary><span className="file-symbol"><Icon name={source.kind==="audio"?"audio":source.kind==="video"?"video":source.kind==="image"?"image":"file"}/></span><span className="source-title"><strong>{source.name??"Source notes"}</strong><small>{source.kind??"text"} · {source.text.length.toLocaleString()} characters</small></span><span className="read-status"><Icon name="check" size={14}/>{source.warnings?.length?"Check text":"Ready"}</span><Icon name="chevron" size={16}/></summary>
  <div className="source-body">{!!source.warnings?.length&&<p className="source-warning">{source.warnings.join(" ")}</p>}<label>Check the readable text<textarea rows={6} value={text} disabled={busy} onChange={e=>setText(e.target.value)}/></label><p className="field-help">Correct anything that was misread before building the draft.</p><div className="row-between"><button className="text-button danger" disabled={busy} onClick={()=>{const next=changed(capture);next.sources=next.sources.map(s=>s.id===source.id?{...s,active:false}:s);onChange(next);}}><Icon name="trash" size={15}/>Remove source</button>{modified&&<button className="secondary small" disabled={!text.trim()||busy} onClick={save}>Save corrected text</button>}</div></div>
 </details>;
}
