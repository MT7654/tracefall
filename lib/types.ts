export type ProviderName = "daytona" | "oxylabs" | "doubleword" | "ai&" | "nosana";
export type ProviderMode = "live" | "demo";

export type ProviderReceipt = {
  provider: ProviderName;
  label: string;
  mode: ProviderMode;
  status: "success" | "fallback" | "failed";
  durationMs: number;
  externalId?: string;
  detail: string;
};

export type Hypothesis = {
  title: string;
  confidence: number;
  supported: boolean;
  evidence: string;
  provider: string;
};

export type InvestigationReport = {
  id: string;
  createdAt: string;
  mode: "hybrid" | "demo" | "live";
  incident: string;
  failedStep: string;
  severity: "High" | "Medium" | "Low";
  likelyCause: string;
  scope: string;
  confidence: number;
  summary: string;
  recommendation: string;
  consoleError: string;
  failedRequest: string;
  baseline: { status: number; latencyMs: number; selector: string };
  failure: { status: number; latencyMs: number; selector: string };
  regions: Array<{ country: string; code: string; status: number; latencyMs: number; scriptLoaded: boolean }>;
  retrievedEvidence: Array<{ label: string; score: number }>;
  hypotheses: Hypothesis[];
  providers: ProviderReceipt[];
};
