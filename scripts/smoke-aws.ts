import { readFile } from "node:fs/promises";
import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import { cloudApplication } from "../services/aws/runtime.js";

if (!process.argv.includes("--live")) {
  process.stderr.write(
    "BLOCKED_AWAITING_SSO: live AWS tests have not run. Intended profile: jalnet; region: ap-south-1. Use --live only after local SSO is available.\n",
  );
  process.exitCode = 2;
} else {
  const imageFlag = process.argv.indexOf("--image");
  const path = process.argv[imageFlag + 1];
  if (imageFlag < 0 || !path)
    throw new Error(
      "Supply --image /absolute/path/to/an/actual/captured.jpg; no fixture substitutes are allowed",
    );
  const region = process.env.AWS_REGION ?? "ap-south-1";
  if (process.env.AWS_PROFILE !== "jalnet")
    throw new Error("Run with AWS_PROFILE=jalnet after local SSO sign-in");
  const identity = await new STSClient({ region }).send(
    new GetCallerIdentityCommand({}),
  );
  if (!identity.Account)
    throw new Error("No authenticated AWS account returned");
  process.stdout.write(
    "AWS identity call succeeded. Starting provider checks; no complete integration is yet verified.\n",
  );
  const app = cloudApplication();
  const now = new Date().toISOString();
  const image = await readFile(path);
  if (image.length > 3_750_000)
    throw new Error("Captured JPEG must be <=3.75MB");
  const report = await app.createReport("phase0-smoke", {
    action: "DRAFT",
    capturedAt: now,
    location: { lat: 28.6139, lon: 77.209, source: "USER_PIN" },
  });
  if ((await app.ownedReport("phase0-smoke", report.id)).id !== report.id)
    throw new Error("DynamoDB round trip failed");
  process.stdout.write("DynamoDB report write/read succeeded.\n");
  const upload = await app.presign("phase0-smoke", {
    reportId: report.id,
    contentType: "image/jpeg",
    contentLength: image.length,
  });
  const response = await fetch(upload.url, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: image,
  });
  if (!response.ok) throw new Error(`S3 PUT failed: HTTP ${response.status}`);
  await app.completeUpload("phase0-smoke", report.id);
  process.stdout.write(
    "Private S3 presigned upload and object validation succeeded.\n",
  );
  // Invoke directly so manual fallback cannot disguise a failed Phase 0 model proof.
  await app.analysis.assess(image);
  process.stdout.write(
    "Live Nova image request and strict assessment validation succeeded.\n",
  );
  await app.routeProvider.calculate(
    { lat: 28.6139, lon: 77.205 },
    { lat: 28.6139, lon: 77.215 },
    "Car",
  );
  process.stdout.write("Amazon Location route geometry validated.\n");
  process.stdout.write(
    "Provider smoke completed. Still verify deployed queue/API/Cognito, native Amazon map assets, and device capture end-to-end separately. Private smoke evidence follows the bucket's 14-day retention; no public event or rewards were created.\n",
  );
}
