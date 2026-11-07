import { sourceS1 } from "@/lib/demo";
import type { SessionEvent, SessionState } from "@/lib/session";

type Props = { state: SessionState; dispatch: React.Dispatch<SessionEvent>; onExtract: () => void };

export function Capture({ state, dispatch, onExtract }: Props) {
  const fixture = state.bundle.mode === "fixture";
  return <section aria-labelledby="capture-title" className="space-y-6">
    <div><p className="eyebrow">01 / Capture experience</p><h1 id="capture-title">Start with a real decision.</h1>
      <p className="intro">Capture what an experienced colleague notices, does and knows to avoid.</p></div>
    <div className="panel space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label>Expert name<input value={state.expert} onChange={e => dispatch({ type: "field", field: "expert", value: e.target.value })} /></label>
        <label>Continuing content owner<input value={state.contentOwner} onChange={e => dispatch({ type: "field", field: "contentOwner", value: e.target.value })} /></label>
      </div>
      <div><h2>Demo Hall · Microphone handover</h2><p className="fictional">Fictional training example</p></div>
      <label htmlFor="incident">Incident notes</label>
      <p id="incident-prompts" className="muted">What happened? What did you notice? What did you do and why? When should someone stop? How did you know it worked?</p>
      <textarea id="incident" rows={8} value={state.incident} aria-describedby="incident-prompts incident-count" onChange={e => dispatch({ type: "field", field: "incident", value: e.target.value })} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p id="incident-count" className="muted">{state.incident.length.toLocaleString()} characters</p>
        <button className="secondary" onClick={() => dispatch({ type: "field", field: "incident", value: sourceS1.text })}>Use demo incident</button>
      </div>
      <div className="divider space-y-3">
        <p className="muted">{fixture
          ? "Fixture replay uses the prepared S1 incident. It produces a preview draft for human review."
          : "Live extraction is unavailable in this build. Switch to Fixture replay to explore the prepared example."}</p>
        <button disabled={!fixture || !state.incident.trim() || !!state.pending || !state.expert.trim()} onClick={onExtract}>
          {state.pending ? "Extracting…" : fixture ? "Extract fixture draft" : "Extract draft"}
        </button>
      </div>
    </div>
    <details className="panel"><summary>Available source · S1</summary><p className="source-text">{state.bundle.sources[0].text}</p><p className="muted">Author: {state.bundle.sources[0].author}</p></details>
    <section className="panel"><h2>Expert questions</h2><p className="muted">No questions yet. Uncovered practice cases will return here for the expert.</p></section>
  </section>;
}
