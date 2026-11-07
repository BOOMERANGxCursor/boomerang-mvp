// Read bounded container metadata before paid transcription. Unknown/streaming
// durations are rejected rather than trusting browser-supplied duration values.
export function recordingDuration(bytes:Uint8Array,name:string):number {
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const ascii=(at:number,len:number)=>new TextDecoder("latin1").decode(bytes.subarray(at,at+len));
 const ext=name.split(".").at(-1)?.toLowerCase();let seconds=0;
 try{
  if(ext==="wav"){
   let rate=0,size=0;
   for(let i=12;i+8<=bytes.length;){const type=ascii(i,4),length=view.getUint32(i+4,true);if(i+8+length>bytes.length)throw new Error();if(type==="fmt "&&length>=16)rate=view.getUint32(i+16,true);if(type==="data")size+=length;i+=8+length+(length%2);}
   seconds=size/rate;
  }else if(ext==="mp4"||ext==="m4a"){
   function atoms(start:number,end:number,depth:number){
    if(depth>6)return;
    for(let i=start;i+8<=end;){let size=view.getUint32(i);const type=ascii(i+4,4);let header=8;
     if(size===1){size=Number(view.getBigUint64(i+8));header=16;}if(size===0)size=end-i;
     if(size<header||!Number.isSafeInteger(size)||i+size>end)break;const p=i+header;
     if(["moov","trak","mdia"].includes(type))atoms(p,i+size,depth+1);
     if((type==="mvhd"||type==="mdhd")&&size>=header+20){const v=bytes[p],rate=view.getUint32(p+(v===1?20:12));const duration=v===1?Number(view.getBigUint64(p+24)):view.getUint32(p+16);if(rate&&Number.isSafeInteger(duration))seconds=Math.max(seconds,duration/rate);}
     i+=size;
    }
   }atoms(0,bytes.length,0);
  }else if(ext==="webm"){
   let scale=1_000_000,duration=0;
   function vint(at:number,id:boolean){let width=1,mask=128;while(width<=8&&!(bytes[at]&mask)){width++;mask>>=1;}if(width>8||at+width>bytes.length)throw new Error();let value=id?bytes[at]:bytes[at]&(mask-1);let unknown=!id&&value===mask-1;for(let k=1;k<width;k++){value=value*256+bytes[at+k];unknown=unknown&&bytes[at+k]===255;}return {width,value,unknown};}
   function elements(start:number,end:number,depth:number){if(depth>5)return;for(let at=start;at<end;){const id=vint(at,true),size=vint(at+id.width,false),p=at+id.width+size.width,stop=size.unknown?end:p+size.value;if(stop>end||stop<=at)break;
     if(id.value===0x18538067||id.value===0x1549a966)elements(p,stop,depth+1);
     if(id.value===0x2ad7b1){scale=0;for(let n=p;n<stop;n++)scale=scale*256+bytes[n];}
     if(id.value===0x4489){if(size.value===8)duration=view.getFloat64(p);else if(size.value===4)duration=view.getFloat32(p);}
     at=stop;
    }}elements(0,bytes.length,0);seconds=duration*scale/1e9;
  }else if(ext==="mp3"){
   let at=0,frames=0;
   if(ascii(0,3)==="ID3")at=10+((bytes[6]&127)*2097152+(bytes[7]&127)*16384+(bytes[8]&127)*128+(bytes[9]&127))+((bytes[5]&16)?10:0);
   const mpeg1=[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320],mpeg2=[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160];
   while(at+4<=bytes.length){const h=view.getUint32(at),version=(h>>>19)&3,layer=(h>>>17)&3,index=(h>>>12)&15,sample=(h>>>10)&3;
    if((h>>>21)!==2047||version===1||layer!==1||!index||index===15||sample===3){if(frames)break;at++;continue;}
    const rate=[44100,48000,32000][sample]/(version===3?1:version===2?2:4),bitrate=(version===3?mpeg1:mpeg2)[index]*1000;
    const length=Math.floor((version===3?144:72)*bitrate/rate)+((h>>>9)&1);if(at+length>bytes.length)break;
    seconds+=(version===3?1152:576)/rate;frames++;at+=length;
   }
  }else if(ext==="ogg"){
   let rate=0,preSkip=0,granule=0;
   for(let at=0;at+27<=bytes.length;){if(ascii(at,4)!=="OggS")throw new Error();const n=bytes[at+26],payload=at+27+n;if(payload>bytes.length)throw new Error();let size=0;for(let j=0;j<n;j++)size+=bytes[at+27+j];if(payload+size>bytes.length)throw new Error();
    const g=view.getBigUint64(at+6,true);if(g!==0xffffffffffffffffn&&g<=BigInt(Number.MAX_SAFE_INTEGER))granule=Math.max(granule,Number(g));
    if(ascii(payload,8)==="OpusHead"){rate=48000;preSkip=view.getUint16(payload+10,true);}else if(bytes[payload]===1&&ascii(payload+1,6)==="vorbis")rate=view.getUint32(payload+12,true);
    at=payload+size;
   }seconds=(granule-preSkip)/rate;
  }
 }catch{seconds=0;}
 if(!Number.isFinite(seconds)||seconds<=0)throw new Error("The recording duration could not be verified. Export a standard recording with duration metadata, or paste a transcript.");
 return seconds;
}
