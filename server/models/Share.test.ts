import env from "@server/env";
import { buildShare, buildTeam } from "@server/test/factories";

const originalUrl = env.URL;

afterEach(() => {
  env.URL = originalUrl;
});

describe("Share", () => {
  describe("canonicalUrl", () => {
    it("preserves the application subpath for custom domains", async () => {
      env.URL = "https://app.example.com:3000/outline";
      const team = await buildTeam();
      const share = await buildShare({
        teamId: team.id,
        domain: "share.example.com",
      });

      expect(share.canonicalUrl).toBe(
        "https://share.example.com:3000/outline"
      );
    });

    it("leaves root deployments unchanged for custom domains", async () => {
      env.URL = "https://app.example.com";
      const team = await buildTeam();
      const share = await buildShare({
        teamId: team.id,
        domain: "share.example.com",
      });

      expect(share.canonicalUrl).toBe("https://share.example.com");
    });

    it("uses the team URL for regular shares", async () => {
      env.URL = "https://app.example.com/outline";
      const team = await buildTeam();
      const share = await buildShare({
        teamId: team.id,
        urlId: "public-share",
      });
      share.team = team;

      expect(share.canonicalUrl).toBe(
        "https://app.example.com/outline/s/public-share"
      );
    });
  });
});
