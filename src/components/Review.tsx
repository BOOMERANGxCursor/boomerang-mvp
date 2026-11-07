import type { SessionState } from "@/lib/session";

export function Review({ state }: { state: SessionState }) {
  const draft = state.bundle.draft;
  return <section aria-labelledby="review-title" className="space-y-6">
    <div><p className="eyebrow">02 / Review guidance</p><h1 id="review-title">Make experience teachable.</h1><p className="intro">Check each decision against its source before approving it.</p></div>
    {!draft ? <div className="panel"><h2>No draft yet</h2><p className="muted">Capture an incident and extract a draft to see proposed guidance here.</p></div> : <>
      <div className="notice">Fixture preview · Unapproved · Review and publication controls are not available yet.</div>
      {draft.rules.map(rule => <article className="panel space-y-6" key={rule.id}>
        <div className="flex flex-wrap items-start justify-between gap-4"><h2>{rule.situation}</h2><span className="badge amber">Draft</span></div>
        <div className="grid gap-6 md:grid-cols-2">
          <dl className="space-y-4">
            <div><dt>Notice</dt><dd>{rule.conditions.join("; ") || "Not provided"}</dd></div>
            <div><dt>Do</dt><dd>{rule.action}</dd></div>
            <div><dt>Why</dt><dd>{rule.rationale ?? "Not provided"}</dd></div>
            <div><dt>Stop</dt><dd>{rule.exceptions.join("; ") || "Not provided"}</dd></div>
          </dl>
          <div className="evidence"><p className="eyebrow">Source evidence</p>{rule.evidence.map((e, i) => <div key={i}>
            <blockquote>{e.quote}</blockquote><details><summary>Read {e.sourceId} · {state.bundle.sources.find(s => s.id === e.sourceId)?.author}</summary><p className="source-text">{state.bundle.sources.find(s => s.id === e.sourceId)?.text}</p></details>
          </div>)}</div>
        </div>
      </article>)}
      <div className="panel"><h2>Not ready to publish</h2><p className="muted">Every card and its case applicability need human approval. Nothing in this preview is published guidance.</p></div>
    </>}
  </section>;
}
