import { reportLocationSchema } from "@jalnet/contracts";
import { openDatabaseAsync } from "expo-sqlite";
import { z } from "zod";

const draftSchema = z.object({
  uri: z.string(),
  capturedAt: z.iso.datetime(),
  reportId: z.uuid().optional(),
  location: reportLocationSchema.optional(),
});
export type LocalDraft = z.infer<typeof draftSchema>;
const dbPromise = openDatabaseAsync("jalnet-drafts.db").then(async (db) => {
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS draft (id INTEGER PRIMARY KEY, data TEXT NOT NULL)",
  );
  return db;
});
export async function saveDraft(draft: LocalDraft) {
  await (await dbPromise).runAsync(
    "INSERT OR REPLACE INTO draft (id,data) VALUES (1,?)",
    JSON.stringify(draft),
  );
}
export async function readDraft() {
  const row = await (await dbPromise).getFirstAsync<{ data: string }>(
    "SELECT data FROM draft WHERE id=1",
  );
  return row ? draftSchema.parse(JSON.parse(row.data)) : null;
}
export async function clearDraft() {
  await (await dbPromise).runAsync("DELETE FROM draft WHERE id=1");
}
