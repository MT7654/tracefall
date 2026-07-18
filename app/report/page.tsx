"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { useEffect, useState } from "react";
import InvestigationReportView from "@/components/InvestigationReportView";
import type { InvestigationReport } from "@/lib/types";

export default function ReportPage() {
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const value = sessionStorage.getItem("tracefall:lastReport");
    if (value) { try { setReport(JSON.parse(value) as InvestigationReport); } catch {} }
    setLoaded(true);
  }, []);

  const copyReport = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(`${report.incident}\nCause: ${report.likelyCause}\nConfidence: ${report.confidence}%\nAction: ${report.recommendation}`);
    setCopied(true); window.setTimeout(()=>setCopied(false),1500);
  };

  return <main className="report-page">
    <nav className="nav shell"><Link href="/" className="brand"><span className="brand-mark"><Image src="/brand/tracefall-logo.png" alt="" width={34} height={34}/></span><span>tracefall</span></Link><div className="nav-actions"><Link className="button button-small button-ghost" href="/"><ArrowLeft size={14}/> Home</Link><Link className="button button-small" href="/investigate"><Play size={14} fill="currentColor"/> Run again</Link></div></nav>
    {loaded && report && <InvestigationReportView report={report} copied={copied} onCopy={copyReport}/>} 
    {loaded && !report && <section className="empty-report shell"><span className="kicker">NO ACTIVE REPORT</span><h1>Run an investigation first.</h1><p>Reports are stored in this browser session after the agent workflow completes.</p><Link className="button button-primary" href="/investigate"><Play size={16} fill="currentColor"/> Start investigation</Link></section>}
  </main>;
}
