import { resolve } from "node:path";
import { createLocalServer } from "../services/local/server.js";

const port = 8787;
const { server } = await createLocalServer({
  stateFile: resolve(".local-data/state.json"),
  evidenceDirectory: resolve(".local-data/evidence"),
  evidenceBaseUrl: `http://10.0.2.2:${port}`,
});
server.listen(port, "127.0.0.1", () =>
  process.stdout.write(
    `JalNet LOCAL/DEMO API: http://127.0.0.1:${port}; mandatory Cedar private-report authorization; Android emulator uses 10.0.2.2. No AWS integrations verified.\n`,
  ),
);
