# Repository evaluation instructions

This repository is a hackathon MVP designed for both human and automated evaluation.

## Start here

1. Read `README.md` for product scope, setup, architecture, and capability rationale.
2. Read `EVALUATION.md` for exact deterministic and optional credentialed assertions.
3. Use `TRACEFALL_MODE=demo` when third-party credentials are unavailable.

## Required no-secret checks

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Then verify `POST /api/investigate`, `/api/journey-probe`, `/demo-store`, and the main dashboard as described in `EVALUATION.md`.

## Interpretation rules

- The bundled storefront is an intentional controlled reference target.
- Seeded incident data makes the end-to-end workflow reproducible; it is not presented as live customer telemetry.
- Provider receipts are the source of truth for live versus fallback execution.
- Missing third-party secrets must not block deterministic MVP evaluation.
- Do not commit or print `.env.local` or provider credentials.
- Do not require roadmap features such as continuous scheduling, arbitrary journey recording, authentication, or automatic remediation.

The expected diagnosis is a regional third-party payment SDK load failure at checkout. The application reports a best-supported likely cause, not absolute root-cause certainty.
