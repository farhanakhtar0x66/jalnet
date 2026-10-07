import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { openDatabaseAsync } from "expo-sqlite";
import type { z } from "zod";
import { api, isLocal, NetworkError } from "./api";

const dbPromise = openDatabaseAsync("jalnet-cache.db").then(async (db) => {
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, body TEXT NOT NULL, savedAt INTEGER NOT NULL)",
  );
  return db;
});
export async function cachedApi<T>(path: string, schema: z.ZodType<T>) {
  const token = isLocal
    ? "LOCAL_DEMO_ALICE"
    : await SecureStore.getItemAsync("jalnet.accessToken");
  if (!token) throw new Error("Sign in before reading private cached data");
  // A different account/session cannot read the preceding token's cached routes.
  const scope = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    token,
  );
  const key = `${scope}:${path}`;
  const db = await dbPromise;
  try {
    const value = await api(path, schema);
    const cachedAt = Date.now();
    await db.runAsync(
      "INSERT OR REPLACE INTO cache(key,body,savedAt) VALUES(?,?,?)",
      key,
      JSON.stringify(value),
      cachedAt,
    );
    await db.runAsync(
      "DELETE FROM cache WHERE savedAt < ?",
      cachedAt - 86_400_000,
    );
    return { value, fromCache: false, cachedAt };
  } catch (error) {
    // Auth, contract and configuration failures must never become successful cache reads.
    if (!(error instanceof NetworkError)) throw error;
    const row = await db.getFirstAsync<{ body: string; savedAt: number }>(
      "SELECT body,savedAt FROM cache WHERE key=?",
      key,
    );
    if (!row || Date.now() - row.savedAt > 86_400_000) throw error;
    return {
      value: schema.parse(JSON.parse(row.body)),
      fromCache: true,
      cachedAt: row.savedAt,
    };
  }
}
