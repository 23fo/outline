import { withBasePath } from "./subpath";
import { sanitizeUrl } from "./urls";

/**
 * Resolves an application-served resource URL for use by the browser.
 * Root-relative URLs are prefixed with the configured application base path,
 * while absolute, protocol-relative, and already-prefixed URLs remain unchanged.
 *
 * Persisted document URLs should remain root-relative; call this only at a
 * rendering, navigation, or request boundary.
 */
export function sanitizeResourceUrl(
  url: string | null | undefined
): string | undefined {
  if (!url) {
    return undefined;
  }

  return sanitizeUrl(url.startsWith("/") ? withBasePath(url) : url);
}
