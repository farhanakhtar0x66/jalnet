# JalNet

A map-first water intelligence prototype: capture an observation, upload evidence privately, review a conservative assessment, confirm the report, update a fused incident and warn when it intersects a saved route. Droplets reward accepted contributions and independently supported usefulness.

Implementation has started. **Live AWS access is BLOCKED_AWAITING_SSO** until the intended `jalnet` profile becomes available in `ap-south-1`. LOCAL/DEMO providers let development continue; they never establish DynamoDB, S3, Nova, Cognito or Amazon Location verification. P0 is not complete.

[Specification](JalNet_Implementation_Plan.md) · [Status](docs/IMPLEMENTATION_STATUS.md) · [Decisions](docs/DECISIONS.md) · [Blockers](docs/BLOCKERS.md) · [Architecture](docs/ARCHITECTURE.md) · [Privacy](docs/PRIVACY.md) · [Local implementation report](docs/IMPLEMENTATION_REPORT.md) · [Backlog](TODO.md)

## Development

Pinned Node **24.21.0**, pnpm **10.34.6**, Expo **57.0.27**, React Native **0.86.3**, React **19.2.3**, MapLibre **11.5.0**. Use an Expo development build; Expo Go cannot run MapLibre. Android builds need JDK 17, Android 36 and the build-tools/NDK selected by Expo (the executed build used build-tools 35.0.0 and NDK 27.1.12297006). The local portable tools/cache are ignored under `.tools`; they are not required repository dependencies.

```sh
pnpm install --frozen-lockfile
pnpm demo:seed
pnpm local:server
# In another terminal:
pnpm mobile:start
```

The local API binds `127.0.0.1:8787`; Android emulator requests use `http://10.0.2.2:8787`. The mobile default is visibly labelled LOCAL/DEMO. The demo basemap uses MapLibre's official demo style. Local analysis returns uncertainty and manual classification; local routes are straight-line test corridors, not road navigation. Demo identity strings are confined to the localhost server and are not AWS credentials.

For a first native Android build with the SDK/JDK configured:

```sh
pnpm mobile:android
```

Expo generates ignored `apps/mobile/android`. A cold native build downloads substantial Gradle/NDK artifacts. The native debug APK built, installed and ran in the emulator. Camera capture/upload, draft recovery, simulated foreground GPS and offline cache were exercised; see the implementation report for exact scope. The user approved emulator testing now and physical-phone tests later.

To exercise the local loop: seed the corridor, tap a nearby map pin, capture a JPEG, upload privately, manually choose category/severity, confirm still-active and public-road consent, then submit. View the incident, route warning and provisional points. A second distinct local identity can contribute different evidence through the API tests; copied evidence and self-corroboration are rejected. Do not describe this as real independent witness evidence.

Stop the server before resetting:

```sh
pnpm demo:reset
pnpm demo:seed
pnpm local:server
```

Seed/reset refuse to run while the localhost server is listening. Reset deletes only `.local-data`; no AWS deletion path exists. With a clean seeded server, run `pnpm smoke:local` to execute the explicitly fixture-based HTTP loop.

## Local checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm synth
pnpm test
pnpm mobile:bundle
```

Infrastructure tests inspect the actual `cdk.out/JalNetDev.template.json`, so synth precedes tests. [GitHub CI](https://github.com/farhanakhtar0x66/jalnet/actions/runs/37702139384) passed the same local checks (44 tests) without AWS credentials or deployment permissions. SDK-mocked tests verify adapter behavior only. No live integration is inferred from a passed test or synthesized template.

## AWS readiness, after SSO

The intended architecture is preserved: Cognito-protected API Gateway, separate TypeScript Lambda services, DynamoDB/H3, encrypted private S3, SQS/DLQ, configurable Bedrock Nova and backend Amazon Location Routes. CDK TypeScript is the only infrastructure framework.

Do not paste or create credentials. After the existing local SSO profile is available, configure real deployment values privately. Deployment needs actual allowed model/profile ARNs (`BedrockInvokeArns`) and an image-capable Nova model/profile ID (`BedrockModelId`); there is no fabricated ARN/model default. Verify processing geography, IAM and model access before private-image use. Bootstrap/deploy have **not** run.

```sh
# Run only after SSO readiness and actual deployment/configuration:
AWS_PROFILE=jalnet AWS_REGION=ap-south-1 pnpm smoke:aws --live --image /absolute/path/to/captured.jpg
```

Without `--live`, smoke reports BLOCKED_AWAITING_SSO and exits nonzero without accessing AWS. The live command validates identity, DynamoDB write/read, private presigned S3 upload, Nova structured output and real route geometry. Deployed API/Cognito/SQS and native Amazon map assets require separate Phase 0 evidence; the script does not claim full P0 success.

For the cloud mobile build, set `EXPO_PUBLIC_PROVIDER_MODE=aws`, actual API URL, Cognito client/domain and the restricted expiring maps-only key. Blank/missing cloud configuration stays blocked. Cloud Lambda never accepts demo tokens or falls back to local storage. Tokens use SecureStore; no AWS secret key belongs in Expo configuration. `.env.example` documents configuration names; populated `.env` files are ignored. Expo reads mobile environment configuration from `apps/mobile/.env` or the launching shell, not automatically from the repository-root example. Keep server-only resource values out of public mobile configuration.

## Scope, safety and acknowledgements

Water Stress, My Water, TankerOS, IoT, video, push, alternative routes, HeatSafe and background route learning remain deferred until P0 is stable. AI cannot establish exact depth, flow, contamination, ownership or guaranteed road safety. Public incident cards exclude contributor IDs/private evidence; private-property reports do not appear publicly. The prototype raw-evidence lifecycle is 14 days, awaiting deployment verification.

Target: WeMakeDevs × AWS Environmental Hacks, Heat and Water track, October 8–11, 2026. Verify exact submission hours from the [official schedule](https://www.wemakedevs.org/aws/env/schedule) and [rules](https://www.wemakedevs.org/aws/env/rules).

The owner supplied the specification. OpenAI Codex assisted with planning, repository setup, application/backend/infrastructure code and tests. Expo's generated starter license is retained in [apps/mobile/LICENSE](apps/mobile/LICENSE); a project-wide open-source license has not been selected. Dependency and map-source attribution remains required. Aryanxp1 has write access; shubhrgunjan’s write invitation remains pending acceptance.
