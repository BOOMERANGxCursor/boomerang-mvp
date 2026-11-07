import { ApiError,authorize,errorResponse,normalizeFile,readBytes } from "@/lib/server";
export const runtime="nodejs";
export async function POST(request:Request){try{
 authorize(request,{access:process.env.DEMO_ACCESS_CODE,key:process.env.OPENAI_API_KEY||process.env.ELEVENLABS_API_KEY});
 const bytes=await readBytes(request,4_100_000);
 const data=await new Response(bytes,{headers:{"content-type":request.headers.get("content-type")??""}}).formData();
 const file=data.get("file");if(!(file instanceof File)||data.getAll("file").length!==1)throw new ApiError(400,"FILE_REQUIRED","Choose one file to read.");
 const output=await normalizeFile(file);
 if(output.text.length>10000)throw new ApiError(400,"TEXT_TOO_LONG","This file contains more than 10,000 characters. Split it into a shorter source.");
 return Response.json(output);
 }catch(error){return errorResponse(error);}}
