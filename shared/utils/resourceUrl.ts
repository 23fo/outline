import { withBasePath } from "./subpath";
import { sanitizeUrl } from "./urls";

/**
 * Resolves an application-served resource URL for use by the browser.
 * Root-relative URLs are prefixed with the configured application base path,
 * while relative, absolute, protocol-relative, data, blob, and
 * already-prefixed URLs remain unchanged.
 *
 * Persisted document URLs should remain root-relative; call this only at a
 * rendering, navigation, or request boundary.
 */
export function resolveResourceUrl(
  url: string | null | undefined
): string | undefined {
  if (!url) {
    return undefined;
  }

  return url.startsWith("/") ? withBasePath(url) : url;
}

/**
 * Resolves an application-served resource URL and applies the standard URL
 * sanitizer before it is assigned to a browser DOM attribute.
 */
export function sanitizeResourceUrl(
  url: string | null | undefined
): string | undefined {
  const resolved = resolveResourceUrl(url);
  return resolved ? sanitizeUrl(resolved) : undefined;
}
