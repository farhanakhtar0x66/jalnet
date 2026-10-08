# JalNet local implementation report

Date: 2026-10-08, Asia/Kolkata. This is an implemented and tested **local milestone**, not P0 completion. The user authorized START, public GitHub publication/team access, local development while AWS SSO is unavailable, and emulator testing before physical-phone testing.

**Live AWS: BLOCKED_AWAITING_SSO.** Intended profile: `jalnet`; region: `ap-south-1`. No AWS credential probe, deployment, resource access, model call or live integration was performed. AWS modules remain IMPLEMENTED_UNVERIFIED. No fake/static credentials, placeholder AWS keys or LocalStack were introduced.

## Implemented modules

| Area | Files | Behavior / limits |
|---|---|---|
| Shared contracts | `packages/contracts/src/index.ts`, `events.ts` | Strict §8.3 assessment, reports/events/routes/ledger/upload/viewport/error schemas; reject invented exact-depth fields, extra keys, invalid categories/confidence/coordinates and unsupported upload content. |
| Domain / geometry | `packages/domain/src/{reports,incidents,rewards}.ts`, `packages/geo/src/{index,coverage}.ts` | Conceptual report transitions, conservative prompt/fusion, lower-median severity, independent confidence, logical expiry, H3 candidates, every-segment corridor intersection, immutable reversal entries. |
| Application / HTTP | `services/core/{ports,application,http}.ts` | Ownership, JPEG byte/decoder/hash validation, manual fallback, human-confirmed publication, transactional reports/incidents/ledger/guards, independent votes, routes, quota/cache and canonical redacted errors. |
| Local providers | `services/providers/{local,local-repository}.ts` | Ignored private file persistence, atomic local commits, short localhost upload grants, deliberately uncertain/manual analysis, straight-line demo route. |
| AWS providers | `services/providers/{aws,dynamo-repository}.ts` | Real SDK S3, configurable Nova Converse, Routes V2 Simple LineString, DynamoDB indexed/conditional/transactional adapters. SDK unit tests are mocked; actual behavior is unverified. |
| AWS services | `services/aws/{runtime,reports,events,routes,profile,worker,health}.ts` | Separate Lambda entry points, Cognito JWT subject, report-ID queue messages, transactional 90-second analysis lease, bounded model attempts/manual failure path, SQS partial-batch failure and honest non-probing health. No cloud-to-demo fallback. |
| Infrastructure | `infrastructure/cdk/{app,stack}.ts` | Single CDK TypeScript stack, scoped service IAM, private evidence, four canonical tables, Cognito, HTTP API, SQS/DLQ and six Node24 Lambdas. Synthesized only. |
| Native app | `apps/mobile/App.tsx`, `src/{Home,ReportFlow,SignIn,api,cache,drafts,location,ui,Button}.tsx/.ts` | Map-first native MapLibre, working local layers/routes/profile/camera, private draft/retry/confirmation, PKCE/SecureStore cloud sign-in boundary, Query API state and Zustand UI state, SQLite offline cache. |
| Local tools / CI | `scripts/{dev-server,seed-demo,reset-demo,local-safety,smoke-local,smoke-aws}.ts`, `.github/workflows/checks.yml` | Explicit LOCAL/DEMO mode, stopped-server reset protection, fixture HTTP smoke, guarded live smoke, read-only validation workflow without deployment credentials. |

The original supplied implementation plan is preserved byte-for-byte. Generated native projects, APKs, bundles, SDK/JDK caches, photos, runtime state and populated environment files are ignored by Git.

## Executed verification

Commands were run from the repository root with project-local Node24/pnpm10 on PATH, unless indicated. Local evidence does not establish live AWS success.

