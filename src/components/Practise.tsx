import { scenarios } from "@/lib/demo";

export function Practise() {
  return <section aria-labelledby="practise-title" className="space-y-6">
    <div><p className="eyebrow">03 / Practise decisions</p><h1 id="practise-title">Know the next step.</h1><p className="intro">Put reviewed experience to work, one situation at a time.</p></div>
    <div className="panel"><h2>Publish a reviewed playbook first.</h2><p className="muted">Practice becomes available when an expert has approved and published guidance.</p></div>
    <div className="grid gap-6 sm:grid-cols-2">{scenarios.map(s => <article className="panel space-y-4" key={s.id}>
      <p className="eyebrow">Demo Hall · {s.id}</p><h2>{s.title}</h2><p className="fictional">Fictional training example</p>
      <p className="muted">Not covered · No published guidance</p><button disabled>Start practice</button>
    </article>)}</div>
    <div className="panel"><h2>Attempt history</h2><p className="muted">No attempts yet.</p></div>
  </section>;
}
