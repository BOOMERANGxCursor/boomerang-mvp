import { ExtractionResultSchema, ScenarioSchema, SessionBundleSchema, type SourceSegment, type SessionBundle } from "./contracts";

export const sourceS1: SourceSegment = {
  id: "S1", author: "Alex",
  text: "At Demo Hall, when the presenter cannot be heard and the receiver shows no input, I check whether the handheld microphone is powered and unmuted. I check the simple visible controls first so we don't change unrelated mixer settings. If I smell burning, see damaged equipment, or cannot identify the setup, I stop and call the duty technician.",
};

// Replay material is deliberately separate from the initial bundle and adapter.
export const sourceS2: SourceSegment = {
  id: "S2", author: "Alex",
  text: "If the receiver shows input but the room has no sound, I check the labelled channel's mute indicator. I do not change unfamiliar routing during a live session; I call the duty technician.",
};

export const scenarios = [
  ScenarioSchema.parse({
    id: "C1", title: "Presenter silent, receiver has no input",
    facts: ["Presenter silent", "Receiver has no input", "No hazard reported"],
    options: [
      { id: "C1-A", label: "Check visible microphone power/mute" },
      { id: "C1-B", label: "Check session agenda" },
      { id: "C1-C", label: "Wait without checking" },
    ], correctOptionId: "C1-A",
  }),
  ScenarioSchema.parse({
    id: "C2", title: "Receiver shows input, room silent",
    facts: ["Receiver shows input", "Room silent", "No hazard reported"],
    options: [
      { id: "C2-A", label: "Check session agenda" },
      { id: "C2-B", label: "Check labelled channel mute indicator" },
      { id: "C2-C", label: "Wait without checking" },
    ], correctOptionId: "C2-B",
  }),
];

export function createInitialBundle(mode: SessionBundle["mode"] = "fixture"): SessionBundle {
  return SessionBundleSchema.parse({
    schemaVersion: 1, mode, sources: [{ ...sourceS1 }],
    draft: null, versions: [], attempts: [], gaps: [],
  });
}

export function fixtureExtraction(sources: readonly SourceSegment[]) {
  if (sources.length !== 1 || sources[0].id !== "S1" || sources[0].text !== sourceS1.text) {
    throw new Error("Fixture replay supports only the unchanged S1 demo incident.");
  }
  return ExtractionResultSchema.parse({
    rules: [{
      id: "R1", situation: "Presenter cannot be heard and the receiver shows no input",
      conditions: ["Receiver shows no input"],
      action: "Check whether the handheld microphone is powered and unmuted.",
      rationale: "Check simple visible controls first so unrelated mixer settings are not changed.",
      exceptions: ["Stop and call the duty technician if there is a burning smell, damaged equipment, or an unidentified setup."],
      evidence: [{ sourceId: "S1", quote: sourceS1.text }],
    }], questions: [],
  });
}