| Command / check | Executed result | What it establishes |
|---|---|---|
| `CI=true pnpm install --frozen-lockfile` | PASS | Lockfile/manifests reproduce locally. |
| `pnpm format:check`, `pnpm lint` | PASS at final local gate | Current source formatting/lint. |
| `pnpm typecheck` | PASS at final local gate | Shared/backend/infrastructure and mobile TypeScript. |
| `pnpm synth` | PASS at final local gate | Actual CloudFormation/assets generated without account access; scoped ARN/security assertions inspect this artifact. No deployment proof. |
| `pnpm test` | PASS: nine suites, 44 tests | Contract, domain, spatial, trust/concurrency, rewards, canonical errors, synthesized security, mocked SDK and mocked bounded-location behavior. |
| `pnpm mobile:bundle` | PASS at final local gate | Android Hermes export; not physical-device or AWS proof. |
| `./gradlew :app:assembleDebug --no-daemon` in `apps/mobile/android` | BUILD SUCCESSFUL, 13m2s, 338 tasks | Native development APK built with Corretto17, Android36, BuildTools35.0.0, NDK27.1.12297006. |
| `adb install -r …/app-debug.apk` and development-client deep link | Success; actual native screen rendered | Installed/running emulator build, MapLibre native map, saved-route polyline and local API warning. |
| `pnpm demo:reset`, `pnpm demo:seed` with server stopped | PASS | Only ignored LOCAL/DEMO data reset; deterministic Delhi route restored, no invented observations. |
| `pnpm demo:reset` while server listening | Expected exit1/refusal; data retained | Prevents deleting/overwriting active in-memory demo state. |
| `pnpm smoke:local` on clean seeded localhost server | PASS | Generated JPEG → private localhost upload → manual confirmation → fusion → route warning → immutable awards → replay; explicit fixture identities. |
| `pnpm smoke:aws` without `--live` | Expected exit2, BLOCKED_AWAITING_SSO | Guard exits before any AWS call. This is not a smoke-test pass. |
| Source comparison / Git whitespace / credential-pattern review | PASS | Plan unchanged; authored diff clean; no key material or runtime/private artifacts in publication set. |
| GitHub CI | PASS, checks job 42 seconds, commit `6bddc1c` | [Actual validation run](https://github.com/farhanakhtar0x66/jalnet/actions/runs/37702139384): frozen install, format, lint, types, synth, 44 tests and Android bundle all succeeded on Ubuntu. No AWS credentials/deployment. |

Native build command used these local paths:

```sh
ANDROID_HOME=/Users/farhanakhtar/Projects/JalNet/.tools/android-sdk \
JAVA_HOME=/Users/farhanakhtar/Projects/JalNet/.tools/jdk/amazon-corretto-17.jdk/Contents/Home \
GRADLE_USER_HOME=/Users/farhanakhtar/Projects/JalNet/.tools/gradle \
PATH=/Users/farhanakhtar/Projects/JalNet/.tools/node_modules/.bin:$PATH \
./gradlew :app:assembleDebug --no-daemon
```

SDK platform/command-line/JDK downloads had checksum validation. Some SDK directories are symlinked to the existing user SDK; Gradle installed the selected BuildTools/NDK there. These tools are machine setup, not committed application dependencies.

## Native emulator walkthrough

Pixel7 AVD, existing API37.1 arm64 phone image, debug development build. API37.1 is preview emulator software, so target-phone compatibility and performance remain unverified.

- Native map loaded MapLibre's official demo style with attribution; the visible mode banner said LOCAL/DEMO and AWS blocked awaiting SSO. This does not verify Amazon map assets.
- Camera primer/permission, native capture, resized private preview and direct `expo/fetch` File upload executed. Captured file was **14,020 bytes, 1,280×1,102**, with no EXIF marker. It was a simulated black/timestamp camera frame, not a photograph of a real water issue.
- API reached NEEDS_CONFIRMATION with explicit LOCAL/DEMO/no-model-ran text. Model relevance/confidence was never treated as truth.
- Force-stop/relaunch restored the private image and server report without reuploading. A stale query-key bug discovered during upload was fixed by explicitly reading/caching the exact report ID.
- Still-active was explicitly enabled and public-road consent left off. Private confirmation succeeded, returned to the map, added no public incident and awarded no additional droplets.
- Foreground primer and native GPS path returned deliberately simulated Delhi coordinates with approximately 5 m accuracy. A bounded foreground watch now removes itself after a fix/error/15-second timeout. Simulated GPS does not verify physical location or spoof resistance.
- Native profile displayed the actual local ledger balance (10 droplets) and entry history, with people-helped estimates explicitly unavailable. The map renders an approximate category-policy affected area, never a measured water extent.
- With the API stopped, force-stop/relaunch read persisted SQLite reports/routes and showed a cache timestamp/current conditions unknown. Current route warnings were suppressed. Android native fetch's Error-vs-TypeError difference was found and fixed with an explicit transport error type; authorization/schema/config failures never fall back to cache.

Screenshots, UI trees, emulator photos and local private state remain ignored. The walkthrough covers one emulator size; screen-reader, large-text, denied/approximate permissions, interrupted real S3 uploads and actual hazard images need the full device matrix.

## AWS resources: planned/synthesized, never used live

- Four encrypted retained/PITR DynamoDB tables: reports, events with H3 GSI, user-private saved routes, and immutable ledger with user GSI/primary-key guards. Canonical incidents do not have destructive TTL.
- One retained encrypted private S3 bucket with Block Public Access/TLS and 14-day raw evidence lifecycle; five-minute presigned upload grants.
- Cognito email user pool, secretless OAuth authorization-code client/PKCE, hosted domain; JWT authorizer on private routes.
- HTTP API with stage rate5/burst10; separate report/event/route/profile/analysis/health functions, bounded concurrency and one-week logs.
- SQS media queue and DLQ. Nova model ID/profile and InvokeModel ARNs are actual deployment inputs with no fabricated defaults. Backend Routes permission uses the documented empty-account provider ARN.
- No Amazon Location restricted map key, deployed resource names, model access, identity session, live budget or processing geography has been established.

## Decisions and remaining limitations

[DECISIONS.md](DECISIONS.md) records exact source conflicts/policies. The planned AWS architecture is retained. Documented prototype differences include simple typed DynamoDB keys instead of the illustrative prefixed key layout; upload-completion discriminator on the existing report endpoint; logical SUBMITTED transition within an atomic final confirmation; no public original-photo preview; no numeric Jal Pulse with sparse inputs; local continuation explicitly authorized by the user.

P0 remains incomplete. Important remaining work includes:

- SSO-dependent Phase0 actual Cognito/API/Dynamo/S3/SQS/Nova/Location Maps/Routes smoke and end-to-end integration, IAM denial/quotas/retention/residency/cost verification.
- Live SQS delivery/lease/model-cost proof, S3 signed-URL replay/version behavior, full contradictory-observation trust policy, transactionally strict concurrent saved-route cap, broader route-impact/usefulness awards and review-authorized reversals.
- H3 GSI consistency can conservatively leave concurrent incidents separate; the ledger user GSI can lag balances. Warm route caches do not persist across cold starts. Long routes can exceed the bounded urban candidate budget.
- Token refresh/revocation, user erasure, operational metrics/alarms, central copy keys, the full accessibility/physical performance matrix remain incomplete. Scoped freshness/provenance styling and basic accessible states are now implemented locally.
- Cloud seed/reset must be scoped against actual deployment before implementation; five live rehearsals, architecture freeze, deadline verification and submission video/write-up remain pending. The user selected MIT licensing during cutover cleanup.

P1/P2 stay deferred: Water Stress inputs/normalization, simulated tanks, demo tankers, official alerts, video, push, alternative routes, background learning, HeatSafe, advanced DrainScan, suppliers/payments/hardware/municipal/predictive systems.

## Local demo / next integration boundary

Use Node24.21/pnpm10.34.6. Stop the local server before reset/seed:

```sh
pnpm install --frozen-lockfile
pnpm demo:reset
pnpm demo:seed
pnpm local:server
# Another terminal:
pnpm mobile:start
# First native build with SDK/JDK configured:
pnpm mobile:android
# Clean seeded API, generated fixtures explicitly disclosed:
pnpm smoke:local
```

Local mobile uses emulator host `10.0.2.2:8787`. Capture near the saved corridor, manually classify, explicitly confirm still-active/public-road consent, then inspect the incident/warning/provisional ledger. Different generated-fixture identities can exercise corroboration through the HTTP smoke; this is never real independent witness evidence.

No credentials are requested. When the existing local SSO profile becomes available, use profile `jalnet` in `ap-south-1`, configure actual resources/model/profile ARNs privately, deploy and execute Phase0 tests. Cloud Lambda already selects AWS providers; mobile must explicitly select `aws` and use actual Cognito/API/map configuration. Run the guarded live provider smoke with an actual captured JPEG, then separately prove deployed JWT API/queue/native Amazon assets and the full live loop. Record each actual response and retain IMPLEMENTED_UNVERIFIED/BLOCKED until its acceptance evidence exists.

Public repository: [farhanakhtar0x66/jalnet](https://github.com/farhanakhtar0x66/jalnet). Aryanxp1 write permission verified; shubhrgunjan write invitation pending. OpenAI Codex assistance is disclosed in README; the Expo starter license is retained and the user selected the MIT project license.

The earlier implementation commits were pushed to public main; remote SHA matched the local published SHA. CI verified that earlier milestone on 6bddc1c; the following P0 cutover changes include implementation and tests, with their own gate evidence.

## P0 AWS-cutover readiness changes

No live AWS access or final demo recording occurred; P1/P2 remain frozen. Added AWS_CUTOVER_CHECKLIST.md (full boundary trace + IAM/config/payload/failure/tests/commands), AWS_DEPLOYMENT_RUNBOOK.md (first STS command, private target/role hard stop, scoped bootstrap policy, synth/diff/deploy/outputs/mobile/key/service sequence), and DEMO_READINESS.md (local reset/seed, dedicated-account expectations, three-minute shot list, live/simulated split, architecture frame and honest fallbacks).

Server config now requires all live resource/model/Cognito values and rejects an absent region/model or inconsistent queue URL/ARN. Mobile AWS mode requires actual HTTPS deployed API, region/pool/client/domain and restricted key/resource/signing values; a copied local URL is rejected and invalid config renders a blocked screen. CDK has no empty model parameter default, constrains invocation ARN shape, emits operational outputs and dev tags. Review found CloudFormation's alphanumeric output IDs differ from underscored runtime names; normalization and a synthesized-artifact compatibility test fix that cutover bug.

Live commands require `--live --profile jalnet` and a mode-600 private config with real expected account/SSO role/model/profile ARNs. Live smoke CLI and SDK identity checks must both match before writes; deployment binds the CLI-approved account/region and explicit CDK profile. Credential/endpoint overrides are rejected. Model/profile account/allowlist relationships are validated without fabricating values. Read-only dependency checks precede bounded provider or full HTTP workflow stages; capture directory/JPEG/hash/freshness/EXIF/file size are checked before upload. No cloud deletion, fixture seeding, queue purge, automatic status upgrade or final recording path exists. Native Android Maps restriction protocol/rendering is explicitly B-08, not guessed or weakened. Broad default managed Lambda logging permissions were replaced with each function's own precreated log-group write grant and asserted in the synthesized IAM test.

Fixed missing authorizer context returning 503 instead of 401; raw JWT-shaped headers cannot supply identity. Added bounded Nova backoff, S3 content-length checks and upload/queue timeouts. Stale/future captures are rejected at draft/upload/confirmation boundaries, while accepted-report replay remains idempotent. A completion that committed before scheduling failure can be retried against the same report, with bounded mobile polling and worker lease protection. Already submitted drafts have an explicit local cleanup action.

Private draft/cache scope is obtained from the authenticated `/v1/me` response during PKCE; no locally decoded JWT chooses ownership. Token, expiry and account scope are stored as one SecureStore session value. Draft/cache requests bind that scope, and in-flight account changes cannot clear another account's draft. Legacy unscoped drafts remain privately retained and unassigned, not silently migrated into a live identity. Actual Cognito/account-switch acceptance remains blocked; this design is not a cryptographic AWS proof.

P0 UI cleanup includes recent/aging/source/expiry labels, dimmed aging markers, status-correct verification copy, client-side expiry filtering, stale route-check warning suppression/refresh, loading/empty/error states, explicit AI-draft uncertainty, accessible selected/category/severity states and minimum touch targets. The capture path now requires an explicitly chosen map pin or foreground fix. MIT added at the user's request; attribution obligations retained.

Review additionally found that two different access tokens might belong to one account. The live workflow now compares two authenticated `/v1/me` subjects before any application write. The shared Maps metadata guard rejects malformed/expired expiry and additional unapproved Android/web/Apple callers. Read-only dependency staging now includes one IAM-authenticated Maps style descriptor, retained privately and bounded to 2 MB; this is a future service probe, not native key acceptance or executed AWS evidence.

## Current cutover local gate — 2026-10-08

The commands below actually executed after the final guard fixes, using the pinned workspace Node/pnpm on PATH. No `--live` command, credential probe, deployment or AWS SDK/service invocation occurred.

| Command | Actual result / scope |
|---|---|
| `pnpm format:check` | PASS, 64 files; no formatting changes required. |
| `pnpm lint` | PASS, 64 files; no lint fixes required. |
| `pnpm typecheck` | PASS, root and mobile TypeScript. |
| `pnpm synth` | PASS, credential-free CloudFormation/assets; resource-scoped logging/IAM and output compatibility checked locally. |
| `pnpm test` | PASS: **10 suites, 71 tests; 27 added** to the 44-test local milestone. Includes malformed key expiry/caller restrictions and same-subject live-account guards. SDK mocks and local failure injection are not AWS evidence. |
| `pnpm mobile:bundle` | PASS: Android Hermes export, 916 modules, 2.8 MB bundle. No new native APK build was needed or run for these JavaScript-only mobile changes. |
| `pnpm demo:reset`, `pnpm demo:seed`, `pnpm local:server`, `pnpm smoke:local` | PASS after stopping the known JalNet server and reseeding. Actual localhost fixture upload → manual confirmation → fusion → warning → ledger 10/7 → replay. One initial reset was denied by the sandbox's localhost check; the smoke refused the retained old data. Retried reset/seed with localhost permission, then clean smoke passed. No cloud data changed. |
| `pnpm smoke:aws` without flags | Expected exit 2: `BLOCKED_AWAITING_SSO`, explicit `--live` required; no AWS calls. Not counted as a live smoke pass. |
| Source-plan comparison and `git diff --check` | PASS; original plan unchanged byte for byte, authored diff has no whitespace errors. |

The updated emulator flow also rendered the account-scoped local camera capture/private upload and manual-confirmation screen, explicit LOCAL/DEMO/no-model copy, fresh/source/expiry incident card, and suppression/refresh of an outdated route check. The capture remained private in NEEDS_CONFIRMATION during this walkthrough. The earlier restart/offline/GPS evidence above belongs to the original milestone; those tests are not claimed as a new live or physical-device run. No final demo was recorded. P0 remains incomplete, with AWS-dependent work IMPLEMENTED_UNVERIFIED/BLOCKED_AWAITING_SSO.
