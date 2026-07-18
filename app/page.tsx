"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity, ArrowRight, Check, ChevronRight, CircleDot, Clock3, CloudCog, Code2,
  Copy, Database, ExternalLink, FileSearch, Globe2, Play, Radar, RefreshCw,
  ShieldCheck, Sparkles, Terminal, TriangleAlert, Waypoints, Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { InvestigationReport } from "@/lib/types";
import TraceCore3D from "@/components/TraceCore3D";

const stages = [
  { name: "Baseline loaded", detail: "Known-good checkout evidence indexed", icon: Database, provider: "Tracefall" },
  { name: "Failure reproduced", detail: "Isolated journey replay", icon: CloudCog, provider: "Daytona" },
  { name: "Regions compared", detail: "Singapore + United States", icon: Globe2, provider: "Oxylabs" },
  { name: "Evidence retrieved", detail: "Semantic similarity search", icon: FileSearch, provider: "Doubleword" },
  { name: "Hypotheses generated", detail: "Kimi K2.7 structured analysis", icon: Sparkles, provider: "ai&" },
  { name: "Hypotheses challenged", detail: "3 causes · 1 GPU review", icon: Waypoints, provider: "Nosana" },
  { name: "Report synthesized", detail: "Best-supported explanation", icon: ShieldCheck, provider: "ai&" },
];

