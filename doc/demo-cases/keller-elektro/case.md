# Keller Elektro

Fictional training example. It stays at the same decision level as the microphone handover: check a labelled, visible control first, and stop and call a named person when the situation is unsafe or unfamiliar. It contains no measurements, settings or repair steps.

## Company and who is leaving

Keller Elektro is a six-person electrical craft business. Master electrician Marta Keller retires on Friday. She is the person who decides what to check first on a customer call. Jonas Keller stays and owns the guidance after she leaves. Samir Novak is the newly hired journeyman who will practise the published cases.

## Capture fields

**Expert name:** Marta Keller

**Continuing content owner:** Jonas Keller

## S1 incident notes

Paste this block into Incident notes.

> At a customer workshop, when the lights keep going out and the labelled main breaker has tripped, I see a new portable machine on the same labelled circuit. I unplug that machine and check that the breaker is cold and undamaged before I reset anything. I check that visible cause first so we do not open the panel or change other circuits and hide the cause. If I smell burning, the breaker is warm, or the labels do not match the room, I stop and call the utility emergency line. I know it worked when the lights stay on after the extra machine is on another labelled circuit.

## Expected review card for S1

Human-authored target for the reviewer. This is not model output. Approve it only if it follows from the S1 quotation.

| Field | Text |
| --- | --- |
| Situation | Lights keep going out and the labelled main breaker has tripped |
| Conditions | A new portable machine is on the same labelled circuit. There is no burning smell. The breaker is cold and undamaged. The labels match the room. |
| Action | Unplug that machine and check that the breaker is cold and undamaged before resetting anything. |
| Rationale | Check the visible cause first so the panel is not opened and other circuits are not changed. |
| Exceptions | Stop and call the utility emergency line if there is a burning smell, the breaker is warm, or the labels do not match the room. |

## C1 practice

Supported by S1.

**Title:** Lights out, labelled breaker tripped

**Facts:**

- Lights out
- Labelled breaker tripped
- No burning smell

**Options, in display order:**

| ID | Label |
| --- | --- |
| C1-A | Unplug the newly added machine and check the breaker |
| C1-B | Replace the breaker |
| C1-C | Wait for the lights to return |

**Correct option:** C1-A

## S2 reply

Enter this block only when C2 comes back as an open expert question. It is a new source. It does not replace S1.

> If the labelled breaker stays on but one labelled machine is dead, I check that machine's own labelled isolator before touching house wiring. If the isolator is already on, or the cable is damaged, I stop and call Jonas.

Human-authored target for the S2 review card:

| Field | Text |
| --- | --- |
| Situation | The labelled breaker stays on, but one labelled machine is dead |
| Conditions | No burning smell and no damaged cable reported |
| Action | Check that machine's own labelled isolator before touching house wiring. |
| Rationale | Check the machine's own labelled control first so house wiring is left unchanged. |
| Exceptions | Stop and call Jonas if the isolator is already on, or the cable is damaged. |

## C2 practice

Supported only by S2. Leave it unlinked while v1 contains only S1.

**Title:** Breaker on, one machine dead

**Facts:**

- Breaker stays on
- One labelled machine is dead
- No hazard reported

**Options, in display order:**

| ID | Label |
| --- | --- |
| C2-A | Check the session log |
| C2-B | Check the machine's labelled isolator |
| C2-C | Wait without checking |

**Correct option:** C2-B

## G1 question

> At Keller Elektro, when the labelled breaker stays on but one machine is dead, what do you check, why, and when do you stop or escalate?
