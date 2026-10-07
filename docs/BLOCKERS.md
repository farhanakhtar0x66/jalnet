# JalNet prerequisites and blockers

Updated 2026-10-08, Asia/Kolkata. The user explicitly sent **START**, then authorized continuing all local work while AWS SSO is unavailable. No AWS credentials have been requested, fabricated, or stored.

| ID | Boundary | Current evidence / status | Unblock action / independent work |
|---|---|---|---|
| B-01 | Authorization / official deadline | Implementation authorized by user START. Exact organizer cutoff still unconfirmed. | Continue implementation; check organizer deadline before submission. |
| B-02 | Native Android | Project-local Node 24.21.0, pnpm 10.34.6, Corretto JDK 17.0.20.1 and Android 36 installed. Expo prebuild and Android bundle export pass. Gradle APK build succeeded (13m2s / 338 tasks); APK installed and native map shell launched on emulator. | Emulator camera capture/private localhost upload, restart recovery, simulated foreground GPS and offline cache passed. Physical camera/location/performance tests are still deferred. |
| B-03 | **BLOCKED_AWAITING_SSO** | User says SSO unavailable until tomorrow. Intended profile **jalnet**, default region **ap-south-1**. No STS/resource/deployment/model test executed. | After local SSO becomes available, use the real profile, configure actual resource/model values, deploy and execute Phase 0 smoke tests. Never ask for credentials in chat. Continue provider implementations, domain tests, synthesis and LOCAL/DEMO mobile work now. |
| B-04 | Physical target Android phone | User explicitly approved emulator now, phone later. Isolated Pixel 7 AVD using installed API 37.1 image is connected via adb. | Emulator results are LOCAL only. Real camera/location/phone acceptance remains blocked until phone availability. |
| B-05 | Upload completion contract | Resolved locally: POST /v1/reports discriminator action DRAFT or UPLOAD_COMPLETE. Owned bytes checked before ANALYZING/queue. | Execute real S3/queue tests after SSO. See D-12. |
| B-06 | Dependency/native compatibility | Pinned Expo 57.0.27, RN 0.86.3, React 19.2.3, MapLibre 11.5.0. Shared/mobile typecheck and Android bundle pass. Native Gradle APK and MapLibre emulator runtime passed. API37.1 emulator is preview software; physical target compatibility remains unverified. | Repeat the physical-phone matrix when the device is available; do not infer AWS compatibility from native local results. |
| B-07 | GitHub | Public repository reverified. Aryanxp1 permission endpoint returns write; shubhrgunjan write invitation remains pending. | shubhrgunjan accepts the outstanding invitation; no extra leader role change required. |

AWS-dependent requirements remain **IMPLEMENTED_UNVERIFIED** or **BLOCKED**, never VERIFIED. Deterministic local providers are explicitly LOCAL/DEMO: file persistence, localhost upload, uncertain/manual assessment, straight-line route geometry. They do not establish S3, DynamoDB, Cognito, Nova, or Amazon Location success. No LocalStack was introduced. The planned AWS architecture is retained.

## Integration prerequisites to verify, not current service failures

- Cognito user pool/client/issuer and real demo identity; private APIs require valid tokens and owner checks.
- Expiring restricted Amazon Location Maps key and native restrictions; key intentionally extractable and maps-only; validate style, tile, sprite, glyph requests and attribution.
- Real backend Location Routes permissions and one route response, geometry representation and limits.
- Private S3 bucket, upload state/ownership/content constraints, actual object validation and retry behavior.
- DynamoDB table/index query permissions and conditional/transactional idempotency design.
- Bedrock image-capable Nova model or inference profile available to this account/region; configurable BEDROCK_MODEL_ID; validate processing geography and exact payload limits before real evidence. Documentation availability does not establish account access.
- IAM least privilege, dev/demo separation, request/cost caps, logs excluding credentials/private media/precise trails.
- Defined raw-media retention policy and public/private-location policy for real evidence.

Do not replace these boundaries with successful-looking fixtures. If a live integration fails after START, capture its exact error with secrets redacted, update the corresponding matrix row, and continue independent authorized work. Manual classification preserves citizen reports when AI fails, but does not satisfy the live Bedrock Definition of Done.

## Out of the critical path

Local iOS builds are unavailable in the audited configuration (no full Xcode); Android is the §43 target, so this is not a P0 blocker. No project-specific iOS work or tool installation was attempted. Official public datasets, IoT hardware, supplier enrollment, payments, push notifications, alternate route avoidance and background route learning are not P0 integration prerequisites.

## Readiness boundary

No credentials are requested. Continue independent local work now. AWS access awaits the user's local SSO availability, using profile `jalnet`; physical phone testing is deferred as instructed. P0 cannot be declared complete until its actual live AWS and device Definition of Done is met.
