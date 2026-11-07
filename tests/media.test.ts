import { expect,it } from "vitest";
import { recordingDuration } from "../src/lib/media-metadata";
import { normalizeFile } from "../src/lib/server";
function wav(seconds:number){const bytes=new Uint8Array(44+seconds*16000),v=new DataView(bytes.buffer);const t=(at:number,s:string)=>bytes.set(new TextEncoder().encode(s),at);t(0,"RIFF");v.setUint32(4,bytes.length-8,true);t(8,"WAVEfmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,16000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);t(36,"data");v.setUint32(40,seconds*16000,true);return bytes;}
it("reads recording duration from media bytes",()=>{expect(recordingDuration(wav(30),"recording.wav")).toBe(30);});
it("rejects long recordings before any provider call, even without word timestamps",async()=>{
 await expect(normalizeFile(new File([wav(61)],"recording.wav"))).rejects.toMatchObject({status:400,code:"RECORDING_TOO_LONG"});
});
it("rejects unverifiable duration rather than treating it as a short recording",()=>{
 expect(()=>recordingDuration(new Uint8Array([1,2,3]),"recording.mp4")).toThrow(/duration/i);
});
it("reads a standard MP4 movie time scale rather than speech timestamps",()=>{
 const bytes=new Uint8Array(36),v=new DataView(bytes.buffer);v.setUint32(0,36);bytes.set(new TextEncoder().encode("moov"),4);v.setUint32(8,28);bytes.set(new TextEncoder().encode("mvhd"),12);v.setUint32(28,1000);v.setUint32(32,45000);
 expect(recordingDuration(bytes,"clip.mp4")).toBe(45);
});
it("counts MPEG audio frames for MP3 duration",()=>{
 const frame=new Uint8Array(417);frame.set([255,251,144,0]);const bytes=new Uint8Array(417*100);for(let i=0;i<100;i++)bytes.set(frame,i*417);
 expect(recordingDuration(bytes,"clip.mp3")).toBeCloseTo(100*1152/44100,5);
});
