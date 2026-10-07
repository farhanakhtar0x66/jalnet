import { createServer } from "node:http";
import { resolve } from "node:path";
import { ApiFailure, Application } from "../services/core/application.js";
import {
  dispatch,
  errorResponse,
  parseRequestBody,
} from "../services/core/http.js";
import {
  LocalAnalysis,
  LocalEvidence,
  LocalRoutes,
} from "../services/providers/local.js";
import { LocalRepository } from "../services/providers/local-repository.js";

const port = 8787;
const evidence = new LocalEvidence(
  resolve(".local-data/evidence"),
  `http://10.0.2.2:${port}`,
);
const repository = new LocalRepository(resolve(".local-data/state.json"));
await repository.load();
const app = new Application(
  repository,
  evidence,
  new LocalAnalysis(),
  new LocalRoutes(),
);
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    const chunks: Uint8Array[] = [];
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      if (length > 4_000_000)
        throw new ApiFailure("UPLOAD_TOO_LARGE", 413, "Body too large");
      chunks.push(chunk);
    }
    const bytes = Buffer.concat(chunks);
    const upload = url.pathname.match(/^\/local\/evidence\/([\w-]+)$/);
    if (req.method === "PUT" && upload?.[1]) {
      await evidence.upload(upload[1], bytes);
      res.writeHead(204);
      res.end();
      return;
    }
    const token = req.headers.authorization;
    const userId =
      token === "Bearer LOCAL_DEMO_ALICE"
        ? "local-alice"
        : token === "Bearer LOCAL_DEMO_BOB"
          ? "local-bob"
          : "";
    const result = await dispatch(
      app,
      {
        method: req.method ?? "GET",
        path: url.pathname,
        userId,
        query: Object.fromEntries(url.searchParams),
        body: parseRequestBody(bytes.toString()),
      },
      async (id) => {
        await app.analyze(id);
      },
    );
    res.writeHead(200, {
      "content-type": "application/json",
      "x-jalnet-provider": "LOCAL_DEMO",
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    const result = errorResponse(error);
    res.writeHead(result.status, { "content-type": "application/json" });
    res.end(JSON.stringify(result.body));
  }
});
server.listen(port, "127.0.0.1", () =>
  process.stdout.write(
    `JalNet LOCAL/DEMO API: http://127.0.0.1:${port}; Android emulator uses 10.0.2.2. No AWS integrations verified.\n`,
  ),
);
