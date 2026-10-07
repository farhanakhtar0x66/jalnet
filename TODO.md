# JalNet TODO

This checklist tracks work order. The [implementation status matrix](docs/IMPLEMENTATION_STATUS.md) is the detailed verification record, and the [implementation plan](JalNet_Implementation_Plan.md) remains the product specification. A checked planning item does not mean a product feature works.

## Planning and repository preparation

- [x] Read the complete specification, including §§97–100.
- [x] Audit the initial workspace and generic tooling.
- [x] Record P0 requirements, dependencies, decisions and blockers.
- [x] Create a planning README and phased backlog.
- [x] Preserve the supplied implementation plan in the repository.
- [x] Publish the planning commit to the owner's private GitHub `jalnet` repository and verify its contents.

## Authorization and readiness

- [ ] Receive explicit START and confirm official project-clock permission.
- [ ] Confirm organizer check-in/eligibility and exact submission deadline.
- [ ] Verify the intended AWS account/session, deployment permissions and cost controls.
- [ ] Make the physical Android demo phone available.
- [ ] Resolve the compiler-capable JDK and Android tool configuration.
- [ ] Verify and pin compatible Node, package manager, Expo, React Native and MapLibre versions.
- [ ] Choose an open-source license and record attribution requirements.

## Phase 0 — Prove risky integrations

- [ ] Create only the minimum application workspace/contracts needed for the proof.
- [ ] Install and start an Expo development build on the target phone.
- [ ] Render real Amazon Location maps through MapLibre, including all assets and attribution.
- [ ] Test foreground location and chosen-area fallback after permission denial.
- [ ] Prove Cognito-protected API Gateway/Lambda access and owner isolation.
- [ ] Complete a real DynamoDB write/read.
- [ ] Upload a real phone image privately to S3 and validate the actual object.
- [ ] Invoke an available configurable Nova model/profile with an image and validate its output.
- [ ] Calculate one real Amazon Location route through the backend.
- [ ] Record each command/response/device result; keep failures visible at their boundary.

## Phase 1 — Application foundation

- [ ] Initialize the application package workspace and shared strict Zod contracts.
- [ ] Establish pure domain/geo functions and provider/repository interfaces.
- [ ] Create CDK TypeScript core infrastructure with least-privilege roles.
- [ ] Build map-first navigation, center capture action and working layer controls.
- [ ] Separate TanStack Query server state from Zustand UI state.
- [ ] Establish configuration examples, canonical errors and redacted observability.

## Phase 2 — Events

- [ ] Persist reports/events with distinct time, confidence, impact and severity semantics.
- [ ] Implement bounded H3 viewport lookup with exact filtering and result caps.
- [ ] Render clustered backend incidents with readable detail/provenance.
- [ ] Create disclosed deterministic demo seeds and scoped reset behavior.

## Phase 3 — Reporting

- [ ] Build real JPEG capture, compression, accuracy disclosure and editable incident pin.
- [ ] Persist local drafts and implement owned short-lived upload requests.
- [ ] Resolve upload-complete request semantics before implementing the analysis trigger.
- [ ] Validate uploaded media and run async Nova assessment with strict schema checks.
- [ ] Limit retry to one and preserve manual classification when analysis fails.
- [ ] Require editable human confirmation before publication; guard every state transition.

## Phase 4 — Fusion and trust

- [ ] Implement configurable neighboring-cell candidates and conservative fusion.
- [ ] Define numeric severity/unknown mapping and robust aggregation.
- [ ] Separate model confidence from system evidence and verification.
- [ ] Support basic independent confirmation without self-verification.
- [ ] Preserve contradictory observations, monitoring, resolution and expired history.
- [ ] Make submission idempotent and refresh events, route risks and profile caches.

## Phase 5 — Saved routes and warnings

- [ ] Build manual origin/destination selection and backend route preview.
- [ ] Persist private route geometry, corridor, name and alert preference.
- [ ] Implement H3 corridor candidates plus exact event-to-segment intersection.
- [ ] Show the affected route and actionable warning with truthful uncertainty wording.
- [ ] Delete route geometry and cancel route warnings when the user removes it.
- [ ] Keep Alternative unavailable until a functioning P1 flow exists.

## Phase 6 — Droplets

- [ ] Define relevant/provisional versus verified/usefulness eligibility and caps.
- [ ] Implement immutable ledger entries with an atomic idempotency guard.
- [ ] Test replay/concurrency, duplicate farming, self-confirmation and reversals.
- [ ] Update profile impact from actual accepted contributions; keep cosmetic rank separate from trust.

## Phase 7 — Reliability and P0 acceptance

- [ ] Verify empty/loading/error/stale/offline behavior and durable draft recovery.
- [ ] Measure target-device launch/map/camera performance and viewport API/payload budgets.
- [ ] Check accessibility, English copy keys, uncertainty and provenance.
- [ ] Run formatter, lint, typecheck, unit/contract/integration tests, CDK synth and relevant builds.
- [ ] Configure CI without broad pull-request deployment credentials.
- [ ] Complete the physical-device permission/network/AI/duplicate/layers/route test matrix.
- [ ] Reset and execute the real critical path five consecutive times.
- [ ] Compare every P0 requirement with actual evidence before declaring completion.
- [ ] Freeze architecture only after §100 criteria pass.

## Submission

- [ ] Update README with executed development/deployment/test/demo commands and real limitations.
- [ ] Add architecture, privacy, sources and demo-script documentation.
- [ ] Review tracked files and recordings for secrets/private data.
- [ ] Disclose seeded/simulated behavior and all AI coding tools used.
- [ ] Record a video under three minutes that shows the core loop and AWS.
- [ ] Test public repository and YouTube access in a signed-out browser.
- [ ] Obtain explicit authorization before changing the repository from private to public for submission.
- [ ] Submit the write-up before the verified official deadline and retain the receipt.

## Only after P0 acceptance

- [ ] Evaluate Water Stress with provenance, coverage and missing-weight normalization tests.
- [ ] Evaluate clearly labeled simulated My Water with forecast/baseline/anomaly tests.
- [ ] Evaluate labeled demo tanker quotes/reservations without payments.
- [ ] Consider official alerts, video, push and route alternatives if stable.
- [ ] Keep background learning, HeatSafe, advanced DrainScan, dispatch optimization, hardware, municipal integrations and predictive models outside the core critical path.
