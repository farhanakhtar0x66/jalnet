import { apiErrorSchema } from "@jalnet/contracts";
import * as SecureStore from "expo-secure-store";
import type { z } from "zod";
export const mode = process.env.EXPO_PUBLIC_PROVIDER_MODE ?? "local-demo";
if (!["local-demo", "aws"].includes(mode))
  throw new Error("Invalid provider mode");
export const isLocal = mode === "local-demo";
const base =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (isLocal ? "http://10.0.2.2:8787" : "");
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
export class NetworkError extends Error {}
export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
  method = body === undefined ? "GET" : "POST",
) {
  const token = isLocal
    ? "LOCAL_DEMO_ALICE"
    : await SecureStore.getItemAsync("jalnet.accessToken");
  if (!token || !base)
    throw new Error(
      "AWS sign-in and API configuration are required; live access is blocked.",
    );
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    // Native fetch rejects with Error rather than browser TypeError. Keep this boundary explicit.
    throw new NetworkError(
      "Network unavailable. Your private draft is retained; retry when connected.",
    );
  }
  const data: unknown = await response.json();
  if (!response.ok) {
    const parsed = apiErrorSchema.safeParse(data);
    throw new HttpError(
      response.status,
      parsed.success ? parsed.data.error.message : "Request failed",
    );
  }
  return schema.parse(data);
}
