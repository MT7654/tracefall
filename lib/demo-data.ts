import type { InvestigationReport } from "./types";

export const evidenceRecords = [
  "Baseline checkout completed. PaymentSDK loaded and button selector [data-checkout] was present.",
  "Previous synthetic failure: payment-sdk.js returned HTTP 503 in Singapore; checkout button stayed disabled.",
  "DOM observation: checkout button exists and its selector is unchanged, but the payment readiness attribute remains false.",
  "Network failure: GET /scripts/payment-sdk.js returned HTTP 503 after 4.8 seconds.",
  "Console error: ReferenceError: PaymentSDK is not defined at checkout.js:42:11.",
];

export function demoReport(): InvestigationReport {
  return {
    id: `TF-${new Date().getFullYear()}-0718`,
    createdAt: new Date().toISOString(),
    mode: "hybrid",
    incident: "Checkout journey failure",
    failedStep: "Proceed to checkout",
    severity: "High",
    likelyCause: "Third-party payment script failed to load",
    scope: "Reproduced from Singapore; healthy from the United States",
    confidence: 84,
    summary: "The checkout control is present but cannot initialize because the payment SDK request fails in the Singapore path. The unchanged selector and healthy US response make a DOM regression unlikely.",
    recommendation: "Fail over payment-sdk.js to the secondary CDN and add an explicit SDK readiness timeout with a customer-safe retry state.",
    consoleError: "ReferenceError: PaymentSDK is not defined at checkout.js:42:11",
    failedRequest: "GET /scripts/payment-sdk.js · 503 Service Unavailable · 4,812 ms",
    baseline: { status: 200, latencyMs: 384, selector: "[data-checkout]" },
    failure: { status: 503, latencyMs: 4812, selector: "[data-checkout]" },
    regions: [
      { country: "Singapore", code: "SG", status: 503, latencyMs: 4812, scriptLoaded: false },
      { country: "United States", code: "US", status: 200, latencyMs: 921, scriptLoaded: true },
    ],
    retrievedEvidence: [
      { label: "Previous payment CDN outage", score: 0.94 },
      { label: "Successful checkout baseline", score: 0.82 },
      { label: "Selector regression simulation", score: 0.41 },
    ],
    hypotheses: [
      { title: "Payment script failed to load", confidence: 88, supported: true, evidence: "Matches the 503 request and undefined SDK symbol.", provider: "Nosana · Qwen 3.5 9B" },
      { title: "Checkout selector changed", confidence: 21, supported: false, evidence: "The selector is unchanged and the control is present.", provider: "Nosana · Qwen 3.5 9B" },
      { title: "Checkout API returned invalid data", confidence: 34, supported: false, evidence: "No checkout API request occurs before SDK initialization.", provider: "Nosana · Qwen 3.5 9B" },
    ],
    providers: [],
  };
}
