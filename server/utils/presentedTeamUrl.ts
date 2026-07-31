import type { Team } from "@server/models";
import env from "@server/env";

/**
 * Returns the public URL exposed to clients for a team. Custom-domain team
 * URLs are generated without the application pathname, so add the configured
 * deployment path at the presentation boundary.
 */
export default function presentedTeamUrl(
  team: Pick<Team, "domain" | "url">
): string {
  if (!team.domain || !env.basePath) {
    return team.url;
  }

  const url = new URL(team.url);
  url.pathname = env.basePath;
  return url.href.replace(/\/$/, "");
}
