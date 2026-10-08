# Aryan: mobile UI handoff

Prepared2026-10-08 for the Build It strategy. You own visual implementation. Engineering owns calculation, validated local state and reliability on `codex/build-it-features`; the owner owns product decisions, physical tests and final recording/submission. Begin from the reviewed engineering commit once delivered; do not edit the same files concurrently. No teammate message has been sent by this document.

## Current screen inventory and exact source

| Screen/state | Current source/component | States and behavior to preserve |
|---|---|---|
| Configuration block/start | `apps/mobile/App.tsx` | Invalid live configuration blocks clearly; no implicit AWS-to-demo switch; QueryClient provider |
| Map/home/Jal Pulse | `apps/mobile/src/Home.tsx`, `Home` | Native street map, clusters, pin selection, route line, affected-area estimate, live/local label, current/loading/empty/error/dated-cache states, stale warning suppression |
| Layers sheet | `Home.tsx`, layers branch; IDs in `src/ui.ts` | LIVE/FLOOD/LEAKS/DRAINS/ROUTE_RISK exact IDs; one selected layer; no fabricated stress or heat layer |
| Event detail sheet | `Home.tsx`, feature branch | Recent/aging, expires/last-observed, source, independent-report count, severity uncertainty; foreground location for independent actions, no self-verification |
| Camera/private draft/review | `src/ReportFlow.tsx`, `ReportFlow` | Primer/allow/settings, preview, capture busy, persisted private draft, upload/retry/analysis/manual review, category/severity, still-active and public-road consent, submission failure/replay/finish, discard confirmation, Close/keep draft |
| Saved routes | `Home.tsx`, routes branch | Named origin/destination pins, save/busy/errors/empty, dated cache, refresh reports, pending/unavailable/risk/no-reports wording, delete; local geometry disclosure |
| Profile/sign-in | `Home.tsx`, profile branch; `src/SignIn.tsx` | Actual balance/immutable ledger, loading/error/empty, provisional meaning, no invented people-helped/litres-saved; Cognito PKCE only in AWS mode |
| Common action/state | `src/Button.tsx`, `src/ui.ts` | Minimum48px action, disabled/selected accessibility state; pin initialization/accuracy and selected-event identity |
| My Water, additive screen | Proposed `src/features/MyWater.tsx` through `WaterHub.tsx` | Hydration/loading/error, all numeric inputs, zero-use/empty-tank estimates, immediate calculation, save pending/failure/retry, simulate/reset confirmations, field-level origin labels |
| Water Stress, additive detail | Proposed `src/features/WaterStress.tsx` | DEMO INDICATOR on entry/result/factors, adjustable sample pressures, missing values/limited coverage/no score, weights/contributions/limitations, reset sample |
| Product vision | Proposed `src/features/VisionPreview.tsx` | DEMO supplier/price/volume cards without booking buttons; HeatSafe PLANNED, no live heat/safety promise |

New source paths above are a stable planned handoff surface, not evidence they exist at preparation time. The final engineering report will confirm delivered files.

## Observed usability problems

Source audit and prior private device captures show a tall metadata notice over the map, several large floating actions and uneven title/input spacing. Routes require repeated closing/reopening to choose pins. Camera uses a long review form with weak grouping, long uppercase category names and consent near the bottom. Inputs lack a consistent helper/error style. Home uses a hardcoded top inset, so validate actual system bars. Existing loading/error text is functional but not consistently grouped. No full screen-reader/large-font pass is claimed. The local route is still a line across streets; do not visually imply turn-by-turn navigation.

The country-only basemap and route-refresh defect were already fixed in the accepted milestone. Preserve OpenFreeMap street detail and native attribution. Real phone evidence lives in ignored `.tools/device-demo`; these files include private scenes and must not be committed or shared without inspection/redaction.

## Proposed hierarchy and map-first home

