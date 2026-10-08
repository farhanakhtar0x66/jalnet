# Build It feature audit and execution plan

Audit: 2026-10-08, Asia/Kolkata, starting at087a225 with existing acceptance-document drafts retained. The owner's new strategy authorizes the narrow secondary features below, superseding the earlier feature freeze only for this scope. Cedar stays frozen at9422fc2. Engineering branch: `codex/build-it-features`. Aryan owns visual implementation; the owner owns testing/product choices/recording/submission.

The [official overview](https://www.wemakedevs.org/aws/env) was reread on2026-10-08: it supports local AWS open-source use, explicitly lists Cedar, and needs no AWS account for Build It. The [rules](https://www.wemakedevs.org/aws/env/rules) still impose opening-time/original-work, team, participation and submission requirements. This supports the chosen technical path, not a claim of overall eligibility. Preserve all Git dates/history; organizer clarification remains pending. AWS SSO is not a primary-submission dependency; cloud acceptance stays BLOCKED_AWAITING_SSO.

## Prioritized execution

1. Publish a practical [UI handoff](ARYAN_UI_HANDOFF.md) and stable additive local data interfaces before feature implementation. Do not redesign the core screens or change existing HTTP contracts.
2. My Water: validated capacity/level/daily-consumption inputs, executable remaining-volume/depletion arithmetic, explicit one-day simulation, account-scoped persistence in the existing SQLite database and explicit fixture reset. Add calculation and persistence/recovery tests; run the full local gate.
3. If step2 is stable, Water Stress: six transparent weighted sample pressures, missing-input renormalization/coverage gate and inspectable contributions. No external-feed, map raster, environmental measurement or route-safety claim. Add calculation tests; repeat the gate.
4. TankerOS sample discovery as a noninteractive DEMO preview; HeatSafe as a PLANNED roadmap card. No booking/payment/contact/backend or dead buttons.
5. Update actual status/evidence, handoff, three-minute shot list and submission disclosures. Review coherent commits before push. Final video/submit still needs owner approval.

## Starting feature matrix

WORKING means executable behavior with evidence in the stated environment, not production acceptance. DEMO_SIMULATION means a functioning disclosed substitute/sample; PARTIALLY_WORKING identifies the missing portion. PLANNED and BLOCKED do not claim implementation.

| Feature | Starting classification | Actual evidence / limitation | Authorized next action |
|---|---|---|---|
| Street map and attribution control | WORKING | Native MapLibre/OpenFreeMap streets on Redmi; internet required, attribution popup acceptance pending | Preserve; Aryan polishes layout |
| Real Android camera/private draft/local upload | WORKING | One real staged Redmi JPEG/manual local confirmation; prior emulator restart evidence | Preserve; owner reports permission review, detailed cases not agent-verified |
| Manual classification/consented public incident | WORKING | Local HTTP and phone evidence; no local image model | Preserve human confirmation |
| Incident fusion/freshness | WORKING | Actual local domain/HTTP tests; two fixture identities, not independent citizens | Preserve |
| Saved-route warning | DEMO_SIMULATION | Actual intersection calculation over stored straight-line demo corridors; not road navigation | Preserve route warning and disclosure |
| Droplets/replay guards | WORKING | Local atomic ledger/replay tests and actual+2 staged phone contribution | Preserve; no fabricated impact metrics |
| Offline draft/cache recovery | PARTIALLY_WORKING | Actual emulator recovery/cache evidence; development client requires Metro, phone outage matrix incomplete | Preserve; owner tests physical cases |
| Cedar private-report authorization | WORKING | Real mandatory Node24/WASM decisions and40 engine/HTTP tests, frozen9422fc2 | No changes |
| AWS cloud services/Cognito/Nova/Location | BLOCKED | SDK/CDK/guards present, live access BLOCKED_AWAITING_SSO; Cedar not in Lambda | Retain future path; no cloud work this increment |
| My Water | PLANNED | No screen, tank model, persistence or calculator at audit | Highest-value working increment |
| Water Stress | PLANNED | No area-input calculator/detail UI at audit | Narrow explainable sample prototype after My Water |
| TankerOS | PLANNED | No supplier/reservation implementation at audit | DEMO preview with no booking action |
| HeatSafe/future intelligence | PLANNED | No heat exposure data/scoring/safer-route implementation | Static PLANNED preview |
| Push/video/background learning/IoT/payments/official feeds/prediction | PLANNED | No delivered feature; preserved plan is a roadmap | Outside this authorization |

## Completion evidence

First increment executed2026-10-08 at17:41 IST: My Water now has executable calculation/simulation, the minimal mobile screen and validated account-scoped persistence. `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm synth`, `pnpm test` (**14 suites /148 tests**), `pnpm mobile:bundle` and `pnpm smoke:local --isolated` passed. New37 tests cover26 tank/input cases and11 storage-port cases; all111 baseline tests are retained. Native SQLite/UI and new-feature physical acceptance are not inferred from these tests. Water Stress/vision remain planned at this increment. Original cloud P0 is not complete.
