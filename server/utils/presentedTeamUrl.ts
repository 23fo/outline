import type { Team } from "@server/models";
import env from "@server/env";

/**
 * Returns the public URL exposed to clients for a team, ensuring custom-domain
 * URLs include the configured deployment path. This is idempotent when the
 * model URL already contains the path.
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
