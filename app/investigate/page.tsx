"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, CloudCog, Database, FileSearch, Globe2, Radar, RefreshCw, ShieldCheck, Sparkles, TriangleAlert, Waypoints } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { InvestigationReport } from "@/lib/types";

const stages = [
  { name: "Baseline loaded", detail: "Known-good checkout evidence indexed", icon: Database, provider: "Tracefall" },
  { name: "Failure reproduced", detail: "Isolated journey replay", icon: CloudCog, provider: "Daytona" },
  { name: "Regions compared", detail: "Singapore + United States", icon: Globe2, provider: "Oxylabs" },
  { name: "Evidence retrieved", detail: "Semantic similarity search", icon: FileSearch, provider: "Doubleword" },
  { name: "Cause generated", detail: "Kimi structured analysis", icon: Sparkles, provider: "ai&" },
  { name: "Causes challenged", detail: "Independent GPU review", icon: Waypoints, provider: "Nosana" },
  { name: "Report synthesized", detail: "Best-supported explanation", icon: ShieldCheck, provider: "Tracefall" },
];

export default function InvestigatePage() {
  const router = useRouter();
  const started = useRef(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"running" | "complete" | "error">("running");
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, stages.length - 2)), 1100);
    void fetch("/api/investigate", { method: "POST" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Investigation returned HTTP ${response.status}`);
        return response.json() as Promise<InvestigationReport>;
      })
      .then((report) => {
        if (cancelled) return;
        window.clearInterval(timer);
        sessionStorage.setItem("tracefall:lastReport", JSON.stringify(report));
        setStep(stages.length - 1);
        setStatus("complete");
        window.setTimeout(() => router.push("/report"), 850);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        window.clearInterval(timer);
        setError(reason instanceof Error ? reason.message : "Investigation failed");
        setStatus("error");
      });
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [router]);

  return <main className="investigation-page">
    <nav className="nav shell"><Link href="/" className="brand"><span className="brand-mark"><Image src="/brand/tracefall-logo.png" alt="" width={34} height={34}/></span><span>tracefall</span></Link><span className={`run-state ${status}`}>{status}</span></nav>
    <section className="investigation-run shell">
      <div className="run-heading"><span className="eyebrow"><Radar size={14}/> AUTONOMOUS INVESTIGATION</span><h1>{status === "error" ? "Investigation interrupted." : status === "complete" ? "Evidence converged." : "Following the failure trace."}</h1><p>{status === "complete" ? "Routing to the incident report…" : "Tracefall is reproducing the checkout failure and challenging competing causes across the investigation stack."}</p></div>
      <div className="run-layout">
        <div className="panel run-target"><span className="panel-kicker">REFERENCE JOURNEY</span><h2>Storefront checkout</h2><div className="journey-steps"><RunJourney passed title="Open product page" meta="200 · baseline loaded"/><RunJourney passed title="Add item to cart" meta="Interaction passed"/><RunJourney title="Proceed to checkout" meta="PaymentSDK undefined"/></div><div className="run-signal"><TriangleAlert size={17}/><div><strong>Payment SDK unavailable</strong><span>GET payment-sdk.js · 503</span></div></div></div>
        <div className="panel run-timeline"><div className="panel-head"><div><span className="panel-kicker">LIVE EXECUTION</span><h2>Agent workflow</h2></div>{status === "running" && <RefreshCw className="spin" size={20}/>}</div><div className="run-stage-list">{stages.map((stage,index)=>{const Icon=stage.icon;const complete=index<=step;const active=index===step&&status==="running";return <div className={`run-stage ${complete?"complete":""} ${active?"active":""}`} key={stage.name}><span className="run-stage-icon">{complete&&!active?<Check size={15}/>:<Icon size={15}/>}</span><div><strong>{stage.name}</strong><small>{stage.detail}</small></div><code>{stage.provider}</code></div>})}</div></div>
      </div>
      {status === "error" && <div className="error-banner"><TriangleAlert size={18}/>{error}<button className="button button-small" onClick={()=>location.reload()}>Retry</button></div>}
    </section>
  </main>;
}

function RunJourney({ title, meta, passed=false }: { title:string; meta:string; passed?:boolean }) {
  return <div className={`run-journey ${passed?"passed":"failed"}`}><span>{passed?<Check size={14}/>:<TriangleAlert size={14}/>}</span><div><strong>{title}</strong><small>{meta}</small></div></div>;
}
