# JalNet decisions and unresolved specification details

Planning record: 2026-10-08, Asia/Kolkata. No implementation has begun. Section references point to the supplied implementation plan unless explicitly labeled as the pasted user request.

## Planning decisions within the authorized scope

### D-01 — Respect the implementation gate

The initial pasted request §§3–4 and 21 explicitly permits audit/planning documents and requires waiting for START. The plan header and §§7,46,94 prohibit pre-clock code/repository creation/provisioning. The initial audit therefore created only the three requested planning documents. The calendar date and website countdown do not supply user authorization.

The subsequent user instruction explicitly authorizes creating the owner's GitHub repository `jalnet` and publishing the existing planning work, README and TODO before START. This supersedes the earlier repository-creation restriction only for documentation publication: initialize Git and publish a planning-only commit, preserve the source plan unchanged, and record the exception transparently. It does not authorize application code, project dependencies or AWS infrastructure. Use the verified owner's GitHub noreply identity for commits rather than publishing their personal email.

Automatic approval review rejected the proposed public create-and-push action because publication had been authorized without explicit authorization for public disclosure. No public repository was created. The safe alternative created a private repository, and the user then explicitly instructed "Keep private for now." This instruction governs visibility; the eventual public hackathon-submission requirement remains deferred until separate authorization. GitHub metadata and the initial remote file tree were verified after the private push.

### D-02 — Preserve the selected architecture

Use React Native/Expo/TypeScript development builds, MapLibre + Amazon Location dynamic maps, TanStack Query for server state, Zustand for UI state, shared Zod schemas, API Gateway HTTP API + TypeScript Lambda, DynamoDB + H3, private encrypted S3, Cognito, and configurable Bedrock/Nova (§§6,31,37,77,79,97–98). Choose CDK TypeScript as the single infrastructure framework because this workspace has no existing selection. Propose pnpm workspaces per §7; pin compatible versions after verification, without adding Nx/Turborepo. P0 image only; point + semantic radius; routes calculated in the backend. No model ID is selected yet.

### D-03 — Scope and ordering

The dependency graph in the status document expands §45: route risk requires both persisted route geometry and created/fused current events; useful awards require verification/eligibility and ledger atomicity. Run §99 dependency proofs before elaborate UI, then the user's phases 1–7. This reconciles the early Bedrock/route proof in §99 with full feature integration later in §46. Keep the 30-minute smoke-test target as a diagnostic intention, not a completion estimate. Freeze only after §100 evidence exists.

### D-04 — Authentication exceptions do not bypass Cognito

§6.8 allows a deterministic development demo account if auth threatens the timeline; §97.1 explicitly requires Cognito protection for reports, routes, profile and other private data. Use a real Cognito-backed demo identity through the same authorizer and owner checks. Do not ship an unauthenticated hardcoded-user bypass or client secret. Actual sign-in/token storage implementation must be verified against current Cognito/Expo documentation after START.

### D-05 — Separate mobile map access from private API access

§31.8 public-environment caution is qualified by §97.2: an intentionally extractable, expiring, action/resource/client-restricted Amazon Location map key may be bundled; AWS secret access keys cannot. Tiles/style requests go directly to Location; `/v1/routes/preview` goes through Cognito-protected JalNet Lambda. Map key receives no route actions if routes are backend-owned. Test native client restrictions plus all dependent asset requests on device before considering the map proven.

### D-06 — Rewards follow accepted usefulness, never file count

§16.2 gives example submission/first-report awards and §35.10 shows +2 provisional on submission, while §§2.6,94.7 and user §§5,9,16 demand accepted, independently useful evidence. Treat the example schedule as configurable, not an unconditional upload entitlement. Provisional +2 can apply only after a confirmed report is accepted as relevant and non-duplicate, with caps; meaningful verified/impact awards wait for independently supported usefulness. Record provisional versus verified eligibility explicitly before implementing the ledger. AI failure does not make a report ineligible; manual reports use the same acceptance/verification path. No exact final award schedule is claimed as a specified constant.

### D-07 — Include basic independent verification in P0

