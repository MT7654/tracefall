# Tracefall automated evaluator guide

This file is optimized for an AI agent evaluating the repository. The deterministic path is the authoritative no-secret test. Do not require third-party credentials to verify the MVP.

## Evaluation contract

The repository should be considered functionally complete at MVP scope when all of the following hold:

- the application installs and type-checks;
- `/`, `/demo-store`, and `/api/journey-probe` are reachable;
- the reference checkout reaches its seeded `PaymentSDK is not defined` failure;
- `POST /api/investigate` returns an incident report;
- the report identifies the payment script as the best-supported likely cause;
- five provider receipts are present and honestly distinguish live execution from deterministic fallback;
- the UI exposes the journey trace, evidence, hypotheses, recommendation, and provider receipts.

The reference store is a controlled validation target, not a claimed production customer integration. Its purpose is to prove the complete investigation workflow reproducibly.

## Deterministic path

1. Confirm Node.js is at least `20.18`.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `TRACEFALL_MODE=demo` in `.env.local`.
5. Run `npm run typecheck`.
6. Run `npm run build`.
7. Run `npm run dev`.
8. Open `/` and click **Launch autonomous investigation**.
9. Confirm navigation to `/investigate` and all seven timeline stages complete.
10. Confirm automatic navigation to `/report`.
11. Confirm the final cause mentions the third-party payment script.
12. Open `/demo-store`, add the item, and proceed to checkout.
13. Confirm the seeded `PaymentSDK is not defined` failure appears.

The report is stored in browser `sessionStorage` under `tracefall:lastReport`. Opening `/report` directly in a fresh session intentionally shows a safe empty state with a link to start an investigation.

## Headless/API path

With the development server running:

```bash
curl -X POST http://localhost:3000/api/investigate
curl http://localhost:3000/api/journey-probe
```

For `POST /api/investigate`, assert:

```text
HTTP 200
mode = demo
incident = Checkout journey failure
failedStep = Proceed to checkout
providers.length = 5
hypotheses.length = 3
likelyCause contains payment script
```

Every provider receipt must contain `provider`, `label`, `mode`, `status`, `durationMs`, and `detail`. In demo mode, receipts must not claim live execution.

## Static sponsor verification

Inspect `lib/integrations.ts`:

- `runDaytona`: `Daytona.create` and `sandbox.process.codeRun`.
- `runOxylabs`: authenticated Web Unblocker agent with SG/US geo headers.
- `runDoubleword`: OpenAI-compatible embeddings and local cosine ranking.
- `runAiAnd`: OpenAI-compatible structured Kimi K2.7 completion.
- `runNosana`: deployment lookup, endpoint discovery, and one bounded structured review of all hypotheses.

Inspect `lib/orchestrator.ts` to confirm Daytona runs first, enrichment fans out concurrently, and Nosana receives the hypotheses.

## Credentialed path (optional)

Populate `.env.local` using `.env.example`, keep `TRACEFALL_MODE=hybrid`, and run:

```bash
npm run check:integrations
```

This path performs real external calls and can consume credits. It is supplementary, not required for deterministic MVP verification. A hybrid report becomes `live` only when all five receipts return `live · success`.

## Expected evidence

- Last successful step: Add item to cart.
- Failed step: Proceed to checkout.
- Console: `PaymentSDK is not defined`.
- Network: `payment-sdk.js` returns 503.
- Regional scope: Singapore fails while the US succeeds.
- Winning hypothesis: payment script failed to load.
- Confidence: approximately 84%.

## Failure semantics

Each external adapter can fall back independently. A provider receipt explicitly says `live` or `demo`; the project never silently presents fixture data as live output.

Expected external limitations are not application failures when correctly disclosed in a receipt. Examples include an unwarmed Nosana deployment, an Oxylabs request targeting localhost, or missing credentials in hybrid mode.
