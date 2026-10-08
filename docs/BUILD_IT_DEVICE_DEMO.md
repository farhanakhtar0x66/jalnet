# Local Build It: Android handoff and judge demonstration

Prepared 2026-10-08. Cedar authorization is frozen at **9422fc2**; no authorization, policy or AWS architecture change is part of this increment. The target phone installed/launched and completed a real-camera LOCAL/DEMO report → warning → +2 flow. **Remaining physical acceptance and final recording are pending.** Live AWS remains **BLOCKED_AWAITING_SSO**. This local demonstration does not declare hackathon eligibility or P0 completion.

The owner accepted the physical milestone at **087a225** and initially froze local features. The later Build It strategy authorizes the narrow My Water/Water Stress/vision increment and assigns visual design to Aryan, testing/product/recording/submission to the owner. Cedar remains frozen9422fc2. See the [feature matrix](FEATURE_STATUS.md), [UI handoff](ARYAN_UI_HANDOFF.md), [actual acceptance log](PHYSICAL_ACCEPTANCE.md), [five-rehearsal checklist](FIVE_REHEARSALS.md) and [submission assets](BUILD_IT_SUBMISSION_ASSETS.md). Owner-reported permission review does not invent detailed device-case results. AWS SSO is only a future cloud gate, not the primary-submission dependency.

## Read-only audit and compatibility boundary

The existing debug development APK is `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`, package `org.jalnet.mobile`, version 1.0.0. Executed APK inspection found min SDK 24 (Android 7.0 install floor), target SDK 36 and native libraries for arm64-v8a, armeabi-v7a, x86 and x86_64. This is artifact evidence, not proof that a particular phone works. Expo Go cannot load the native MapLibre module; this APK requires a running Metro server and USB forwarding. It is not an offline standalone submission build.

The audit found an emulator-only upload address, `10.0.2.2`. The explicit USB preset now uses `127.0.0.1` for both the mobile API and upload grants through adb reverse; the server still listens only on computer loopback. The emulator preset retains `10.0.2.2`. Both initialize the same mandatory Cedar local composition.

The mobile camera implementation requests no audio, resizes a capture to a maximum 1,280-pixel edge, recompresses JPEG, strips EXIF and rejects an image above 3.75 MB. The owner staged a harmless test object; its real phone capture uploaded as a 960×1,280 JPEG, **57,357 bytes**, with no EXIF marker, and persisted a validated media hash. No real water hazard was established. Existing emulator evidence covers restart/cache and simulated GPS; varied images, foreground real location, denial/recovery, performance and accessibility on the target phone remain to be measured.

