import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Validate the actual synthesized artifact. Run pnpm synth before pnpm test.
const template = JSON.parse(
  readFileSync("cdk.out/JalNetDev.template.json", "utf8"),
) as {
  Resources: Record<
    string,
    {
      Type: string;
      Properties: Record<string, unknown>;
      DeletionPolicy?: string;
    }
  >;
};
const resources = Object.values(template.Resources);
describe("synthesized security boundaries (LOCAL, not deployment evidence)", () => {
  it("retains canonical tables without event TTL and encrypts private evidence", () => {
    const tables = resources.filter((r) => r.Type === "AWS::DynamoDB::Table");
    expect(tables).toHaveLength(4);
    for (const table of tables) {
      expect(table.DeletionPolicy).toBe("Retain");
      expect(table.Properties.TimeToLiveSpecification).toBeUndefined();
    }
    const bucket = resources.find((r) => r.Type === "AWS::S3::Bucket");
    expect(bucket?.Properties.PublicAccessBlockConfiguration).toEqual({
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    });
    expect(bucket?.Properties.BucketEncryption).toBeDefined();
  });
  it("protects every private API route with JWT, keeping health operational", () => {
    for (const resource of resources.filter(
      (r) => r.Type === "AWS::ApiGatewayV2::Route",
    ))
      expect(resource.Properties.AuthorizationType).toBe(
        resource.Properties.RouteKey === "GET /health" ? "NONE" : "JWT",
      );
    const clients = resources.filter(
      (r) => r.Type === "AWS::Cognito::UserPoolClient",
    );
    expect(clients[0]?.Properties.GenerateSecret).toBe(false);
  });
  it("never grants wildcard actions or unrestricted Bedrock resources", () => {
    const text = JSON.stringify(
      resources.filter((r) => r.Type === "AWS::IAM::Policy"),
    );
    expect(text).not.toContain('"Action":"*"');
    expect(text).not.toContain('"bedrock:*"');
    const policies = resources.filter((r) => r.Type === "AWS::IAM::Policy");
    const statements = policies.flatMap(
      (p) =>
        (
          p.Properties.PolicyDocument as {
            Statement: { Action: string | string[]; Resource: unknown }[];
          }
        ).Statement,
    );
    for (const statement of statements)
      if (JSON.stringify(statement.Action).includes("bedrock:InvokeModel"))
        expect(statement.Resource).toEqual({ Ref: "BedrockInvokeArns" });
  });
});
