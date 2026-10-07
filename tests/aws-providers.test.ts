import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { S3Client } from "@aws-sdk/client-s3";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NovaAnalysis, S3Evidence } from "../services/providers/aws.js";

const assessment = {
  relevant: true,
  category: "WATERLOGGING",
  visualSeverity: "LOW",
  evidence: ["Visible standing water"],
  modelConfidence: 0.5,
  uncertaintyReasons: ["Depth is unknown"],
  publicDraft: "Possible waterlogging reported; road conditions are uncertain.",
};
const response = (text: string) => ({
  $metadata: {},
  output: { message: { role: "assistant", content: [{ text }] } },
});
afterEach(() => vi.restoreAllMocks());
describe("AWS adapter unit tests (SDK mocked; NOT live AWS proof)", () => {
  it("retries malformed assessment once, then accepts only validated output", async () => {
    const send = vi.spyOn(BedrockRuntimeClient.prototype, "send");
    send
      .mockResolvedValueOnce(response('{"depthM":2}') as never)
      .mockResolvedValueOnce(response(JSON.stringify(assessment)) as never);
    expect(
      await new NovaAnalysis("unit-test-model-config", "ap-south-1").assess(
        new Uint8Array([1]),
      ),
    ).toEqual(assessment);
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("never exceeds two model attempts when schema validation fails", async () => {
    const send = vi
      .spyOn(BedrockRuntimeClient.prototype, "send")
      .mockResolvedValue(
        response(
          JSON.stringify({ ...assessment, modelConfidence: 3 }),
        ) as never,
      );
    await expect(
      new NovaAnalysis("unit-test-model-config", "ap-south-1").assess(
        new Uint8Array([1]),
      ),
    ).rejects.toThrow();
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("does not invoke a missing configured model or an oversized image", async () => {
    const send = vi.spyOn(BedrockRuntimeClient.prototype, "send");
    await expect(
      new NovaAnalysis("", "ap-south-1").assess(new Uint8Array([1])),
    ).rejects.toThrow();
    await expect(
      new NovaAnalysis("unit-test-model-config", "ap-south-1").assess(
        new Uint8Array(3_750_001),
      ),
    ).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects an incorrectly typed S3 object before consuming its body", async () => {
    const body = { transformToByteArray: vi.fn() };
    vi.spyOn(S3Client.prototype, "send").mockResolvedValue({
      $metadata: {},
      ContentType: "text/plain",
      ContentLength: 100,
      Body: body,
    } as never);
    await expect(
      new S3Evidence("unit-test-private-bucket", "ap-south-1").read(
        "private/test.jpg",
      ),
    ).rejects.toThrow();
    expect(body.transformToByteArray).not.toHaveBeenCalled();
  });
});
