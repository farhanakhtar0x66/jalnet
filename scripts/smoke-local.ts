import assert from "node:assert/strict";
import { encode } from "jpeg-js";

const base = "http://127.0.0.1:8787";
const point = { lat: 28.6139, lon: 77.209 };
async function call(path: string, identity = "ALICE", body?: unknown) {
  const result = await fetch(`${base}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      authorization: `Bearer LOCAL_DEMO_${identity}`,
      "content-type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await result.json();
  assert(
    result.ok,
    `LOCAL/DEMO HTTP ${result.status}: ${JSON.stringify(json)}`,
  );
  return json;
}
const before = await call("/v1/events?bbox=77.2,28.6,77.22,28.63&layers=LIVE");
assert.equal(
  before.length,
  0,
  "Stop server, reset LOCAL/DEMO data, seed corridor and restart before smoke",
);
assert(
  (await call("/v1/routes")).length > 0,
  "Run pnpm demo:seed before smoke",
);
async function capture(identity: string, color: number) {
  const data = Buffer.alloc(8 * 8 * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color;
    data[i + 1] = 80;
    data[i + 2] = 90;
    data[i + 3] = 255;
  }
  const bytes = encode({ data, width: 8, height: 8 }, 90).data;
  const draft = await call("/v1/reports", identity, {
    action: "DRAFT",
    capturedAt: new Date().toISOString(),
    location: { ...point, source: "USER_PIN" },
  });
  const grant = await call("/v1/uploads/presign", identity, {
    reportId: draft.id,
    contentType: "image/jpeg",
    contentLength: bytes.length,
  });
  const localUrl = new URL(grant.url);
  assert(
    ["http://10.0.2.2:8787", "http://127.0.0.1:8787"].includes(localUrl.origin),
    "LOCAL/DEMO upload must use the emulator or USB loopback origin",
  );
  localUrl.hostname = "127.0.0.1";
  const upload = await fetch(localUrl, {
    method: "PUT",
    headers: { "content-type": "image/jpeg" },
    body: new Uint8Array(bytes).buffer,
  });
  assert.equal(upload.status, 204);
  await call("/v1/reports", identity, {
    action: "UPLOAD_COMPLETE",
    reportId: draft.id,
  });
  const ready = await call(`/v1/reports/${draft.id}`, identity);
  assert.equal(ready.status, "NEEDS_CONFIRMATION");
  assert.equal(ready.analysisProvenance, "LOCAL_DEMO");
  return draft.id as string;
}
const input = {
  category: "WATERLOGGING",
  severity: 2,
  location: point,
  stillActive: true,
  publicRoad: true,
};
const first = await capture("ALICE", 50);
const outcome = await call(`/v1/reports/${first}/confirm`, "ALICE", input);
assert(outcome.eventId);
assert.equal(
  (await call(`/v1/reports/${first}/confirm`, "ALICE", input)).replay,
  true,
);
const routes = await call("/v1/routes");
assert.equal(
  (await call(`/v1/routes/${routes[0].id}/risk`)).risks[0].warning,
  true,
);
assert.equal((await call("/v1/me")).droplets, 2);
const second = await capture("BOB", 160);
const merged = await call(`/v1/reports/${second}/confirm`, "BOB", input);
assert.equal(merged.eventId, outcome.eventId);
assert.equal((await call("/v1/me")).droplets, 10);
assert.equal((await call("/v1/me", "BOB")).droplets, 7);
const events = await call("/v1/events?bbox=77.2,28.6,77.22,28.63&layers=LIVE");
assert.equal(events.length, 1);
assert.equal(events[0].status, "ACTIVE");
assert(!JSON.stringify(events).includes("supporterIds"));
process.stdout.write(
  "LOCAL/DEMO HTTP smoke passed: fixture JPEG upload → manual confirmation → fusion → route warning → provisional/independent ledger → replay. This is not native camera or live AWS evidence.\n",
);
