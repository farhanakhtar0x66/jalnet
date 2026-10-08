# Redmi final acceptance record

Started 2026-10-08, Asia/Kolkata. The owner accepted the physical-phone milestone and froze local features at **087a225** and Cedar authorization at **9422fc2**. This pass is limited to physical acceptance, demonstration/submission preparation and minimal fixes for observed defects. Live AWS remains **BLOCKED_AWAITING_SSO**; no local result verifies a cloud boundary or completes P0.

## Evidence rules and preservation

Guide the owner through **one action/test at a time**, then stop for their interaction. Record PASS/FAIL only from an observed device result or an explicit owner report; identify which. Setup performed is not proof of the behavior under test. An expectation below is not a result. Retain failed attempts and their fixes/retests rather than overwriting them with a success.

Each result needs test ID, tested commit/worktree changes, Asia/Kolkata date/time, owner/agent observation, exact sanitized behavior and evidence reference if available. Record no device serial, precise real coordinates, private scene, credential, signed URL or unrelated app content publicly. Any phone capture must be confined to JalNet with the owner's cooperation; keep sensitive evidence in ignored local storage, not Git. Do not invent evidence paths for captures not yet made.

Keep API8787, Metro8081 and adb reverse intact. Do not reset `.local-data`, clear app storage, uninstall, discard wanted drafts or change AWS configuration for these tests. Check for an existing draft before camera tests. If a wanted draft occupies the capture flow, preserve it and defer tests requiring a fresh capture until the owner has finished it. Permission changes must happen when capture/upload is idle. Before controlled API-offline tests, identify the known JalNet server, preserve its state and restore that same USB-local composition afterward; keep Metro/USB/internet running.

