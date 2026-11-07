import { authorize, errorResponse, extractFromSources, readJson } from "@/lib/server";
import { z } from "zod";
export const runtime="nodejs";
export async function POST(request:Request){try{authorize(request);const body=z.object({sources:z.unknown()}).strict().parse(await readJson(request));return Response.json(await extractFromSources(body.sources));}catch(error){return errorResponse(error);}}
