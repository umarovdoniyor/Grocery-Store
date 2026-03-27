export function toPublicImageUrl(path: string, apiBaseUrl: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * Resolves a member avatar/image path to a full URL, normalizing stale
 * localhost URLs (e.g. http://localhost:3007/...) to the current API base.
 */
export function resolveMemberImageUrl(
  value: string | null | undefined,
  apiBaseUrl: string,
  fallback = ""
): string {
  const normalized = value?.replace(/\\/g, "/").trim();
  if (!normalized) return fallback;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("blob:")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const stored = new URL(normalized);
      // Rewrite any backend uploads URL (internal or stale) to the current API origin.
      if (apiBaseUrl && stored.pathname.startsWith("/uploads/")) {
        const api = new URL(apiBaseUrl);
        if (stored.origin !== api.origin) {
          return `${api.origin}${stored.pathname}`;
        }
      }
    } catch {}
    return normalized;
  }

  // Bare filename with no path separators — backend may return just the filename.
  const withPath = normalized.includes("/") ? normalized : `/uploads/member/${normalized}`;

  try {
    return toPublicImageUrl(withPath, apiBaseUrl);
  } catch {
    return fallback;
  }
}
