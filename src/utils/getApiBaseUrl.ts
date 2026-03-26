/**
 * Returns the correct API base URL depending on the execution context.
 *
 * - Server-side (SSR inside Docker): uses API_INTERNAL_URL so the
 *   frontend container reaches the backend via the Docker service name.
 *   This is a plain env var (no NEXT_PUBLIC_ prefix) — never baked into
 *   the JS bundle and only visible server-side.
 * - Browser (client-side): uses NEXT_PUBLIC_API_BASE_URL which is the
 *   public-facing URL the user's browser can reach.
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined" && process.env.API_INTERNAL_URL) {
    return process.env.API_INTERNAL_URL;
  }

  const explicitBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:4001/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
}