const platformNames = ["DAYTONA", "ai&", "DOUBLEWORD", "NOSANA", "OXYLABS"];

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "running" | "complete" | "error">("idle");
  const [step, setStep] = useState(-1);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (state !== "running") return;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, stages.length - 2)), 850);
    return () => window.clearInterval(timer);
  }, [state]);

  function runInvestigation() {
    router.push("/investigate");
  }

  async function copyReport() {
    if (!report) return;
    await navigator.clipboard.writeText(`${report.incident}\nCause: ${report.likelyCause}\nConfidence: ${report.confidence}%\nAction: ${report.recommendation}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main>
      <div className="noise" />
      <nav className="nav shell">
        <a href="#top" className="brand" aria-label="Tracefall home">
          <span className="brand-mark"><Image src="/brand/tracefall-logo.png" alt="" width={34} height={34} priority /></span>
          <span>tracefall</span>
        </a>
        <div className="nav-center">
          <a href="#workflow">Workflow</a>
          <Link href="/report">Evidence</Link>
          <a href="#architecture">Architecture</a>
        </div>
        <div className="nav-actions">
          <span className="live-pill"><span /> System ready</span>
          <button className="button button-small" onClick={runInvestigation} disabled={state === "running"}>
            {state === "running" ? <RefreshCw className="spin" size={14} /> : <Play size={14} fill="currentColor" />}
            Run investigation
          </button>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Radar size={14} /> Autonomous journey intelligence <span>HackSprint 2026</span></div>
          <h1>Find where customer<br />journeys <em>fall apart.</em></h1>
          <p className="hero-sub">Tracefall reproduces broken journeys in an isolated sandbox, challenges competing causes across decentralized AI, and delivers an evidence-backed incident report.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={runInvestigation} disabled={state === "running"}>
              {state === "running" ? <RefreshCw className="spin" size={17} /> : <Zap size={17} fill="currentColor" />}
              {state === "running" ? "Investigating…" : "Investigate checkout"}
              {state !== "running" && <ArrowRight size={17} />}
            </button>
            <Link className="button button-ghost" href="/demo-store" target="_blank">Open demo store <ExternalLink size={15} /></Link>
          </div>
          <div className="hero-proof">
            <div className="avatars"><i>D</i><i>O</i><i>DW</i><i>N</i><i>&</i></div>
            <p><strong>5 integrations.</strong> One autonomous feedback loop.</p>
          </div>
        </div>

        <div className="trace-scene" aria-label="3D customer journey trace visualization">
          <TraceCore3D />
          <div className="scene-orbit orbit-one" /><div className="scene-orbit orbit-two" />
          <div className="scene-grid" />
          <div className="trace-card">
            <div className="trace-card-head"><span><Activity size={14} /> LIVE JOURNEY</span><code>storefront / checkout</code></div>
            <svg viewBox="0 0 560 330" role="img" aria-label="Journey from product page to failed checkout">
              <defs>
                <linearGradient id="traceGradient" x1="0" x2="1"><stop stopColor="#42E8C4"/><stop offset=".62" stopColor="#54B8FF"/><stop offset="1" stopColor="#FF5C6C"/></linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path className="trace-shadow" d="M52 257 C120 260 135 185 210 190 S318 95 383 117 S451 208 512 57" />
              <path className="trace-line" d="M52 257 C120 260 135 185 210 190 S318 95 383 117 S451 208 512 57" />
              <circle className="trace-pulse" cx="52" cy="257" r="7"/><circle className="trace-node" cx="52" cy="257" r="10"/>
              <circle className="trace-node" cx="210" cy="190" r="10"/><circle className="trace-node" cx="383" cy="117" r="10"/>
              <circle className="failure-halo" cx="512" cy="57" r="25"/><circle className="failure-node" cx="512" cy="57" r="11"/>
              <text x="31" y="292">PRODUCT</text><text x="181" y="224">ADD TO CART</text><text x="348" y="151">CART</text><text className="failure-text" x="437" y="24">CHECKOUT FAILED</text>
            </svg>
            <div className="trace-alert"><TriangleAlert size={16}/><div><strong>Payment SDK unavailable</strong><span>Failure first seen 2m 14s ago</span></div><code>503</code></div>
          </div>
          <div className="float-chip chip-top"><span className="provider-dot mint" /> Daytona <strong>isolated</strong></div>
          <div className="float-chip chip-bottom"><CircleDot size={14}/> confidence <strong>84%</strong></div>
        </div>
      </section>

      <section className="sponsor-strip">
        <div className="shell sponsor-inner"><span>INVESTIGATION STACK</span>{platformNames.map((name) => <strong key={name}>{name}</strong>)}</div>
      </section>

      <section className="dashboard-section shell" id="workflow">
        <div className="section-heading">
          <div><span className="kicker">01 / COMMAND CENTER</span><h2>One journey. Every clue.</h2><p>From the first broken click to the best-supported cause.</p></div>
          <div className="incident-id"><span className="status-dot danger"/> Active incident <code>TF-2026-0718</code></div>
        </div>

        <div className="metrics-grid">
          <Metric label="Journey health" value="67%" caption="↓ 33% from baseline" icon={Activity} tone="danger" />
          <Metric label="Failed step" value="03 / 03" caption="Proceed to checkout" icon={TriangleAlert} tone="amber" />
          <Metric label="Last successful" value="14:32" caption="7 minutes ago" icon={Clock3} />
          <Metric label="Affected region" value="SG" caption="US path is healthy" icon={Globe2} tone="blue" />
        </div>

        <div className="control-grid">
          <div className="panel journey-panel">
            <div className="panel-head"><div><span className="panel-kicker">REFERENCE JOURNEY · MVP TARGET</span><h3>Storefront checkout</h3></div><Link href="/demo-store" target="_blank">View target <ExternalLink size={13}/></Link></div>
            <div className="journey-steps">
              <JourneyStep number="01" title="Open product page" meta="200 · 384 ms" status="done" />
              <JourneyStep number="02" title="Add item to cart" meta="Interaction passed" status="done" />
              <JourneyStep number="03" title="Proceed to checkout" meta="PaymentSDK undefined" status="failed" />
            </div>
            <button className="button button-primary full" onClick={runInvestigation} disabled={state === "running"}>
              {state === "running" ? <RefreshCw className="spin" size={16}/> : <Play size={16} fill="currentColor"/>}
              {state === "running" ? `Investigating · ${Math.max(step + 1, 1)}/${stages.length}` : state === "complete" ? "Run investigation again" : "Launch autonomous investigation"}
            </button>
          </div>

          <div className="panel timeline-panel">
            <div className="panel-head"><div><span className="panel-kicker">LIVE INVESTIGATION</span><h3>Agent execution trace</h3></div><span className={`run-state ${state}`}>{state === "idle" ? "Awaiting run" : state}</span></div>
            <div className="timeline">
              {stages.map((item, index) => {
                const active = index === step && state === "running";
                const complete = index <= step && (state === "complete" || index < step);
                const Icon = item.icon;
                return <div className={`timeline-row ${active ? "active" : ""} ${complete ? "complete" : ""}`} key={item.name}>
                  <div className="timeline-icon">{complete ? <Check size={14}/> : <Icon size={14}/>}</div>
                  <div><strong>{item.name}</strong><span>{item.detail}</span></div><code>{item.provider}</code>
                </div>;
              })}
            </div>
            {state === "idle" && <div className="timeline-overlay"><Radar size={26}/><span>Run the investigation to watch five systems collaborate</span></div>}
          </div>
        </div>
      </section>

      {state === "error" && <div className="shell error-banner"><TriangleAlert size={18}/> The live orchestrator failed. Check provider configuration or switch TRACEFALL_MODE to demo.</div>}

      {report && <Report report={report} copied={copied} onCopy={copyReport} reportRef={reportRef} />}

      <section className="architecture shell" id="architecture">
        <div className="section-heading compact"><div><span className="kicker">03 / PURPOSE-BUILT ORCHESTRATION</span><h2>Each system strengthens the evidence.</h2><p>Selected for the execution, web intelligence, retrieval, reasoning, and verification capabilities the investigation needs.</p></div></div>
        <div className="architecture-flow">
          {[{n:"01",t:"Reproduce",p:"Daytona",d:"Run the broken journey in a clean sandbox."},{n:"02",t:"Compare",p:"Oxylabs",d:"Test the same resource from SG and US."},{n:"03",t:"Retrieve",p:"Doubleword",d:"Find the closest historical evidence."},{n:"04",t:"Reason",p:"Kimi via ai&",d:"Generate a structured cause analysis."},{n:"05",t:"Challenge",p:"Nosana",d:"Score three competing causes on independent GPU inference."}].map((item, index) => <div className="architecture-node" key={item.p}><span>{item.n}</span><div className="arch-icon"><Code2 size={20}/></div><h3>{item.t}</h3><strong>{item.p}</strong><p>{item.d}</p>{index < 4 && <ChevronRight className="arch-arrow"/>}</div>)}
        </div>
      </section>

      <footer><div className="shell footer-inner"><div className="brand"><span className="brand-mark"><Image src="/brand/tracefall-logo.png" alt="" width={28} height={28}/></span><span>tracefall</span></div><p>Built at Daytona HackSprint Singapore · Evidence over guesswork.</p><a href="https://github.com/MT7654/tracefall" target="_blank">View source <ExternalLink size={13}/></a></div></footer>
    </main>
  );
}

function Metric({ label, value, caption, icon: Icon, tone = "mint" }: { label:string; value:string; caption:string; icon:typeof Activity; tone?:string }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><span>{label}</span><Icon size={17}/></div><strong>{value}</strong><p>{caption}</p></div>;
}

function JourneyStep({ number, title, meta, status }: { number:string; title:string; meta:string; status:"done"|"failed" }) {
  return <div className={`journey-step ${status}`}><div className="step-node">{status === "done" ? <Check size={14}/> : <TriangleAlert size={14}/>}</div><code>{number}</code><div><strong>{title}</strong><span>{meta}</span></div><span className="step-status">{status === "done" ? "PASSED" : "FAILED"}</span></div>;
}

function Report({ report, copied, onCopy, reportRef }: { report:InvestigationReport; copied:boolean; onCopy:()=>void; reportRef:React.RefObject<HTMLElement | null> }) {
  return <section className="report-section shell" id="evidence" ref={reportRef}>
    <div className="section-heading"><div><span className="kicker">02 / INCIDENT REPORT</span><h2>The evidence converges.</h2><p>Best-supported cause, not an absolute claim.</p></div><button className="button button-ghost" onClick={onCopy}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copied" : "Copy report"}</button></div>
    <div className="report-hero panel">
      <div className="report-hero-main"><span className="severity"><TriangleAlert size={14}/> HIGH SEVERITY</span><h3>{report.likelyCause}</h3><p>{report.summary}</p><div className="report-meta"><span><b>Failed step</b>{report.failedStep}</span><span><b>Scope</b>{report.scope}</span></div></div>
      <div className="confidence-ring" style={{ "--score": `${report.confidence * 3.6}deg` } as React.CSSProperties}><div><strong>{report.confidence}%</strong><span>confidence</span></div></div>
    </div>
    <div className="evidence-grid">
      <div className="panel evidence-panel"><div className="panel-head"><div><span className="panel-kicker">BASELINE VS FAILURE</span><h3>What changed</h3></div><Terminal size={17}/></div><div className="diff-grid"><div><span className="diff-label good">BASELINE</span><code>200 OK</code><strong>{report.baseline.latencyMs} ms</strong><p>PaymentSDK ready</p></div><div><span className="diff-label bad">FAILURE</span><code>503 ERROR</code><strong>{report.failure.latencyMs} ms</strong><p>PaymentSDK undefined</p></div></div><div className="log-line"><span>CONSOLE</span><code>{report.consoleError}</code></div><div className="log-line danger-line"><span>NETWORK</span><code>{report.failedRequest}</code></div></div>
      <div className="panel region-panel"><div className="panel-head"><div><span className="panel-kicker">REGIONAL SCOPE</span><h3>Location comparison</h3></div><Globe2 size={17}/></div>{report.regions.map((region)=><div className="region-row" key={region.code}><span className="flag">{region.code}</span><div><strong>{region.country}</strong><span>{region.latencyMs} ms</span></div><code className={region.status >= 400 ? "bad-code":"good-code"}>{region.status}</code><span className={region.scriptLoaded ? "loaded":"not-loaded"}>{region.scriptLoaded ? "SDK loaded":"SDK failed"}</span></div>)}<div className="scope-callout"><Radar size={17}/><p><strong>Regional degradation detected.</strong> Customer impact is concentrated in the Singapore path.</p></div></div>
    </div>
    <div className="hypothesis-grid">
      <div className="panel hypotheses"><div className="panel-head"><div><span className="panel-kicker">PARALLEL CHALLENGE</span><h3>Competing hypotheses</h3></div><span className="nosana-badge">NOSANA GPU</span></div>{report.hypotheses.sort((a,b)=>b.confidence-a.confidence).map((hypothesis,index)=><div className={`hypothesis ${index===0?"winner":""}`} key={hypothesis.title}><span className="rank">0{index+1}</span><div><strong>{hypothesis.title}</strong><p>{hypothesis.evidence}</p><span>{hypothesis.provider}</span></div><div className="hyp-score"><strong>{hypothesis.confidence}%</strong><i><b style={{width:`${hypothesis.confidence}%`}}/></i></div></div>)}</div>
      <div className="panel provider-panel"><div className="panel-head"><div><span className="panel-kicker">EXECUTION RECEIPTS</span><h3>Proof of integration</h3></div><ShieldCheck size={17}/></div>{report.providers.map(provider=><div className="provider-row" key={provider.provider}><span className={`provider-dot ${provider.mode === "live" ? "mint":"amber"}`}/><div><strong>{provider.label}</strong><span>{provider.detail}</span>{provider.externalId&&<code>{provider.externalId.slice(0,22)}</code>}</div><div><b>{provider.mode} · {provider.status}</b><span>{provider.durationMs} ms</span></div></div>)}</div>
    </div>
    <div className="recommendation"><div className="rec-icon"><Zap size={22}/></div><div><span>RECOMMENDED NEXT ACTION</span><strong>{report.recommendation}</strong></div><button className="button button-small">Create runbook <ArrowRight size={14}/></button></div>
  </section>;
}
