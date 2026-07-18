# Architecture decisions

## Product boundary

Tracefall investigates one fixed e-commerce journey and one synthetic incident. This keeps the demo deep enough to show a complete autonomous loop while avoiding an unreliable general monitoring system.

## Why Daytona is first

The judging criteria require the MVP to be demonstrated inside the Daytona runtime. Daytona therefore creates the authoritative failed-run evidence; other systems enrich or challenge that evidence.

## Why two inference providers

Kimi K2.7 on ai& acts as the primary investigator and structured report author. Qwen on Nosana acts as an independent critic. Giving them different responsibilities is more defensible than sending the same prompt to both providers.

## Why Doubleword is retrieval-only

The demo corpus has five records, so a full vector database adds complexity without product value. Doubleword produces the real embeddings and Tracefall ranks them locally with cosine similarity.

## Reliability strategy

The orchestrator has three modes and bounded provider timeouts. Provider results include explicit receipts, making partial success observable. This is essential for a live two-minute demo where external GPU cold starts are plausible.

## Deployment

Vercel hosts the dashboard, server routes, and public journey probe. Daytona remains the isolated execution layer. `NEXT_PUBLIC_APP_URL` must be changed to the deployment URL so Oxylabs can reach the target from both regions.

## Known limitations

- The baseline and historic incidents are fixtures.
- Daytona executes a focused reproduction script rather than cloning arbitrary applications.
- Nosana endpoint discovery depends on the deployment metadata exposing its node URL.
- Oxylabs uses its official sandbox target while the app URL is localhost.
- No persistent database, authentication, monitoring scheduler, or automatic remediation.
