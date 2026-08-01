import env from "@server/env";
import presentedTeamUrl from "./presentedTeamUrl";

const originalUrl = env.URL;

afterEach(() => {
  env.URL = originalUrl;
});

describe("presentedTeamUrl", () => {
  it("preserves the application subpath for custom domains", () => {
    env.URL = "https://app.example.com/outline";

    expect(
      presentedTeamUrl({
        domain: "docs.example.com",
        url: "https://docs.example.com",
      })
    ).toBe("https://docs.example.com/outline");
  });

  it("does not duplicate an existing application subpath", () => {
    env.URL = "https://app.example.com/outline";

    expect(
      presentedTeamUrl({
        domain: "docs.example.com",
        url: "https://docs.example.com/outline",
      })
    ).toBe("https://docs.example.com/outline");
  });

  it("leaves root deployments unchanged", () => {
    env.URL = "https://app.example.com";

    expect(
      presentedTeamUrl({
        domain: "docs.example.com",
        url: "https://docs.example.com",
      })
    ).toBe("https://docs.example.com");
  });

  it("leaves non-custom-domain URLs unchanged", () => {
    env.URL = "https://app.example.com/outline";

    expect(
      presentedTeamUrl({
        domain: null,
        url: "https://app.example.com/outline",
      })
    ).toBe("https://app.example.com/outline");
  });
});
