# Example datasets

These fictional cases can now be selected from **Try an example** in the guided MVP. They are not customer evidence or live AI output. The prepared source and draft are labelled; every snippet, expert answer and scenario applicability link still requires human approval.

- [Keller Elektro](keller-elektro/case.md): Marta Keller, master electrician; continuing owner Jonas Keller.
- [Nordform GmbH](nordform/case.md): Helmut Kruse, press-brake setter; continuing owner Anja Berger.

The implementation in [src/lib/demo.ts](../../src/lib/demo.ts) follows these human-authored case documents. Only S1 starts active. S2 is offered as a prepared expert reply when the follow-up question is opened; its answer is saved and explicitly reviewed before becoming memory. C1/C2 carry no automatic source link or approval. Test choices remain hidden for uncovered scenarios, regardless of the fixture answer key.

Choose **Your own knowledge** for an empty capture. Adding/editing personal material replaces the example context with explicit confirmation, so fixtures cannot masquerade as live extraction. The normal start contains no Demo Hall roleplay.
