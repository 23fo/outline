function normalizePathname(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "/" ? "" : normalized;
}

/** Returns the websocket path served by the collaboration service. */
export function collaborationPath(url: string): string {
  return `${normalizePathname(new URL(url).pathname)}/collaboration`;
}
