import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { eventForObservation } from "../packages/domain/src/incidents.js";
import { Application } from "../services/core/application.js";
import { LocalAnalysis, LocalRoutes } from "../services/providers/local.js";
import { LocalRepository } from "../services/providers/local-repository.js";

const now = "2026-10-08T08:00:00.000Z";
const observation = {
  category: "WATERLOGGING" as const,
  severity: 2 as const,
  stillActive: true as const,
  location: { lat: 28.6139, lon: 77.209 },
  publicRoad: true,
};
function fixture() {
  const repo = new LocalRepository();
  const app = new Application(
    repo,
    {
      presign: async () => ({ url: "unused", expiresIn: 300 }),
      read: async () => {
        throw new Error("Missing evidence");
      },
    },
    new LocalAnalysis(),
    new LocalRoutes(),
    () => now,
  );
  return { app, repo };
}
describe("basic independent confirmations", () => {
  it("denies self, remote, stale and duplicate votes; two clear observations resolve", async () => {
    const { app, repo } = fixture();
    const event = eventForObservation(randomUUID(), observation, now);
    event.attributes = {
      ...event.attributes,
      revision: 1,
      supporterIds: ["alice"],
    };
    await repo.commit({ event, ledger: [], guards: [] });
    const vote = {
      action: "CLEARED",
      location: observation.location,
      accuracyM: 30,
      observedAt: now,
    };
    await expect(app.vote("alice", event.id, vote)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(
      app.vote("bob", event.id, {
        ...vote,
        location: { lat: 28.7, lon: 77.3 },
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      app.vote("bob", event.id, {
        ...vote,
        observedAt: "2026-10-07T08:00:00.000Z",
      }),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
    expect((await app.vote("bob", event.id, vote)).event.status).toBe(
      "MONITORING",
    );
    expect((await app.vote("bob", event.id, vote)).replay).toBe(true);
    expect((await app.vote("carol", event.id, vote)).event.status).toBe(
      "RESOLVED",
    );
    expect((await app.profile("bob")).droplets).toBe(0);
  });
  it("handles concurrent votes without losing either observation", async () => {
    const { app, repo } = fixture();
    const event = eventForObservation(randomUUID(), observation, now);
    event.attributes = {
      ...event.attributes,
      revision: 1,
      supporterIds: ["alice"],
    };
    await repo.commit({ event, ledger: [], guards: [] });
    const vote = {
      action: "CLEARED",
      location: observation.location,
      accuracyM: 30,
      observedAt: now,
    };
    await Promise.all([
      app.vote("bob", event.id, vote),
      app.vote("carol", event.id, vote),
    ]);
    expect((await repo.getEvent(event.id))?.status).toBe("RESOLVED");
  });
});
describe("atomic eligibility guards", () => {
  it("rolls back the whole commit when a daily cap version changes", async () => {
    const { repo } = fixture();
    const event = eventForObservation(randomUUID(), observation, now);
    expect(
      await repo.commit({
        event,
        ledger: [],
        guards: [{ key: "daily", expected: 0, value: 10 }],
      }),
    ).toBe(true);
    const other = eventForObservation(randomUUID(), observation, now);
    expect(
      await repo.commit({
        event: other,
        ledger: [],
        guards: [{ key: "daily", expected: 0, value: 2 }],
      }),
    ).toBe(false);
    expect(await repo.getEvent(other.id)).toBeUndefined();
    expect(await repo.counter("daily")).toBe(10);
  });
  it("caps draft creation under simultaneous requests", async () => {
    const { app } = fixture();
    const request = {
      action: "DRAFT",
      capturedAt: now,
      location: { ...observation.location, source: "USER_PIN" },
    };
    for (let i = 0; i < 19; i++) await app.createReport("alice", request);
    const results = await Promise.allSettled([
      app.createReport("alice", request),
      app.createReport("alice", request),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
  });
});
