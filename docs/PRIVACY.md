# Prototype privacy policy and limits

Capture is foreground-only and opt-in. Users may choose a report pin without location permission. Public-road publication requires an explicit switch; private-property incidents stay off the public map. Do not capture faces, identifying documents, private household information or private areas when reporting environmental evidence.

The app requests a JPEG capture without EXIF, renders a resized copy (maximum long side 1280 px), saves a local private draft and uploads only that copy. No public original-photo preview exists. Verification uses current proximity/accuracy; it cannot establish that client GPS is unspoofed.

S3 is encrypted, blocks all public access and requires TLS. Presigned upload URLs last five minutes and are never logged. Original uploaded objects expire after 14 days under the prototype lifecycle; incident history and immutable ledger are retained. Retention is a project decision, not an AWS-verified deployed policy. A user-erasure/admin-reversal workflow is still pending.

Local evidence and state are ignored by Git. Stop the local server before `pnpm demo:reset`; it removes only `.local-data`. Cloud reset/deletion is deliberately unavailable until resource scoping and the actual deployed environment have been verified.

AWS credentials use the real local SSO/profile chain or scoped Lambda roles. No static keys belong in the app, repo or `.env.example`. The intentionally extractable Amazon Location maps-only client key must be expiring and restricted before use. JWTs and refresh tokens belong in SecureStore, never public configuration.

The selected model/profile's processing geography must be verified before submitting private evidence. `ap-south-1` does not by itself guarantee India-only processing. No model/account access or residency claim has been verified while SSO is blocked.

A pending local capture remains until explicit discard or successful confirmation. SQLite event/route cache entries expire after 24 hours, are token-scoped, and stay in app-private storage; no public media cache exists. Foreground GPS acquisition uses one bounded watch, removed on success, error or 15-second timeout. The emulator camera/GPS are simulated hardware and cannot verify real-world hazard evidence.
