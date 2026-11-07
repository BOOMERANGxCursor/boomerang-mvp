import { z } from "zod";

const text = z.string().refine(value => value.trim().length > 0, "Must not be blank");
const id = text;
const version = z.number().int().positive();
const unique = <T extends { id: string }>(items: T[]) => new Set(items.map(item => item.id)).size === items.length;

export const SourceSegmentSchema = z.object({ id, text, author: text }).strict();
export const EvidenceSchema = z.object({ sourceId: id, quote: text }).strict();
export const RuleSchema = z.object({
  id, situation: text, conditions: z.array(text), action: text,
  rationale: text.nullable(), exceptions: z.array(text), evidence: z.array(EvidenceSchema).min(1),
}).strict();
export const CaseLinkSchema = z.object({ caseId: id, ruleId: id, reviewer: text }).strict();
export const DraftSchema = z.object({
  id, revision: z.number().int().nonnegative(), baseVersion: z.number().int().nonnegative(),
  rules: z.array(RuleSchema).refine(unique, "Duplicate rule IDs"),
  approvedRuleIds: z.array(id), caseLinks: z.array(CaseLinkSchema),
}).strict();
export const KnowledgeVersionSchema = z.object({
  version, sources: z.array(SourceSegmentSchema).refine(unique, "Duplicate source IDs"),
  rules: z.array(RuleSchema).min(1).refine(unique, "Duplicate rule IDs"),
  caseLinks: z.array(CaseLinkSchema), approvedBy: text, approvedAt: z.iso.datetime(), contentOwner: text,
}).strict();
export const ScenarioSchema = z.object({
  id, title: text, facts: z.array(text).min(1),
  options: z.array(z.object({ id, label: text }).strict()).min(1).refine(unique, "Duplicate option IDs"),
  correctOptionId: id,
}).strict().refine(s => s.options.some(o => o.id === s.correctOptionId), "Unknown correct option");
export const AttemptSchema = z.object({
  id, scenarioId: id, knowledgeVersion: version, selectedOptionId: id.nullable(),
  outcome: z.enum(["correct", "incorrect", "gap"]), ruleId: id.nullable(),
}).strict();
export const GapSchema = z.object({
  id, scenarioId: id, fromVersion: version, question: text, owner: text,
  status: z.enum(["open", "closed"]), resolvedVersion: version.nullable(),
}).strict();
export const SessionBundleSchema = z.object({
  schemaVersion: z.literal(1), mode: z.enum(["live", "fixture"]),
  sources: z.array(SourceSegmentSchema).refine(unique, "Duplicate source IDs"),
  draft: DraftSchema.nullable(), versions: z.array(KnowledgeVersionSchema),
  attempts: z.array(AttemptSchema).refine(unique, "Duplicate attempt IDs"),
  gaps: z.array(GapSchema).refine(unique, "Duplicate gap IDs"),
}).strict();
export const ExtractionResultSchema = z.object({
  rules: z.array(RuleSchema).max(6).refine(unique, "Duplicate rule IDs"), questions: z.array(text).max(3),
}).strict();

export type SourceSegment = z.infer<typeof SourceSegmentSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type CaseLink = z.infer<typeof CaseLinkSchema>;
export type Draft = z.infer<typeof DraftSchema>;
export type KnowledgeVersion = z.infer<typeof KnowledgeVersionSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Attempt = z.infer<typeof AttemptSchema>;
export type Gap = z.infer<typeof GapSchema>;
export type SessionBundle = z.infer<typeof SessionBundleSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;