Keep Map as the first screen. Recommended bottom navigation: Map / center Camera / My Water, with Profile at the top right and Saved Routes accessible from the map. Engineering will add a small My Water entry using the current layout; you own the final hierarchy. Water Stress and TankerOS belong inside My Water or the map's secondary sheet, rather than six bottom tabs. HeatSafe is a roadmap card. Keep the map mounted while sheets open so camera position/pin selection survives.

Use one compact Jal Pulse strip with a separate uncertainty/status line; show the route warning only when the current data supports it. Keep Locate/Layers within reach. A no-reports state says no current reports, not safe/normal conditions. Show chosen pin and location accuracy where needed, rather than permanent full coordinates on the home. Preserve map bounds, query debounce, viewport limits, data-driven marker selection and attribution control. Stress sample data must not become an unlabeled live heatmap.

## Report-flow polish contract

Separate capture, private-draft upload and confirmation visually, without inventing backend steps. Capture still needs a deliberately chosen pin or foreground fix. Permission denial leaves browsing/close usable. Upload/analysis/submit busy states prevent overlapping actions; keep recovery on the same report. The local review must say no image model ran. Retain editable category/severity/note, explicit still-active/public-road consent and private-property behavior. Do not preselect consent, auto-submit, expose original photos in public cards or claim measured water depth. Show errors next to the failing action and retain private drafts. Use a concise success state based on the actual response/ledger; a view-on-map button must really close/refresh/select the new event if added.

## Saved-route polish contract

Give origin and destination clear labels and a short pin-selection instruction. Make save/refresh/delete states distinct. Retain encoded geometry, travel mode and HTTP bodies. Highlight an actual affected saved route; never call it safe or promise a reroute. The current API supplies an intersection warning, not alternative road routing. Show unknown/current-check age when offline/stale; do not use cached risk as a current warning. Deletion must still call the existing endpoint and invalidate queries.

## Stable additive local contracts

Engineering will add `packages/contracts/src/water.ts` (additive `@jalnet/contracts/water` export) and `packages/domain/src/water.ts`. Existing contracts/endpoints stay unchanged. My Water input/state contract: version1, capacityLitres, levelPct, dailyUseLitres, per-field source and simulatedDays. Calculator returns remainingLitres, hoursRemaining (null when a nonempty tank has zero entered consumption) and empty/limited/available status. Simulation advances exactly one hypothetical day; no wall-clock consumption, refill, sensor, ML, API or award. Initial/reset fixture:1,500L capacity,60% level,300L/day →900L,72h; one day →600L,48h. Labels distinguish USER_ENTERED, DEMO_FIXTURE and SIMULATED.

The new `src/features/useLocalFeature.ts` controller and `storage.ts` adapter will expose validated load/update/reset/retry state. They use a new table in **existing `jalnet-cache.db`**, scoped to `storageScope()` from the existing authentication boundary, with version/schema checks and ordered writes. Do not modify storage/auth to accommodate visual changes. Corrupt/unavailable storage must show recovery guidance; do not silently overwrite it with a fixture. Reset only the water fixture, never reports/drafts/cache/ledger.

Water Stress contract: six0–1 sample pressure inputs, each nullable; fixed weights Supply.25, Heat demand.15, Rain/recharge.15, Groundwater.20, Tanker demand.15, Leak-loss.10. Renormalize available weights; coverage is available original weight, not a measured scientific confidence. Coverage below60% suppresses the headline score/band. Expose raw pressure, base/effective weight and contribution for inspection. Band cutoffs are25/50/75, a prototype communication policy. Label all sample/edited data DEMO INDICATOR; no environmental feed, freshness or health claim. Do not connect it to incident severity/route risk/rewards.

## My Water visual requirements

Hero: remaining litres, approximate level and depletion estimate with source labels beside the values. Inputs: capacity(L), level(%), daily use(L/day), readable numeric keyboard, units/helpers, inline validation and optional clearly labeled consumption presets. Recalculate immediately from valid inputs; invalid/blank inputs hide the forecast rather than show a plausible stale answer. Explain constant-consumption/no-refill assumption. Zero consumption means no finite estimate; empty tank means zero remaining. Allow scrolling with keyboard open. Show saving/saved/failure/retry without hiding close. Simulation button says Simulate one day; reset requires explicit confirmation and shows the exact fixture. Do not present user inputs as sensor telemetry.

