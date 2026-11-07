export type FileKind="text"|"document"|"image"|"audio"|"video";
const types:Record<string,FileKind>={txt:"text",md:"text",csv:"text",srt:"text",vtt:"text",pdf:"document",docx:"document",jpg:"image",jpeg:"image",png:"image",webp:"image",mp3:"audio",wav:"audio",m4a:"audio",ogg:"audio",mp4:"video",webm:"video"};
export const ACCEPTED_FILES=".txt,.md,.csv,.srt,.vtt,.pdf,.docx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.m4a,.ogg,.mp4,.webm";
export function fileKind(name:string,mime=""):FileKind {const ext=name.split(".").at(-1)!.toLowerCase();const kind=ext==="webm"&&mime.startsWith("audio/")?"audio":types[ext];if(!kind)throw new Error("This format is not supported. Use a document, image, recording or text file.");return kind;}
export function decodeText(bytes:Uint8Array):string {
 let text:string;try{text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}catch{throw new Error("This file is not readable UTF-8 text.");}
 if(text.includes("\0")||!text.trim())throw new Error("This file contains no readable text.");return text;
}
export function validateFile(name:string,bytes:Uint8Array,mime=""):FileKind {
 if(!bytes.length)throw new Error("This file is empty.");if(bytes.length>4_000_000)throw new Error("This file is too large. Maximum size is 4 MB.");
 const kind=fileKind(name,mime),ext=name.split(".").at(-1)!.toLowerCase(),head=new TextDecoder("latin1").decode(bytes.slice(0,16));
 const sig=(...prefix:number[])=>prefix.every((b,i)=>bytes[i]===b);
 const valid=kind==="text"?!!decodeText(bytes):ext==="pdf"?head.startsWith("%PDF-"):ext==="docx"?sig(80,75,3,4):["jpg","jpeg"].includes(ext)?sig(255,216,255):ext==="png"?sig(137,80,78,71,13,10,26,10):ext==="webp"?head.startsWith("RIFF")&&head.slice(8,12)==="WEBP":ext==="wav"?head.startsWith("RIFF")&&head.slice(8,12)==="WAVE":ext==="mp3"?head.startsWith("ID3")||(bytes[0]===255&&(bytes[1]&224)===224):["mp4","m4a"].includes(ext)?head.slice(4,8)==="ftyp":ext==="ogg"?head.startsWith("OggS"):ext==="webm"?sig(26,69,223,163):false;
 if(!valid)throw new Error("The contents do not match this file format. Export the original file and try again.");return kind;
}
export async function mediaDuration(file:File):Promise<number> {
 return new Promise((resolve,reject)=>{
  const media=document.createElement(file.type.startsWith("audio/")?"audio":"video"),url=URL.createObjectURL(file);
  const cleanup=()=>{clearTimeout(timer);media.removeAttribute("src");media.load();URL.revokeObjectURL(url);};
  const timer=setTimeout(()=>{cleanup();reject(new Error("Could not read the recording length. Try MP3, WAV, MP4 or WebM."));},5000);
  media.preload="metadata";media.onloadedmetadata=()=>{const n=media.duration;cleanup();Number.isFinite(n)&&n>0?resolve(n):reject(new Error("Could not read the recording length."));};
  media.onerror=()=>{cleanup();reject(new Error("This recording cannot be read. Try another supported format."));};media.src=url;
 });
}