Physical testing also exposed a countries-only demo style with no useful street detail. The local style now uses [OpenFreeMap Liberty](https://openfreemap.org/quick_start/), supported by the existing MapLibre Native client; street assets rendered on the phone. No package/framework was added and the AWS Maps branch is unchanged. Native attribution remains enabled; add **OpenFreeMap · © OpenMapTiles · Data from OpenStreetMap** to the recorded credits as required by the [source's attribution guidance](https://openfreemap.org/#attribution). Public map assets need internet and reveal viewed tile areas to their provider; see [privacy](PRIVACY.md). Route geometry is still a demo line, even when streets appear underneath.

## Exact USB setup

Run from the repository root on this prepared Mac. Do not paste phone serials, coordinates, private pictures, tokens or environment contents into public evidence.

```sh
export PATH="$PWD/.tools/node_modules/.bin:$PATH"
export ANDROID_USER_HOME="$PWD/.tools/android-user"
export JALNET_ADB="$PWD/.tools/android-sdk/platform-tools/adb"
"$JALNET_ADB" devices -l
```

The owner connects a data-capable USB cable, unlocks the phone, enables Developer options → USB debugging and accepts this computer's RSA prompt. Select the phone's USB data mode if required. Proceed only with exactly one physical phone in state `device`; `-d` below selects a physical device rather than an emulator. For multiple phones, privately select the intended serial; never operate an arbitrary device. An `unauthorized` entry requires the owner to approve the prompt; an empty inventory requires checking cable/USB mode/debugging. Do not disable Android install protections.

If the JalNet package is absent or this prepared development build needs installation:

```sh
"$JALNET_ADB" -d install -r apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
"$JALNET_ADB" -d reverse tcp:8787 tcp:8787
"$JALNET_ADB" -d reverse tcp:8081 tcp:8081
```

`install -r` preserves application data. A signature mismatch or OEM install prompt is a stop for owner review, not permission to uninstall, erase data or turn off a protection. Forwarding must be repeated after USB reconnect/reboot.

In separate terminals:

```sh
pnpm local:server:usb
```

```sh
pnpm mobile:start:usb
```

Then open the installed development client:

```sh
"$JALNET_ADB" -d shell am start -a android.intent.action.VIEW -d 'jalnet://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081' org.jalnet.mobile
```

Confirm the actual screen says **LOCAL / DEMO · No live AWS services** before any capture. These presets explicitly override provider mode/API in the launching shell, leaving an existing ignored AWS `.env` intact. They never silently switch a running cloud app. If the API or Metro port is already occupied, inspect the process and stop only the known JalNet process you started. Never start two competing local transports or kill an unrelated listener.

For emulator-only rehearsal, use `pnpm local:server` and `pnpm mobile:start:local`; do not mix that upload host with the USB phone preset. No LAN binding or tunnel is needed.

## Exact deterministic reset, seed and rehearsal

1. Complete or discard only unwanted **test** drafts through the app. Preserve wanted private drafts and account-scoped caches; do not run `pm clear` or uninstall on the physical phone. A server reset invalidates server references in retained drafts, so do not reset during a wanted pending report.
2. Stop only the known local API with Ctrl-C. Confirm `lsof -nP -iTCP:8787 -sTCP:LISTEN` has no listener. Reset/seed refuse while it is running.
3. Run `pnpm demo:reset`, then `pnpm demo:seed`, then `pnpm local:server:usb`. Reset affects only ignored `.local-data`; seed creates one Alice LOCAL/DEMO straight-line corridor, no observations/events/rewards. Leave Metro in explicit USB-local mode.
4. Relaunch/refresh the app, use its working retry/refresh actions and verify zero droplets/no current reports before the take. Old client cache may appear with age until refreshed; it is not a clean-server result. Alice is the fixed localhost demo identity; no Cognito account is used.
5. Tap a demo pin near (28.6139,77.209), intersecting the seeded corridor (28.6139,77.205 → 77.215). For this scripted local take, aim the real camera at a safe staged water scene/prop. Disclose the **staged scene and synthetic Delhi pin** before confirmation; add a note saying it is a local staged demonstration. This does not represent a real incident at that pin. Keep people, identifiers and private addresses out of view.
6. Capture → upload privately → read the manual/uncertain assessment → choose Waterlogging and qualitative severity 2 → explicitly confirm still-active/public-road demo inputs → submit. These inputs exercise a local simulated public-road observation; they are never sent to AWS. Expect one UNVERIFIED citizen incident, **+2 provisional droplets**, a warning on the seeded corridor and a matching ledger entry. Do not promise a safe alternative route. If a route check has aged, use **Refresh route reports** inside Routes (or Retry connection on the map); wait for a fresh check before showing the warning.
7. Show route risk and profile. Successful confirmation automatically clears its local draft/image; if an interrupted completion left an already accepted local copy, use Finish / clear submitted draft. Repeat steps 1–6 for each clean timed take. Record actual durations and failures privately. Five successful **physical UI** rehearsals are still pending; repeated HTTP fixtures do not satisfy this gate.

Before each expanded take, open **My Water → Reset My Water demo fixture → Reset tank only**. Expect capacity 1,500 L, SIMULATED level 60%, DEMO FIXTURE consumption 300 L/day, 900 L remaining, approximately 72 hours, day 0 and Saved on this device. This resets only the current account's tank row; reports/drafts/route/cache/ledger stay intact. One simulated day must give 600 L / 40% / 48 hours / day 1. Reopen to check persistence, then reset the tank again. For Stress, tap **Restore Water Stress DEMO inputs** (or close/reopen the sheet): expect DEMO INDICATOR 60/HIGH, 100% coverage. Clearing supply and groundwater must show 55% coverage and no headline score; reset afterward. These new-screen steps are owner physical acceptance tasks; the emulator result is not a Redmi pass.

`pnpm smoke:local --isolated` can verify the fixture workflow without touching the active phone API, `.local-data` or private drafts; it creates and cleans its own temporary state/server. `pnpm smoke:local` is a separate bounded fixture rehearsal and requires the clean seed before it runs. It produces two distinct synthetic JPEG reports, one fused event and Alice 10/Bob 7 droplets through actual local HTTP. Bob is a test-client identity; this is not a second independent citizen. Reset/reseed again before the one-camera interactive story. Do not combine a smoke's seeded outcome with a claim that the displayed phone capture created it.

## Cedar proof without changing the frozen implementation

Before filming, execute these existing commands with the pinned runtime:

```sh
pnpm exec vitest run tests/cedar-authorization.test.ts tests/cedar-http.test.ts --reporter verbose
pnpm cedar:check
```

The two suites contain 40 real-engine tests, including actual HTTP owner allow, foreign deny and explicit owner forbid across ReadReport, PresignReport, CompleteUpload and ConfirmReport. Denied HTTP operations assert unchanged persisted state, no upload grant/evidence read/worker call, no mutation/incident/award. Tests use a separate test-only forbid policy; the deployed local permit remains unchanged. A real evaluation error also returns a redacted 503 with no effects. The public proof is sanitized test names/results and the checked-in policy, never live authorization headers or private URLs. Initialization failure prevents the local server listening; there is no permissive fallback.

Production policy permits those four actions only when `resource.owner == principal`. The principal comes from the trusted localhost authentication boundary and ownership from persisted repository data; the existing ownership comparison remains. Cedar authorizes; fixed localhost demo identity authenticates. The camera workflow uses this same mandatory composition. No claim that Cedar is deployed in Lambda is permitted.

## 2 minute 50 second script and shot list

These are planned timings, not a measured physical rehearsal. Leave 10 seconds below the strict three-minute limit. Use transparent cuts for loading/time-consuming taps; do not replace a current result with another take without disclosure. Final recording still requires owner approval. Preserve the core story; omit vision/stress shots before rushing the camera or Cedar proof if actual timings exceed the budget.

| Time | Shot | Suggested narration |
|---|---|---|
| 0:00–0:10 | Phone, LOCAL/DEMO banner and attributed street map | “JalNet connects water observations, route warnings and household planning. This Build It prototype runs locally with real Cedar authorization.” |
| 0:10–0:50 | Synthetic pin; staged real camera capture, private upload, manual review/consent and submit | “This scene is staged and the pin synthetic. Evidence stays private; no local image model runs. I classify and explicitly confirm this demo report.” |
| 0:50–1:10 | UNVERIFIED incident, fresh seeded-corridor warning, profile+2/ledger | “One report remains unverified. The actual intersection check warns on this demo line, not a calculated road route. This is a provisional+2 contribution, not a safety guarantee.” |
| 1:10–1:40 | My Water reset fixture, inputs/source labels, one simulated day | “These inputs are entered or simulated, with no meter. The calculator gives900L and72h; simulate one day and it gives600L and48h. It assumes constant300L daily use and no refill; changes persist locally.” |
| 1:40–2:00 | Water Stress DEMO60/HIGH, contributing weights, limited-data example | “This indicative area score is computed from fictional pressures. The factors and weights are inspectable; missing data is renormalized and low coverage suppresses the score. It is not an official measurement.” |
| 2:00–2:10 | TankerOS DEMO cards and HeatSafe PLANNED card | “Supplier names/prices are sample previews. No tanker, payment or contact occurs. HeatSafe is a future concept.” |
| 2:10–2:35 | Frozen permit and sanitized actual-engine HTTP owner/foreign/forbid results | “AWS-origin Cedar is mandatory before private-report access. Real HTTP tests allow the owner, deny another identity and use a test-only forbid to deny the owner, with zero effects.” |
| 2:35–2:45 | Local architecture then preserved future AWS frame | “Cedar runs in our local Node API. The future Cognito/S3/Nova/Location path is preserved and unverified; it is not needed for this local Build It demonstration.” |
| 2:45–2:50 | Repo, map/license/Codex credits and uncertainty | “Working logic, simulations and planned features are labeled separately. Source, licenses and Codex assistance are disclosed.” |

The current [official rules](https://www.wemakedevs.org/aws/env/rules) require a public repository, an under-three-minute public/unlisted YouTube demo, a short write-up, visible AWS integration and AI-tool disclosure. Eligibility, registration/check-in, student verification and original-work timing still need team review. The [schedule](https://www.wemakedevs.org/aws/env/schedule) currently lists October 8–11 but leaves exact opening/submission hours to announcement; confirm these with organizers. Preserve actual Git history. No eligibility claim or final recording/upload has been made.

Suggested submission write-up: “JalNet helps citizens document water-related observations and see where current reports intersect saved routes. Our local Android prototype supports private camera drafts, human confirmation, conservative incident handling and an idempotent contribution ledger. AWS-origin Cedar 4.13.0 provides mandatory private-report authorization with real owner/foreign/forbid HTTP proof. Local identity, file storage, manual analysis and straight-line route data are explicitly demo implementations. The planned AWS cloud architecture remains implemented but unverified while SSO is unavailable. Codex assisted implementation and testing; MIT project and Apache-2.0 Cedar notices are retained.” Attach only evidence actually completed at submission time.

## Real versus LOCAL/DEMO

| Boundary | Judge disclosure |
|---|---|
| Android/camera | Real Redmi install/launch/capture/private local upload executed; remaining device matrix pending. No real hazard established by the staged test object. |
| Cedar | Real pinned Node24 WASM engine, strict schema/policy and mandatory HTTP decisions; test-only forbid proof explicitly identified. |
| Identity / persistence / upload | Fixed localhost Alice, private local files/JSON and HTTP upload; no Cognito, DynamoDB or S3 execution. |
| Assessment | Deterministic uncertainty/manual classification; no Nova invocation. |
| Location / map / route | Staged scene and synthetic pin for this take, public OpenFreeMap/OpenMapTiles/OpenStreetMap assets, seeded straight-line corridor; no Amazon map/road-route claim. Real GPS is a separate device test. |
| Incident / warning / droplets | Actual existing domain logic over disclosed demo input; single report unverified/+2 provisional; fixture fusion 10/7 is a separate HTTP proof. |
| My Water | Actual input arithmetic, one-day simulation and local persistence; per-field USER-ENTERED/DEMO FIXTURE/SIMULATED source. No IoT/live meter, refill feed or guaranteed forecast. |
| Water Stress | Actual weighted calculation over fictional editable sample pressures; DEMO INDICATOR, missing-weight coverage and limits. No official/live measurement or private-tank/route coupling. |
| TankerOS / HeatSafe | Fictional noninteractive supplier/price/volume preview; reservation not implemented, no booking/payment/contact. HeatSafe and predictive ideas PLANNED. |
| AWS frame | Future cloud architecture only, IMPLEMENTED_UNVERIFIED / BLOCKED_AWAITING_SSO. Local Cedar proof cannot promote these statuses. |

## Failure fallback and exact owner participation

If phone installation/camera fails, stop that acceptance task and keep the exact sanitized error. A labeled emulator/HTTP rehearsal remains usable but cannot establish real-device/camera evidence. Camera denial must leave the close/settings path usable; the owner accepts or denies permission. Location denial should preserve the chosen-pin flow; no mock GPS is used on the phone. API/upload failures preserve the draft for retry; stale captures must be retaken. Public basemap outage may be explained using the tested cached/chosen-area state, without claiming that a currently blank map rendered. Do not film a successful take hiding the failure as a live result.

If cloud deployment fails, stop dependent AWS actions, preserve `.cutover/`, the real mobile `.env`, local files and drafts, and restart Metro deliberately with `pnpm mobile:start:usb` plus the USB-local API. Confirm the LOCAL/DEMO banner. No automatic fallback, cloud fixture injection, data deletion, permission weakening or additional framework is needed. The separate [AWS runbook](AWS_DEPLOYMENT_RUNBOOK.md) starts with the guarded identity check; SSO remains blocked.

The owner/team must:

1. Connect/unlock/authorize the physical phone; approve any Android installation prompt and provide its camera scene. Keep the USB cable attached during this development-client demo.
2. Aim the camera and deliberately accept/deny camera and foreground-location prompts. Check actual location/approximate/denied behavior without sharing precise private coordinates. Confirm privacy and wanted-draft preservation before any clean rehearsal reset.
3. Check readable text, touch targets, system insets, map/camera responsiveness, restart recovery and capture/upload on the actual phone with us. Approve only redacted evidence for documentation.
4. Complete five timed physical rehearsals; then narrate/record the final under-three-minute take when device/submission gates pass. No final recording is created by this preparation.
5. Review eligibility, student verification, registration/check-in, kickoff/original-work timing and deadline; publish the final video/write-up and submit through the official form. This preparation does not send organizer messages or submit on the team's behalf.
6. Later complete local AWS SSO and privately approve the exact account/role for Ship It. Never provide credentials in chat. The first command is `aws sts get-caller-identity --profile jalnet`; stop on mismatch.

### Physical acceptance record

| Task | Current result |
|---|---|
| Target phone model / Android version / ABI | Redmi Note 9 Pro Max; phone reports Android 16 / API36, arm64-v8a + 32-bit ARM; physical size 1080×2400. No serial retained in public evidence. |
| Install / launch / explicit LOCAL banner / native map | PASS locally: existing debug APK installed with `-r`, both ports reversed, development client launched; explicit LOCAL banner and OpenFreeMap street assets rendered. |
| Real camera / JPEG limits / EXIF removal / private upload | PASS for one owner-staged harmless object: 960×1280 / 57,357-byte JPEG, no EXIF marker; local validated hash and NEEDS_CONFIRMATION observed. Varied captures/denial matrix pending. |
| Foreground real/approximate/denied location and chosen pin | Pending owner permission participation. |
| Full physical report → incident → route warning → +2 ledger | PASS for one staged local flow: owner confirmed Waterlogging; persisted ACCEPTED report, UNVERIFIED event and one REPORT_SUBMITTED +2 ledger entry; map warning and phone profile displayed. No independent corroboration claim. |
| Route-sheet usability | PASS locally: Refresh route reports produced a fresh result on the physical phone; route-name placeholder now visibly readable. No report/route mutation by the refresh check. |
| Restart draft recovery / API-offline retry / remaining device usability | Pending physical execution; prior emulator/local failure tests retained. Native attribution is enabled; opening its credits control and recorded-video credits still require review. |
| Five timed UI rehearsals / final video | Pending; no final recording. |

Update this record only from executed evidence with the tested commit, time and redacted device details. AWS and Cedar-in-Lambda gates remain separate.
