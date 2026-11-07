import type { Capture, DatasetId, ExtractionResult, Profile, Rule, Scenario, SourceSegment } from "./contracts";
type Dataset = {label:string; profile:Profile; sources:SourceSegment[]; rules:Rule[]; question:string; scenarios:Scenario[]};
export const datasets:Record<DatasetId,Dataset> = {
  "keller-elektro": {
    "label": "Keller Elektro",
    "profile": {
      "name": "Marta Keller",
      "organization": "Keller Elektro",
      "position": "Master electrician",
      "owner": "Jonas Keller",
      "experience": null
    },
    "sources": [
      {
        "id": "S1",
        "text": "At a customer workshop, when the lights keep going out and the labelled main breaker has tripped, I see a new portable machine on the same labelled circuit. I unplug that machine and check that the breaker is cold and undamaged before I reset anything. I check that visible cause first so we do not open the panel or change other circuits and hide the cause. If I smell burning, the breaker is warm, or the labels do not match the room, I stop and call the utility emergency line. I know it worked when the lights stay on after the extra machine is on another labelled circuit.",
        "author": "Marta Keller",
        "name": "Example handover 1",
        "kind": "text"
      },
      {
        "id": "S2",
        "text": "If the labelled breaker stays on but one labelled machine is dead, I check that machine's own labelled isolator before touching house wiring. If the isolator is already on, or the cable is damaged, I stop and call Jonas.",
        "author": "Marta Keller",
        "name": "Example handover 2",
        "kind": "text"
      }
    ],
    "rules": [
      {
        "id": "R1",
        "situation": "Lights keep going out and the labelled main breaker has tripped",
        "conditions": [
          "A new portable machine is on the same labelled circuit. There is no burning smell. The breaker is cold and undamaged. The labels match the room."
        ],
        "action": "Unplug that machine and check that the breaker is cold and undamaged before resetting anything.",
        "rationale": "Check the visible cause first so the panel is not opened and other circuits are not changed.",
        "exceptions": [
          "Stop and call the utility emergency line if there is a burning smell, the breaker is warm, or the labels do not match the room."
        ],
        "evidence": [
          {
            "sourceId": "S1",
            "quote": "At a customer workshop, when the lights keep going out and the labelled main breaker has tripped, I see a new portable machine on the same labelled circuit. I unplug that machine and check that the breaker is cold and undamaged before I reset anything. I check that visible cause first so we do not open the panel or change other circuits and hide the cause. If I smell burning, the breaker is warm, or the labels do not match the room, I stop and call the utility emergency line. I know it worked when the lights stay on after the extra machine is on another labelled circuit."
          }
        ]
      },
      {
        "id": "R2",
        "situation": "The labelled breaker stays on, but one labelled machine is dead",
        "conditions": [
          "No burning smell and no damaged cable reported"
        ],
        "action": "Check that machine's own labelled isolator before touching house wiring.",
        "rationale": "Check the machine's own labelled control first so house wiring is left unchanged.",
        "exceptions": [
          "Stop and call Jonas if the isolator is already on, or the cable is damaged."
        ],
        "evidence": [
          {
            "sourceId": "S2",
            "quote": "If the labelled breaker stays on but one labelled machine is dead, I check that machine's own labelled isolator before touching house wiring. If the isolator is already on, or the cable is damaged, I stop and call Jonas."
          }
        ]
      }
    ],
    "question": "At Keller Elektro, when the labelled breaker stays on but one machine is dead, what do you check, why, and when do you stop or escalate?",
    "scenarios": [
      {
        "id": "C1",
        "title": "Lights out, labelled breaker tripped",
        "facts": [
          "Lights out",
          "Labelled breaker tripped",
          "No burning smell"
        ],
        "options": [
          {
            "id": "C1-A",
            "label": "Unplug the newly added machine and check the breaker"
          },
          {
            "id": "C1-B",
            "label": "Replace the breaker"
          },
          {
            "id": "C1-C",
            "label": "Wait for the lights to return"
          }
        ],
        "correctOptionId": "C1-A",
        "ruleId": null,
        "approved": false
      },
      {
        "id": "C2",
        "title": "Breaker on, one machine dead",
        "facts": [
          "Breaker stays on",
          "One labelled machine is dead",
          "No hazard reported"
        ],
        "options": [
          {
            "id": "C2-A",
            "label": "Check the session log"
          },
          {
            "id": "C2-B",
            "label": "Check the machine's labelled isolator"
          },
          {
            "id": "C2-C",
            "label": "Wait without checking"
          }
        ],
        "correctOptionId": "C2-B",
        "ruleId": null,
        "approved": false
      }
    ]
  },
  "nordform": {
    "label": "Nordform GmbH",
    "profile": {
      "name": "Helmut Kruse",
      "organization": "Nordform GmbH",
      "position": "Press-brake setter",
      "owner": "Anja Berger",
      "experience": null
    },
    "sources": [
      {
        "id": "S1",
        "text": "At Nordform, when a repeat customer part comes off the brake with the wrong angle, I check the labelled tool in the machine against the last approved setup sheet, and the material grade printed on the job card, before anyone edits the program. I check the sheet first so a wrong tool is not saved as a new program. If the guard is open, the grade is not on the card, or the tool code does not match the sheet, I stop and call Anja. I know it worked when the next part matches the angle on the approved sheet.",
        "author": "Helmut Kruse",
        "name": "Example handover 1",
        "kind": "text"
      },
      {
        "id": "S2",
        "text": "If the tool and the material grade match the approved sheet but the angle is still wrong, I check whether the labelled back-gauge position on the sheet was actually set. I do not change the program during the run. If the gauge already matches the sheet, I stop and call Anja.",
        "author": "Helmut Kruse",
        "name": "Example handover 2",
        "kind": "text"
      }
    ],
    "rules": [
      {
        "id": "R1",
        "situation": "A repeat customer part comes off the brake with the wrong angle",
        "conditions": [
          "The guard is closed. The material grade on the job card matches the sheet."
        ],
        "action": "Check the labelled tool in the machine against the last approved setup sheet before anyone edits the program.",
        "rationale": "Check the sheet first so a wrong tool is not saved as a new program.",
        "exceptions": [
          "Stop and call Anja if the guard is open, the grade is not on the card, or the tool code does not match the sheet."
        ],
        "evidence": [
          {
            "sourceId": "S1",
            "quote": "At Nordform, when a repeat customer part comes off the brake with the wrong angle, I check the labelled tool in the machine against the last approved setup sheet, and the material grade printed on the job card, before anyone edits the program. I check the sheet first so a wrong tool is not saved as a new program. If the guard is open, the grade is not on the card, or the tool code does not match the sheet, I stop and call Anja. I know it worked when the next part matches the angle on the approved sheet."
          }
        ]
      },
      {
        "id": "R2",
        "situation": "The tool and the material grade match the approved sheet, but the angle is still wrong",
        "conditions": [
          "The guard is closed. The program has not been edited during this run."
        ],
        "action": "Check whether the labelled back-gauge position on the sheet was actually set.",
        "rationale": "Check the labelled gauge before changing the program, so a matching setup is not overwritten during the run.",
        "exceptions": [
          "Stop and call Anja if the gauge already matches the sheet. Do not change the program during the run."
        ],
        "evidence": [
          {
            "sourceId": "S2",
            "quote": "If the tool and the material grade match the approved sheet but the angle is still wrong, I check whether the labelled back-gauge position on the sheet was actually set. I do not change the program during the run. If the gauge already matches the sheet, I stop and call Anja."
          }
        ]
      }
    ],
    "question": "At Nordform, when the tool and the material grade match the approved sheet but the angle is still wrong, what do you check, why, and when do you stop or escalate?",
    "scenarios": [
      {
        "id": "C1",
        "title": "Wrong angle, tool code differs from the sheet",
        "facts": [
          "Part angle is wrong",
          "Tool code differs from the approved setup sheet",
          "Guard is closed",
          "Material grade matches the job card"
        ],
        "options": [
          {
            "id": "C1-A",
            "label": "Check the tool against the approved setup sheet"
          },
          {
            "id": "C1-B",
            "label": "Edit the bend program"
          },
          {
            "id": "C1-C",
            "label": "Wait for the next part"
          }
        ],
        "correctOptionId": "C1-A",
        "ruleId": null,
        "approved": false
      },
      {
        "id": "C2",
        "title": "Tool and grade match, angle still wrong",
        "facts": [
          "Tool code matches the approved setup sheet",
          "Material grade matches the job card",
          "Part angle is still wrong",
          "Guard is closed"
        ],
        "options": [
          {
            "id": "C2-A",
            "label": "Edit the bend program"
          },
          {
            "id": "C2-B",
            "label": "Check the labelled back-gauge against the sheet"
          },
          {
            "id": "C2-C",
            "label": "Wait without checking"
          }
        ],
        "correctOptionId": "C2-B",
        "ruleId": null,
        "approved": false
      }
    ]
  }
};

export function exampleDraft(capture:Capture):ExtractionResult {
  if (!capture.datasetId) throw new Error("Choose an example first.");
  const data = datasets[capture.datasetId];
  const active = data.rules.filter(rule=>rule.evidence.every(e=>capture.sources.some(s=>s.id===e.sourceId && s.text===data.sources.find(x=>x.id===e.sourceId)?.text)));
  if (!active.length) throw new Error("The example text changed. Use live extraction for your own material.");
  return structuredClone({origin:"example",rules:active,questions:[data.question]});
}
