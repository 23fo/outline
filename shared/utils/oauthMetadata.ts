function normalizePathname(pathname: string): string {
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
}

/** Returns the RFC 8414 authorization-server metadata path for an issuer. */
export function authorizationServerMetadataPath(issuerPath: string): string {
  return `/.well-known/oauth-authorization-server${normalizePathname(
    issuerPath
  )}`;
}

/** Returns the RFC 9728 protected-resource metadata path for a resource. */
export function protectedResourceMetadataPath(resourcePath: string): string {
  return `/.well-known/oauth-protected-resource${normalizePathname(
    resourcePath
  )}`;
}
