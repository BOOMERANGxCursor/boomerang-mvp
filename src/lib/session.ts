import type { Capture, DatasetId, ExtractionResult, Scenario, Workspace } from "./contracts";
import { createCapture, installDraft, publishMemory } from "./memory";

export type Pending = {token:string;captureId:string;revision:number};
export type SessionState = {workspace:Workspace;hydration:"loading"|"ready"|"recovery";pending:Pending|null;notice:string|null;temporary:boolean;testing:boolean};
export type SessionEvent =
 | {type:"hydrated";workspace:Workspace|null}|{type:"recovery"}|{type:"temporary"}
 | {type:"capture";capture:Capture}|{type:"newCapture";datasetId:DatasetId|null}|{type:"reset"}
 | {type:"begin";token:string}|{type:"draftResult";token:string;result:ExtractionResult}
 | {type:"scenarioResult";token:string;scenarios:Scenario[]}|{type:"failed";token:string;message:string}
 | {type:"notice";message:string|null}|{type:"testing";value:boolean}|{type:"publish";now:string};
export function createSession():SessionState {
 return {workspace:{schemaVersion:2,capture:createCapture(),publications:[]},hydration:"loading",pending:null,notice:null,temporary:false,testing:false};
}
function current(s:SessionState,token:string) {
 return s.pending?.token===token&&s.pending.captureId===s.workspace.capture.id&&s.pending.revision===s.workspace.capture.revision;
}
export function sessionReducer(state:SessionState,event:SessionEvent):SessionState {
 if(event.type==="hydrated")return {...state,workspace:event.workspace??state.workspace,hydration:"ready"};
 if(event.type==="recovery")return {...state,hydration:"recovery"};
 if(event.type==="reset")return state.hydration==="loading"?state:{...createSession(),hydration:"ready"};
 if(state.hydration!=="ready")return state;
 switch(event.type){
  case "temporary":return {...state,temporary:true};
  case "capture":return event.capture.id===state.workspace.capture.id?{...state,workspace:{...state.workspace,capture:event.capture},pending:null,notice:null}:state;
  case "newCapture":return {...state,workspace:{...state.workspace,capture:createCapture(event.datasetId)},pending:null,testing:false,notice:null};
  case "begin":return state.pending?state:{...state,pending:{token:event.token,captureId:state.workspace.capture.id,revision:state.workspace.capture.revision},notice:null};
  case "draftResult":return current(state,event.token)?{...state,workspace:{...state.workspace,capture:installDraft(state.workspace.capture,event.result)},pending:null}:state;
  case "scenarioResult":return current(state,event.token)?{...state,workspace:{...state.workspace,capture:{...state.workspace.capture,revision:state.workspace.capture.revision+1,scenarios:event.scenarios}},pending:null}:state;
  case "failed":return state.pending?.token===event.token?{...state,pending:null,notice:event.message}:state;
  case "notice":return {...state,notice:event.message};
  case "testing":return {...state,testing:event.value};
  case "publish": {
   if(state.workspace.publications.some(p=>p.captureId===state.workspace.capture.id&&p.revision===state.workspace.capture.revision))return {...state,notice:"This revision is already published."};
   try{return {...state,workspace:{...state.workspace,publications:[...state.workspace.publications,publishMemory(state.workspace.capture,state.workspace.publications,event.now)]},notice:"Your memory is published."};}
   catch(error){return {...state,notice:error instanceof Error?error.message:"Publication unavailable."};}
  }
 }
}
