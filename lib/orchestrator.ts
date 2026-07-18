import { demoReport } from "./demo-data";
import { runAiAnd, runDaytona, runDoubleword, runNosana, runOxylabs } from "./integrations";
import type { InvestigationReport } from "./types";

export async function investigate(): Promise<InvestigationReport> {
  const report = demoReport();
  const configuredMode = process.env.TRACEFALL_MODE || "hybrid";
  if (configuredMode === "demo") {
    report.mode = "demo";
    report.providers = ["Daytona", "Oxylabs", "Doubleword", "Kimi K2.7 via ai&", "Nosana"].map((label, i) => ({
      provider: (["daytona", "oxylabs", "doubleword", "ai&", "nosana"] as const)[i], label, mode: "demo", status: "fallback", durationMs: 120 + i * 87, detail: "Recorded hackathon evidence replayed deterministically.",
    }));
    return report;
  }

  const daytona = await runDaytona();
  const [oxylabs, doubleword, aiand] = await Promise.all([runOxylabs(), runDoubleword(), runAiAnd()]);
  const nosana = await runNosana(report.hypotheses);
  report.providers = [daytona.receipt, oxylabs.receipt, doubleword.receipt, aiand.receipt, nosana.receipt];
  if (oxylabs.regions) report.regions = oxylabs.regions;
  if (doubleword.evidence) report.retrievedEvidence = doubleword.evidence;
  if (nosana.hypotheses) report.hypotheses = nosana.hypotheses;
  if (aiand.analysis) {
    report.likelyCause = String(aiand.analysis.likelyCause || report.likelyCause);
    report.summary = String(aiand.analysis.summary || report.summary);
    report.recommendation = String(aiand.analysis.recommendation || report.recommendation);
    const confidence = Number(aiand.analysis.confidence);
    if (Number.isFinite(confidence)) report.confidence = Math.max(0, Math.min(100, Math.round(confidence)));
  }
  report.mode = report.providers.every((item) => item.mode === "live") ? "live" : "hybrid";
  return report;
}
