# Nordform GmbH

Fictional training example. It stays at the same decision level as the microphone handover: check a labelled, visible control first, and stop and call a named person when the situation is unsafe or unfamiliar. It contains no measurements, settings or repair steps.

## Company and who is leaving

Nordform GmbH is a sheet-metal workshop of about 40 people. Press-brake setter Helmut Kruse retires. He is the person who decides what to check before anyone edits a bend program. Anja Berger, production lead, owns the guidance after he leaves. Lea Hoffmann is the new setter who will practise the published cases.

## Capture fields

**Expert name:** Helmut Kruse

**Continuing content owner:** Anja Berger

## S1 incident notes

Paste this block into Incident notes.

> At Nordform, when a repeat customer part comes off the brake with the wrong angle, I check the labelled tool in the machine against the last approved setup sheet, and the material grade printed on the job card, before anyone edits the program. I check the sheet first so a wrong tool is not saved as a new program. If the guard is open, the grade is not on the card, or the tool code does not match the sheet, I stop and call Anja. I know it worked when the next part matches the angle on the approved sheet.

## Expected review card for S1

Human-authored target for the reviewer. This is not model output. Approve it only if it follows from the S1 quotation.

| Field | Text |
| --- | --- |
| Situation | A repeat customer part comes off the brake with the wrong angle |
| Conditions | The guard is closed. The material grade on the job card matches the sheet. |
| Action | Check the labelled tool in the machine against the last approved setup sheet before anyone edits the program. |
| Rationale | Check the sheet first so a wrong tool is not saved as a new program. |
| Exceptions | Stop and call Anja if the guard is open, the grade is not on the card, or the tool code does not match the sheet. |

## C1 practice

Supported by S1.

**Title:** Wrong angle, tool code differs from the sheet

**Facts:**

- Part angle is wrong
- Tool code differs from the approved setup sheet
- Guard is closed
- Material grade matches the job card

**Options, in display order:**

| ID | Label |
| --- | --- |
| C1-A | Check the tool against the approved setup sheet |
| C1-B | Edit the bend program |
| C1-C | Wait for the next part |

**Correct option:** C1-A

## S2 reply

Enter this block only when C2 comes back as an open expert question. It is a new source. It does not replace S1.

> If the tool and the material grade match the approved sheet but the angle is still wrong, I check whether the labelled back-gauge position on the sheet was actually set. I do not change the program during the run. If the gauge already matches the sheet, I stop and call Anja.

Human-authored target for the S2 review card:

| Field | Text |
| --- | --- |
| Situation | The tool and the material grade match the approved sheet, but the angle is still wrong |
| Conditions | The guard is closed. The program has not been edited during this run. |
| Action | Check whether the labelled back-gauge position on the sheet was actually set. |
| Rationale | Check the labelled gauge before changing the program, so a matching setup is not overwritten during the run. |
| Exceptions | Stop and call Anja if the gauge already matches the sheet. Do not change the program during the run. |

## C2 practice

Supported only by S2. Leave it unlinked while v1 contains only S1.

**Title:** Tool and grade match, angle still wrong

**Facts:**

- Tool code matches the approved setup sheet
- Material grade matches the job card
- Part angle is still wrong
- Guard is closed

**Options, in display order:**

| ID | Label |
| --- | --- |
| C2-A | Edit the bend program |
| C2-B | Check the labelled back-gauge against the sheet |
| C2-C | Wait without checking |

**Correct option:** C2-B

## G1 question

> At Nordform, when the tool and the material grade match the approved sheet but the angle is still wrong, what do you check, why, and when do you stop or escalate?
