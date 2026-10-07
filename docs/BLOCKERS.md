# JalNet prerequisites and blockers

Audited 2026-10-08, Asia/Kolkata. The application implementation authorization gate applies to all code/resource work. The user subsequently authorized repository creation and planning-document publication before START; that action is outside this implementation gate. Other entries are prerequisites or unverified boundaries, not claims that AWS services are unavailable. No credentials or resource values have been requested in chat or printed.

| ID | Requirement / affected boundary | Evidence | Unblock action | Independent work |
|---|---|---|---|---|
| B-01 | Implementation authorization and exact official clock/deadline | No START/GO/clock-start confirmation in the user request. Planning-repository publication is separately authorized. Official schedule gives Oct 8–11 but still lacks exact hours. | User explicitly confirms START when official implementation is permitted. Verify kickoff and final cutoff from organizers/check-in notices or updated official schedule; never assume midnight. | Spec review, audit, dependency/requirement analysis and explicitly authorized planning-document publication |
| B-02 | Local Android native-build toolchain | Java 25 JRE present; `javac -version` fails. Android SDK/binaries present, adb/emulator absent from PATH. Node 26 compatibility with selected stack not checked. | After START, verify exact official build requirements; configure a compatible compiler-capable JDK, Node/package-manager pins, SDK path and selected platform/build-tools. Use a real Expo development build; EAS remains an option if selected/configured, not a proven fallback. | Contract/domain/API/infra work can proceed after START while native setup is resolved |
| B-03 | AWS account/session, IAM and live resource/model access | AWS CLI/CDK not on PATH; conventional AWS config/credentials absent. No account/STS/model/resource request executed. Other providers may exist. | User signs into the intended AWS account locally using its supported SSO/profile/temporary credential workflow; do not paste keys into chat. After START, verify the authenticated identity without exposing secrets, region, deployment IAM, Cognito, Location maps/routes and Bedrock catalog/profile access. Install project-local CDK/SDK and generic CLI only as needed after authorization. | Local pure domain/contracts/schema tests and synth design after START; mark each cloud boundary unverified until actually exercised |
| B-04 | Physical Android demo phone and native permissions | No phone connectivity or camera/location permission test performed. adb version probe failed attempting to initialize `~/.android` outside the write roots; this does not prove adb/device failure. | User makes the target phone available, enables its legitimate development/install path (USB debugging if using adb) and connects it. Configure writable Android tool state or use the approved local environment after START; then execute permission/build/device checks. | Local/backend/domain work after START; emulator evidence does not replace physical-camera/demo acceptance |
| B-05 | Upload completion API contract | §10.3 lists draft/presign/get/confirm operations but not the completion signal required by §14.1. Request/response bodies also incomplete. | Resolve U-01 in DECISIONS.md before implementing the trigger, keeping the specified routes where feasible; explicitly document any agreed contract extension. Never silently invent an endpoint. | Map, event persistence, schema/privacy rules, owned presign design, routing and pure domain logic after START |
| B-06 | Exact native/SDK library and runtime compatibility | No project dependencies or lockfile exist; documentation capabilities checked, selected package versions not proven. | After START, use current official documentation/package metadata to pin compatible versions. Native build, dependency install, SDK calls and CDK synth each need execution evidence. | No architecture switch justified; isolate provider boundaries and continue verified components after START |
| B-07 | Eventual public submission repository | Planning files are pushed to a verified private repository. The user explicitly chose "Keep private for now." | Obtain separate explicit authorization before changing visibility for hackathon submission; do not switch it automatically at START. | Private documentation and later authorized application work can continue |

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

## User action at this gate

Only explicit START/GO/official-clock confirmation is needed to authorize implementation. AWS sign-in/account readiness and a target phone will be needed for real integration/device evidence; missing readiness does not justify pretending the core is verified. Toolchain gaps and routine compatible version choices can be addressed during Phase 0 within authorized scope.
