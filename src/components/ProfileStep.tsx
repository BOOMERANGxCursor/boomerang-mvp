import { useState } from "react";
import type { Capture,Profile } from "@/lib/contracts";
import { changed } from "@/lib/memory";
import { Icon } from "./Icon";
export function ProfileStep({capture,onChange,onNext}:{capture:Capture;onChange:(c:Capture)=>void;onNext:()=>void}){
 const [submitted,setSubmitted]=useState(false);const p=capture.profile;const [experienceText,setExperienceText]=useState(p.experience===null?"":String(p.experience));
 const experienceValid=experienceText===""||(Number.isFinite(Number(experienceText))&&Number(experienceText)>=0&&Number(experienceText)<=100);
 const update=(key:keyof Profile,value:string)=>{const next=changed(capture);next.profile={...p,[key]:key==="experience"?(value===""?null:Number(value)):value};next.comparisonComplete=false;onChange(next);};
 const required=(key:"name"|"position"|"organization"|"owner")=>submitted&&!p[key].trim();
 const valid=!!(p.name.trim()&&p.position.trim()&&p.organization.trim()&&p.owner.trim())&&experienceValid;
 return <section className="profile-step step-surface" aria-labelledby="profile-heading">
  <div className="page-heading"><h1 id="profile-heading">Your experience.<br/><span>Their head start.</span></h1><p>Let’s make sure the knowledge you’ve built stays with the people who need it. First, a little about you.</p></div>
  <form onSubmit={e=>{e.preventDefault();setSubmitted(true);if(valid)onNext();}} noValidate>
   <div className="form-grid">
    <label className={required("name")?"invalid":""}>Full name <span aria-hidden="true">*</span><input autoComplete="name" placeholder="Your first and last name" value={p.name} aria-invalid={required("name")} onChange={e=>update("name",e.target.value)}/>{required("name")&&<small className="field-error">Enter your name.</small>}</label>
    <label className={required("position")?"invalid":""}>Position <span aria-hidden="true">*</span><input autoComplete="organization-title" placeholder="e.g. Production lead" value={p.position} aria-invalid={required("position")} onChange={e=>update("position",e.target.value)}/>{required("position")&&<small className="field-error">Enter your position.</small>}</label>
    <label className={required("organization")?"invalid":""}>Organization or team <span aria-hidden="true">*</span><input autoComplete="organization" placeholder="Where your knowledge belongs" value={p.organization} aria-invalid={required("organization")} onChange={e=>update("organization",e.target.value)}/>{required("organization")&&<small className="field-error">Enter your organization or team.</small>}</label>
    <label>Years of experience <span className="optional">Optional</span><input type="number" min="0" max="100" inputMode="numeric" placeholder="e.g. 24" value={experienceText} aria-invalid={submitted&&!experienceValid} onChange={e=>{const value=e.target.value;setExperienceText(value);if(value===""||Number.isFinite(Number(value))&&Number(value)>=0&&Number(value)<=100)update("experience",value);}}/>{submitted&&!experienceValid&&<small className="field-error">Use a number from 0 to 100, or leave this blank.</small>}</label>
   </div>
   <div className="owner-field"><label className={required("owner")?"invalid":""}>Who will look after this knowledge? <span aria-hidden="true">*</span><input placeholder="A colleague or team who will keep it up to date" value={p.owner} aria-invalid={required("owner")} onChange={e=>update("owner",e.target.value)}/>{required("owner")&&<small className="field-error">Name a continuing knowledge owner.</small>}</label><p className="field-help">They’ll be the point of contact when something changes or a question comes up.</p></div>
   <div className="step-actions"><p className="quiet inline-icon"><Icon name="shield" size={17}/>You decide what gets shared.</p><button type="submit" className="primary">Continue to sources<Icon name="arrow" size={18}/></button></div>
  </form>
 </section>;
}
