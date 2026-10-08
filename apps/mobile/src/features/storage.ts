import { tankStateSchema } from "@jalnet/contracts/water";
import { tankDemoFixture } from "../../../../packages/domain/src/water";
import { storageScope } from "../api";
import { dbPromise } from "../cache";
import { featureStore } from "./persistence";

const featureDb = dbPromise.then(async (db) => {
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS local_feature_state (scope TEXT NOT NULL, feature TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(scope,feature))",
  );
  return db;
});

export const tankStore = featureStore(
  "tank-v1",
  tankStateSchema,
  tankDemoFixture,
  {
    scope: storageScope,
    async read(scope, feature) {
      const row = await (await featureDb).getFirstAsync<{ data: string }>(
        "SELECT data FROM local_feature_state WHERE scope=? AND feature=?",
        scope,
        feature,
      );
      return row?.data ?? null;
    },
    async write(scope, feature, data) {
      await (await featureDb).runAsync(
        "INSERT OR REPLACE INTO local_feature_state(scope,feature,data) VALUES(?,?,?)",
        scope,
        feature,
        data,
      );
    },
  },
);