## Water Stress and vision visual requirements

Use a clear area label such as Demo Delhi area and a permanent DEMO INDICATOR badge. Put band and coverage above inspectable factors. Show Missing on omitted inputs; limited data must not look green/safe. Display methodology/limits in a reachable section. TankerOS cards must repeat DEMO on names/prices and say no booking/payment/supplier contact. If engineering delivers only a preview, keep it noninteractive rather than adding a Reserve button. HeatSafe stays PLANNED, with no fake temperatures, predictive score or guaranteed safe-route action.

## Visual system and device constraints

Use one platform sans family, three clear text levels and consistent numeric units. Reuse restrained water-blue, ink, neutral-surface, muted border, amber warning and red error semantics; existing Button blue is#125b70. Define tokens centrally during your visual pass; do not install an icon/font/animation framework merely for polish. Aim for consistent16–24px screen padding,8–12px element gaps and48px actions. Status needs text/icon as well as color. Keep long translated labels, large fonts, keyboard/inset/portrait constraints and small screens in mind. No fixed-height text containers, tiny icon-only actions, looping animation or dashboard-heavy homepage.

Target: owner Redmi Note9ProMax reporting Android16/API36,1080×2400; this is evidence for one reported device, not all Redmi firmware. Existing dev client needs Metro and USB8787/8081 forwarding. Do not clear storage/uninstall to obtain clean screenshots. TalkBack requires meaningful names/selected/disabled states, reachable close/consent/input errors and sensible focus. Android back must close an idle sheet, retain drafts and avoid duplicate operations. Verify at default and enlarged text. Do not claim physical testing from emulator results.

## Screenshot request and before/after acceptance

Before editing, capture controlled synthetic fixtures on an emulator, or with owner cooperation on the Redmi. Required pairs: calm home, unverified warning home/event detail, layers, camera primer, staged private draft (harmless prop only), manual review with consent visible, saved routes warning/unknown/empty, profile+2/empty, My Water fixture/edited/simulated/invalid/save-error, Stress full/limited/no-data and vision previews. Reproduce the same viewport/state/text size for each pair. Inspect every image for addresses, precise real coordinates, route names, faces, private photos, notifications, tokens and account IDs. Use synthetic fixtures for public copies. Current private evidence is not a shareable screenshot pack; no sanitized public pack has been produced yet.

Visual acceptance: map remains useful at first glance; every visible action works or is clearly unavailable; all working/simulated/planned labels remain visible; no controls clipped by system bars/keyboard at default or enlarged text;48px actions/readable contrast; screen reader can reach primary actions and consent; route/freshness/private-state semantics preserved; before/after pairs plus owner physical review. Run format/lint/types/all tests/local smoke/Android bundle after UI integration. These criteria are pending until actually checked.

## Safe editing boundary and integration

After the reviewed feature commit, you may edit presentation in `Home.tsx`, `ReportFlow.tsx`, `Button.tsx`, `App.tsx`, and `src/features/{MyWater,WaterStress,VisionPreview,WaterHub}.tsx`. Coordinate `Home.tsx` entry/navigation with engineering first. Preserve hooks/state/action handlers; pull view-only components out if useful, without changing contracts. Engineering files `packages/contracts/src/water.ts`, `packages/domain/src/water.ts`, `src/features/{storage,persistence,useLocalFeature}.ts`, all tests, `src/{api,transport,cache,drafts,location,SignIn,ui}.ts/.tsx`, services, policies, infrastructure, cutover scripts and populated environments are not visual implementation targets.

Do not change Cognito/JWT/Cedar/IAM, report ownership/policies, upload grants/size/hash/EXIF, report statuses/discriminators, event validation/fusion/expiry, ledger/idempotency, cache/account scopes or future AWS composition to fit a design. No roles/sharing/admin/new authentication. Cedar40 tests must remain unchanged. Use additive presentation props around stable calculated results; labels never become new API enum values.
