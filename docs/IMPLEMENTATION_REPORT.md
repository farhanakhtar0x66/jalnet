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
| GitHub CI | Pending initial implementation publication | Update with the actual workflow result; authored workflow is not executed CI evidence. |

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
- Token refresh/revocation, user erasure, operational metrics/alarms, full marker freshness styling, central copy keys, accessibility and target-device performance are incomplete.
- Cloud seed/reset must be scoped against actual deployment before implementation; five live rehearsals, architecture freeze, license choice, deadline verification and submission video/write-up remain pending.

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

Public repository: [farhanakhtar0x66/jalnet](https://github.com/farhanakhtar0x66/jalnet). Aryanxp1 write permission verified; shubhrgunjan write invitation pending. OpenAI Codex assistance is disclosed in README; the Expo starter license is retained, and a project-wide license remains undecided.
