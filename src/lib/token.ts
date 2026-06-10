import { refreshToken } from "@/services/auth";

let cachedAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function clearAccessToken(): void {
  cachedAccessToken = null;
}

export async function fetchAccessToken(): Promise<string> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const response = await refreshToken();

  if (
    response?.success &&
    response.data &&
    typeof response.data === "object" &&
    "accessToken" in response.data &&
    typeof response.data.accessToken === "string"
  ) {
    cachedAccessToken = response.data.accessToken;
    return cachedAccessToken;
  }

  throw new Error("Unable to obtain access token");
}
