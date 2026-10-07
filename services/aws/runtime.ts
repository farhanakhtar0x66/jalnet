import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { Application } from "../core/application.js";
import { dispatch, errorResponse } from "../core/http.js";
import { AmazonRoutes, NovaAnalysis, S3Evidence } from "../providers/aws.js";
import { DynamoRepository } from "../providers/dynamo-repository.js";

const required = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing server configuration: ${key}`);
  return value;
};
export function cloudApplication() {
  const region = process.env.AWS_REGION ?? "ap-south-1";
  return new Application(
    new DynamoRepository(
      {
        reports: required("REPORTS_TABLE"),
        events: required("EVENTS_TABLE"),
        routes: required("USERS_TABLE"),
        ledger: required("DROPLET_LEDGER_TABLE"),
      },
      region,
    ),
    new S3Evidence(required("EVIDENCE_BUCKET"), region),
    new NovaAnalysis(process.env.BEDROCK_MODEL_ID ?? "", region),
    new AmazonRoutes(region),
  );
}
export function makeHandler(prefixes: readonly string[]) {
  let app: Application | undefined;
  return async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    try {
      if (
        !prefixes.some(
          (prefix) =>
            event.rawPath === prefix || event.rawPath.startsWith(`${prefix}/`),
        )
      )
        return { statusCode: 404, body: "{}" };
      const userId = event.requestContext.authorizer.jwt.claims.sub;
      app ??= cloudApplication();
      const result = await dispatch(
        app,
        {
          method: event.requestContext.http.method,
          path: event.rawPath,
          userId: typeof userId === "string" ? userId : "",
          query: event.queryStringParameters ?? {},
          body: event.body
            ? JSON.parse(
                event.isBase64Encoded
                  ? Buffer.from(event.body, "base64").toString()
                  : event.body,
              )
            : {},
        },
        async (id) => {
          await new SQSClient({
            region: process.env.AWS_REGION ?? "ap-south-1",
          }).send(
            new SendMessageCommand({
              QueueUrl: required("MEDIA_QUEUE_URL"),
              MessageBody: JSON.stringify({ reportId: id }),
            }),
          );
        },
      );
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result),
      };
    } catch (error) {
      const result = errorResponse(error, event.requestContext.requestId);
      return {
        statusCode: result.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result.body),
      };
    }
  };
}