§5 calls confirmation of another report P0 preferred, while §§0.2,46 list second-user verification as P1. Include the small existing `/v1/events/{eventId}/confirm` capability and no-self-confirmation/proximity checks from §§10.2,30.6 in P0 to substantiate verified rewards and provenance. Defer the broader verification experience. An independently seeded observation must be labeled as a demo fixture and cannot be presented as real live corroboration.

### D-08 — P0 warning does not require alternate routing

§35.4 shows an Alternative button and §§0.3,63 mention alternatives in the narrative; §§17.3,67 explicitly make hazard-avoidance routing P1 and §69 requires only intersection/warning. Implement the affected route/incident warning first. Hide or clearly disable Alternative until a real provider-backed P1 flow works. Do not publish a dead control or use guaranteed-safety wording.

### D-09 — Keep the exact media contract and human boundary

§26.2 proposes a DrainScan obstruction class absent from the exact §8.3 assessment enum. Use §8.3 unchanged for P0; do not silently add `SEVERE_VISUAL_OBSTRUCTION`. §0.3's demonstration `HIGH` is the media severity enum; event severity is numerical (§8.1), and verification is separate (§86). A deterministic documented severity mapping/unknown policy is needed before fusion; the plan supplies a rubric but no complete numeric mapping. AI cannot independently publish critical status (§14.3).

### D-10 — Keep original evidence private, omit public photos initially

§6.7 suggests a sanitized preview; §§31.4,35.5 make public preview optional and permit reporting without public media. For P0, public cards can omit photos entirely. Keep owned original evidence private and never expose original EXIF, reporter identity, private routes, or home/tank coordinates. A later preview path must actually sanitize metadata before use, with appropriately short-lived access.

### D-11 — Demo disclosure and seed scenarios

§42.1 initially has no waterlogging at the capture location, whereas §42.2 also offers a pre-seeded unverified incident. They are alternative scenarios. Prefer a no-waterlogging starting state with a live camera-created incident and a second real account corroborating when available. If using the alternate seeded support scenario, disclose the fixture in the README/demo and do not describe it as a live witness. §44.2's recording-only AI fixture is an emergency visibly labeled mode; it never satisfies §69's live Bedrock requirement. The stricter live-core requirement in the pasted request governs P0 acceptance.

## Unresolved contract/storage details to settle before their implementation

These are design gaps, not permission to invent specified endpoints/fields. They do not block independent work after START.

| ID | Exact sections | Gap and required resolution |
|---|---|---|
| U-01 | 10.3 versus 14.1, 41.1 | The narrative requires draft creation then upload-complete notification, but the listed routes have no explicit completion operation or request bodies. Agree/document the request semantics using the specified API surface, or obtain authorization for an extension. No new endpoint is silently assumed here. Validate object ownership/content before enqueueing; repeated completion must not repeat analysis. |
| U-02 | 9.1 versus 30.7, 59 | DynamoDB TTL is listed, but event expiry must retain history. Separate logical `expiresAt` from physical deletion. Do not attach destructive TTL to canonical event metadata unless an explicit history-preservation/archive policy is defined; reserve TTL for genuinely temporary records where appropriate. |
| U-03 | 9.4 versus 8.5, 82 | A ledger idempotency GSI alone does not specify an atomic uniqueness guard. Define a conditional primary-key guard/transaction before implementation; do not assume an index makes concurrent awards unique. Validate the exact AWS transaction syntax against current official docs. |
| U-04 | 8.1 versus 15.4, 35.5, 89 | `VERIFIED` is public provenance, not a declared EventStatus. Define the threshold/evidence policy behind ACTIVE + Community verified without adding an undocumented status. Keep contradictory/stale observations MONITORING; distinguish clearance from natural expiry. |
| U-05 | 8.2, 41.1 versus 14.5, 33, 36 | Server report states and local sync states differ; failed AI still needs NEEDS_CONFIRMATION/manual entry. Document the fallback/retry transition table so upload/analysis failures retain drafts and cannot bypass confirmation. |
| U-06 | 8.1, 8.3, 14.3, 15.1–15.4 | Numeric severity mapping, unknown/manual assessment, confidence threshold, radius, expiry durations and example merge threshold need one deterministic configuration. Preserve qualitative uncertainty and conservative separate-event behavior; examples are not scientific constants. |
| U-07 | 38 versus 68, 97.2 | The early environment list omits later kill switches and the restricted public map key. Later sections supplement it; consolidate the contract in `.env.example` after START without inventing credential names/values. |
| U-08 | 81 | The example error uses REPORT_MEDIA_INVALID but that code is absent from the canonical list. Use the canonical MEDIA_ANALYSIS_FAILED or VALIDATION_FAILED as appropriate unless an explicitly documented extension is agreed. |
| U-09 | 10 prefix versus 39.3 | §10 prefixes application routes with `/v1`; §39 explicitly shows `/health`. Keep `/health` as the documented operational exception; do not silently rename it. |
| U-10 | 31.4, 50, 59, 60 | Raw-media retention is configurable but no duration is fixed. Define a bounded prototype policy and deletion behavior before retaining real evidence; retain public incident history when independent evidence supports it. |

