"use client";

import { useEffect, useReducer } from "react";
import { Capture } from "@/components/Capture";
import { Review } from "@/components/Review";
import { Practise } from "@/components/Practise";
import { fixtureExtraction, sourceS1 } from "@/lib/demo";
import { createSession, sessionReducer, type View } from "@/lib/session";

const views: { id: View; label: string }[] = [
  { id: "capture", label: "Capture" }, { id: "review", label: "Review" }, { id: "practise", label: "Practise" },
];

export default function Home() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createSession);
  // No storage is read or written in Task 1. Restoration is added at the persistence gate.
  useEffect(() => { dispatch({ type: "hydrated" }); }, []);

  function extractFixture() {
    const token = crypto.randomUUID();
    const sources = [{ ...sourceS1, text: state.incident }];
    dispatch({ type: "extractionStarted", token, sources: [sourceS1] });
    try {
      const result = fixtureExtraction(sources);
      dispatch({ type: "extractionSucceeded", token, draftId: crypto.randomUUID(), result });
    } catch (error) {
      dispatch({ type: "extractionFailed", token, message: error instanceof Error ? error.message : "Fixture unavailable." });
    }
  }

  return <div className="app-shell">
    <header className="site-header">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><a href="/" className="brand">BOOMERANG<span aria-hidden="true">↗</span></a><p className="tagline">Experience does not retire.</p></div>
        <div className="flex flex-wrap items-center gap-3"><span className="badge">Demo</span><span className="badge">Not published</span><span className="badge amber">{state.bundle.mode === "fixture" ? "Fixture replay" : "Live AI"}</span></div>
      </div>
      <div className="header-controls">
        <nav aria-label="Handover views" className="flex gap-1">{views.map(view => <button className="nav-button" key={view.id} aria-current={state.view === view.id ? "page" : undefined} disabled={state.hydration !== "ready"} onClick={() => dispatch({ type: "view", view: view.id })}>{view.label}</button>)}</nav>
        <details className="session-menu"><summary>Session settings</summary><div className="space-y-4">
          <label>Demo mode<select value={state.bundle.mode} disabled={state.hydration !== "ready"} onChange={e => dispatch({ type: "mode", mode: e.target.value as "live" | "fixture" })}><option value="fixture">Fixture replay</option><option value="live">Live AI</option></select></label>
          <p className="muted">Changing mode starts a new session.</p>
          <button className="secondary" disabled={state.hydration !== "ready"} onClick={() => { if (window.confirm("Reset this demo? Saved guidance, attempts and questions will be removed.")) dispatch({ type: "reset" }); }}>Reset demo</button>
        </div></details>
      </div>
    </header>
    <main id="main-content">
      <p className="temporary">Temporary session: changes will be lost on reload.</p>
      <div role="status" aria-live="polite">{state.notice && <p className="notice">{state.notice}</p>}</div>
      {state.hydration !== "ready" ? <p role="status">Preparing the demo…</p> : state.view === "capture"
        ? <Capture state={state} dispatch={dispatch} onExtract={extractFixture} />
        : state.view === "review" ? <Review state={state} /> : <Practise />}
    </main>
    <footer>BOOMERANG · Fictional handover demonstration</footer>
  </div>;
}
