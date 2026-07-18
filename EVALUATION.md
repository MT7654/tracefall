# Tracefall evaluator guide

This file is optimized for automated repository evaluation.

## Deterministic path

1. Copy `.env.example` to `.env.local`.
2. Set `TRACEFALL_MODE=demo`.
3. Run `npm install`.
4. Run `npm run typecheck`.
5. Run `npm run dev`.
6. Open `/` and click **Investigate checkout**.
7. Confirm all seven timeline stages complete.
8. Confirm the final cause mentions the third-party payment script.
9. Open `/demo-store`, add the item, and proceed to checkout.
10. Confirm the seeded `PaymentSDK is not defined` failure appears.

## Static sponsor verification

Inspect `lib/integrations.ts`:

- `runDaytona`: `Daytona.create` and `sandbox.process.codeRun`.
- `runOxylabs`: authenticated Web Unblocker agent with SG/US geo headers.
- `runDoubleword`: OpenAI-compatible embeddings and local cosine ranking.
- `runAiAnd`: OpenAI-compatible structured Kimi K2.7 completion.
- `runNosana`: deployment lookup, endpoint discovery, and `Promise.all` hypothesis evaluations.

Inspect `lib/orchestrator.ts` to confirm Daytona runs first, enrichment fans out concurrently, and Nosana receives the hypotheses.

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