## Official documentation checked on 2026-10-08

These checks establish documented capabilities, not account access, deployment success, or selected version compatibility. Recheck exact SDK/package APIs and versions when implementing.

| Topic | Finding | Primary source |
|---|---|---|
| Event rules | Work begins at event opening; planning allowed. Public repository, short YouTube demo, write-up, AWS shown in video, and AI tool attribution required. No inference of explicit user START from this page. | [Rules](https://www.wemakedevs.org/aws/env/rules) |
| Schedule | Oct 8–11; exact kickoff/session/deadline hours still described as being finalized. No exact end time inferred. | [Schedule](https://www.wemakedevs.org/aws/env/schedule) |
| MapLibre | Official Expo setup requires native rebuild/config plugin and says Expo Go cannot use the package. | [Expo setup](https://maplibre.org/maplibre-react-native/docs/setup/expo/) |
| Map style | Monochrome dynamic style and MapLibre style specification documented. | [Map styles](https://docs.aws.amazon.com/location/latest/developerguide/map-styles.html) |
| Location authentication | API keys support bounded map/place/route access with expiry and web/Android/Apple client restrictions; native examples documented. Actual React Native asset/key restriction behavior is unverified. | [API keys](https://docs.aws.amazon.com/location/latest/developerguide/using-apikeys.html) |
| Location region | Mumbai endpoints for Maps/Places/Routes documented. | [Endpoints](https://docs.aws.amazon.com/general/latest/gr/location.html) |
| Routes V2 | CalculateRoutes API documents avoidance-area geometry including bounding boxes/corridors/polygons. Exact SDK calls/encoding and configured account requests remain unverified; avoidance remains P1. | [CalculateRoutes](https://docs.aws.amazon.com/location/latest/APIReference/API_CalculateRoutes.html) |
| Nova | Nova 2 Lite documents image input and Converse. Mumbai is listed for global inference, not in-region/geo inference for this model. Native structured outputs are marked unsupported: use prompting, JSON parsing and shared schema validation with one retry/manual fallback. Account/profile/IAM/image-payload limits remain unverified. | [Nova 2 Lite](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html) |
| Foreground location | Official foreground permission and one-time location APIs documented; no background collection required for P0. | [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) |
| Camera | Official camera permissions/capture documentation checked; exact API/version/compression/file upload path to pin later. | [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) |
| Development environment | Expo documents development builds for custom native modules and recommends physical-device development. Platform-specific version compatibility still requires checking before tool changes. | [Expo environment](https://docs.expo.dev/get-started/set-up-your-environment/) |

Nova global inference does not promise processing only inside Mumbai. Verify the actual configured profile's processing geography and IAM requirements before sending real private media; do not imply India-only residency. No SDK method, model selection, or successful integration is inferred from a documentation table.

Future verification work after START: compatible Expo/React Native/MapLibre versions; Node/JDK/Gradle/Android toolchains; Location native asset authentication and attribution; routes geometry precision/encoding; AWS SDK v3 and CDK constructs; Cognito token/authorizer flow; presign plus post-upload inspection; DynamoDB concurrency/transactions; H3 cell coverage at route/bbox edges; Nova media limits/profile access/retry/latency. Official external-data endpoint/terms/freshness verification stays deferred with P1.
