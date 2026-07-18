"use client";

import { ArrowRight, Check, Copy, Globe2, Radar, ShieldCheck, Terminal, TriangleAlert, Zap } from "lucide-react";
import type { CSSProperties, RefObject } from "react";
import type { InvestigationReport } from "@/lib/types";

export default function InvestigationReportView({ report, copied, onCopy, reportRef }: {
  report: InvestigationReport;
  copied: boolean;
  onCopy: () => void;
  reportRef?: RefObject<HTMLElement | null>;
}) {
  const hypotheses = [...report.hypotheses].sort((a, b) => b.confidence - a.confidence);
  return <section className="report-section shell" id="evidence" ref={reportRef}>
    <div className="section-heading"><div><span className="kicker">INCIDENT REPORT</span><h2>The evidence converges.</h2><p>Best-supported cause, not an absolute claim.</p></div><button className="button button-ghost" onClick={onCopy}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copied" : "Copy report"}</button></div>
    <div className="report-hero panel">
      <div className="report-hero-main"><span className="severity"><TriangleAlert size={14}/> HIGH SEVERITY</span><h3>{report.likelyCause}</h3><p>{report.summary}</p><div className="report-meta"><span><b>Failed step</b>{report.failedStep}</span><span><b>Scope</b>{report.scope}</span></div></div>
      <div className="confidence-ring" style={{ "--score": `${report.confidence * 3.6}deg` } as CSSProperties}><div><strong>{report.confidence}%</strong><span>confidence</span></div></div>
    </div>
    <div className="evidence-grid">
      <div className="panel evidence-panel"><div className="panel-head"><div><span className="panel-kicker">BASELINE VS FAILURE</span><h3>What changed</h3></div><Terminal size={17}/></div><div className="diff-grid"><div><span className="diff-label good">BASELINE</span><code>200 OK</code><strong>{report.baseline.latencyMs} ms</strong><p>PaymentSDK ready</p></div><div><span className="diff-label bad">FAILURE</span><code>503 ERROR</code><strong>{report.failure.latencyMs} ms</strong><p>PaymentSDK undefined</p></div></div><div className="log-line"><span>CONSOLE</span><code>{report.consoleError}</code></div><div className="log-line danger-line"><span>NETWORK</span><code>{report.failedRequest}</code></div></div>
      <div className="panel region-panel"><div className="panel-head"><div><span className="panel-kicker">REGIONAL SCOPE</span><h3>Location comparison</h3></div><Globe2 size={17}/></div>{report.regions.map((region)=><div className="region-row" key={region.code}><span className="flag">{region.code}</span><div><strong>{region.country}</strong><span>{region.latencyMs} ms</span></div><code className={region.status >= 400 ? "bad-code":"good-code"}>{region.status}</code><span className={region.scriptLoaded ? "loaded":"not-loaded"}>{region.scriptLoaded ? "SDK loaded":"SDK failed"}</span></div>)}<div className="scope-callout"><Radar size={17}/><p><strong>Regional degradation detected.</strong> Customer impact is concentrated in the Singapore path.</p></div></div>
    </div>
    <div className="hypothesis-grid">
      <div className="panel hypotheses"><div className="panel-head"><div><span className="panel-kicker">INDEPENDENT CHALLENGE</span><h3>Competing hypotheses</h3></div><span className="nosana-badge">NOSANA GPU</span></div>{hypotheses.map((hypothesis,index)=><div className={`hypothesis ${index===0?"winner":""}`} key={hypothesis.title}><span className="rank">0{index+1}</span><div><strong>{hypothesis.title}</strong><p>{hypothesis.evidence}</p><span>{hypothesis.provider}</span></div><div className="hyp-score"><strong>{hypothesis.confidence}%</strong><i><b style={{width:`${hypothesis.confidence}%`}}/></i></div></div>)}</div>
      <div className="panel provider-panel"><div className="panel-head"><div><span className="panel-kicker">EXECUTION RECEIPTS</span><h3>Proof of execution</h3></div><ShieldCheck size={17}/></div>{report.providers.map(provider=><div className="provider-row" key={provider.provider}><span className={`provider-dot ${provider.mode === "live" ? "mint":"amber"}`}/><div><strong>{provider.label}</strong><span>{provider.detail}</span>{provider.externalId&&<code>{provider.externalId.slice(0,22)}</code>}</div><div><b>{provider.mode} · {provider.status}</b><span>{provider.durationMs} ms</span></div></div>)}</div>
    </div>
    <div className="recommendation"><div className="rec-icon"><Zap size={22}/></div><div><span>RECOMMENDED NEXT ACTION</span><strong>{report.recommendation}</strong></div><span className="recommendation-status">READY FOR RUNBOOK <ArrowRight size={14}/></span></div>
  </section>;
}
