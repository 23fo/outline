import env from "../env";

/**
 * Returns the configured application base path without a trailing slash.
 * This works in both browser and server bundles.
 */
export function getBasePath(): string {
  let pathname = "";

  if (typeof env.BASE_PATH === "string") {
    pathname = env.BASE_PATH;
  } else {
    try {
      pathname = new URL(env.URL).pathname;
    } catch (_err) {
      return "";
    }
  }

  pathname = pathname.trim();
  if (!pathname || pathname === "/") {
    return "";
  }

  const normalized = `${pathname.startsWith("/") ? "" : "/"}${pathname}`
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");

  return normalized === "/" ? "" : normalized;
}

function hasBasePathPrefix(path: string, basePath: string): boolean {
  return (
    path === basePath ||
    path.startsWith(`${basePath}/`) ||
    path.startsWith(`${basePath}?`) ||
    path.startsWith(`${basePath}#`)
  );
}

/**
 * Prefixes an application-relative path with the configured base path.
 * Absolute URLs, protocol-relative URLs, and already-prefixed paths are
 * returned unchanged.
 */
export function withBasePath(
  path: string,
  basePath: string = getBasePath()
): string {
  if (!path || /^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("//")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!basePath || hasBasePathPrefix(normalizedPath, basePath)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
}

/**
 * Removes the configured base path from an application-relative path while
 * preserving its query string and fragment.
 */
export function withoutBasePath(path: string): string {
  const basePath = getBasePath();

  if (!basePath || !hasBasePathPrefix(path, basePath)) {
    return path;
  }

  const suffix = path.slice(basePath.length);
  if (!suffix) {
    return "/";
  }

  return suffix.startsWith("/") ? suffix : `/${suffix}`;
}
