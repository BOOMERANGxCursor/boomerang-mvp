import { authorize,errorResponse,proposeScenarios,readJson } from "@/lib/server";
import { RuleSchema,SourceSegmentSchema } from "@/lib/contracts";
import { z } from "zod";
export const runtime="nodejs";
export async function POST(request:Request){try{authorize(request);const body=z.object({rules:z.array(RuleSchema),sources:z.array(SourceSegmentSchema)}).strict().parse(await readJson(request));return Response.json({scenarios:await proposeScenarios(body)});}catch(error){return errorResponse(error);}}