The previous [physical milestone](BUILD_IT_DEVICE_DEMO.md#physical-acceptance-record) remains historical evidence: one real staged JPEG/private local upload/confirmation/unverified incident/warning/+2 ledger and route refresh. It is not a repeat of the remaining tests below. The 111-test suite last passed on the accepted revision; preserve that baseline.

## Current preflight evidence

Recorded 2026-10-08, 13:47 IST. These are agent-observed connection/repository checks, not physical permission/offline/accessibility passes.

| Check | Actual observation | Status |
|---|---|---|
| Repository | `git status --short --branch`: clean main tracking origin/main before documentation preparation | PASS, read-only preflight |
| Phone | adb inventory: one authorized Redmi Note 9 Pro Max in state device; serial withheld | PASS, connection only |
| Existing USB-local processes | Listeners observed on computer loopback API8787 and Metro8081; processes left running | PASS, listeners only; forwarding/app requests not re-proven |
| Existing private draft | No saved-draft panel visible in the recovered Camera sheet at14:00:30 IST; storage was not inspected or cleared | UI observation only; no claim that all draft storage is empty |

Documentation-only preparation checks executed on 2026-10-08 at13:47 IST: `pnpm format:check`, `pnpm lint` and `git diff --check` passed; new relative documentation file links resolved. `pnpm test` passed **12 suites / 111 tests**, unchanged count. A diff against087a225 confirmed application, dependencies, tests, Cedar and AWS source files remain unchanged. These automated checks do not promote any physical row below.

## Ordered physical tests

This is an execution queue, not an instruction to perform all steps at once. Give the owner only the next action and record its result before proceeding.

| ID | Test | Expected acceptance behavior | Actual result |
|---|---|---|---|
| C-00 | Open Camera and identify saved draft/preview/permission state | Wanted drafts remain untouched; establish an idle starting state | PASS, agent-observed live preview, no saved-draft panel or permission dialog; see recovery log |
| C-01 | Owner denies camera permission while idle, then opens Camera | Clear permission guidance; no unintended capture/upload/publication; Close returns to usable map | PENDING |
| C-02 | Denied camera settings/allow recovery | Existing settings/request action works; owner grants permission; camera preview becomes usable | PENDING |
| C-03 | Varied safe staged captures | Light/detailed scene and portrait capture resize within limits; readable preview; inspect actual uploaded JPEG size/dimensions/EXIF/hash locally | PENDING |
| C-04 | Capture busy/close behavior | Busy state prevents overlapping operations; completed private draft can be retained without publishing | PENDING |
| L-01 | Owner denies foreground location | Honest denial/fallback; map chosen-pin reporting remains usable; no GPS claim | PENDING |
| L-02 | Owner allows approximate foreground location | Actual outcome/accuracy or bounded failure disclosed; no precise private coordinates in public record | PENDING |
| L-03 | Owner allows precise foreground location | Actual fix or bounded timeout/error observed; appropriate accuracy shown; no background permission/tracking | PENDING |
| O-01 | Save private draft, close idle app, reopen | Same private image/draft survives; no upload/event/award caused by restart | PENDING |
| O-02 | Controlled API-offline upload from saved test draft | Clear failure/busy recovery; same private draft retained; no false upload/publication success | PENDING |
| O-03 | Restore API and retry same draft | Upload/manual review resumes; no duplicate unintended report/incident/reward | PENDING |
| O-04 | Warm cache, controlled API outage, refresh reports/routes | Dated offline cache/current-conditions uncertainty; stale/offline warning suppression; restored refresh returns current result | PENDING |
| A-01 | Normal text/touch/insets across map, report, routes, profile | Controls readable/reachable; no system-bar obstruction or trapped sheet; disabled actions explained | PENDING |
| A-02 | Owner increases text size, then restores original setting | Important content remains readable/reachable by scrolling; no hidden consent/close controls | PENDING |
| A-03 | Owner-assisted screen-reader pass, if available | Useful button labels, selected category/severity and disabled state; focus can reach consent, submit and close | PENDING |
| T-01 | Open native map attribution control | Actual map-source credits visible and reviewable; no AWS-source claim in LOCAL mode | PENDING |
| T-02 | Review proposed recorded credits | OpenFreeMap/OpenMapTiles/OpenStreetMap, project MIT, Cedar Apache-2.0 and Codex assistance acknowledged accurately | PENDING |

## Append-only execution log

No remaining physical test was marked passed by the initial preparation. Append each observation here, including failures, owner reports, deferred reasons and actual retest evidence. When a minimal code fix is needed, reference the defect, preserve frozen authorization unless a real security defect exists, and run relevant regression checks before retesting. Never substitute a successful unit/emulator test for a physical result.

### 2026-10-08: development launcher recovery and C-00

Tested feature revision087a225, Cedar9422fc2, with documentation-only worktree changes. The owner reported being unable to open JalNet and supplied an image showing the Expo development launcher rather than the application. Agent inspection found API8787 and Metro8081 still running, one authorized phone, and an empty `adb reverse --list`. This was a failed launch attempt, not a camera-permission result.

At13:53:56 IST, the two USB forwards were restored with `adb -d reverse tcp:8787 tcp:8787` and `adb -d reverse tcp:8081 tcp:8081`; the existing development client was opened using `jalnet://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081`. No reinstall, storage reset, permission change, capture or upload was performed. Command success alone was not counted as an application pass.

**C-00 PASS, agent observation at14:00:30 IST**, reviewed at14:09 IST: the foreground-guarded capture in ignored local file `.tools/device-demo/launcher-recovery.png` shows the actual JalNet report sheet and a live camera preview. No permission dialog, permission primer or saved-draft panel is visible. Capture JPEG and Close / keep draft controls are visible; no busy operation is shown. The red guidance requires a deliberately chosen observation pin or foreground location before capture. It is not a camera-permission error. This proves camera access at that moment, not denial/recovery, location, upload or empty persistent draft storage. The private scene remains outside Git.

The owner's later message “got no permission” does not by itself distinguish an absent prompt from a denial. The observed live preview establishes access for C-00; **C-01 and C-02 remain PENDING** until their specific physical actions and outcomes are observed. Application and authorization code remain frozen.

Next required owner interaction: **C-01 setup only**. While capture/upload is idle, open Android Settings → Apps → JalNet → Permissions → Camera and choose Don't allow. Do not clear storage or uninstall. Stop for the owner to confirm this setting before reopening Camera and observing denial behavior.

### 2026-10-08: owner strategy update

The owner subsequently reported checking physical-phone permissions and reviewing the application, accepted the demonstrated Android core and redirected work to Build It feature engineering/UI handoff. This is owner-reported review, without per-case observations for the pending rows above. It does not invent a denial/GPS/offline/accessibility/attribution result. The C-01 interaction queue is suspended under the new instruction; the owner now owns further testing/recording. Agent work must preserve the current USB-local state and drafts. New feature tests are separate from the historical camera-to-warning milestone and require their own phone acceptance.
