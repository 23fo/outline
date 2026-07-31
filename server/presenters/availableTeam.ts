import type { Team } from "@server/models";
import presentedTeamUrl from "@server/utils/presentedTeamUrl";

export default function presentAvailableTeam(team: Team, isSignedIn = false) {
  return {
    id: team.id,
    name: team.name,
    avatarUrl: team.avatarUrl,
    url: presentedTeamUrl(team),
    isSignedIn,
  };
}
