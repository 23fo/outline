import { embedAppRoot } from "./embeds";

describe("embedAppRoot", () => {
  it("preserves the configured application subpath", () => {
    expect(embedAppRoot("https://docs.example.com", "/outline")).toBe(
      "https://docs.example.com/outline/"
    );
  });

  it("leaves root deployments unchanged", () => {
    expect(embedAppRoot("https://docs.example.com", "")).toBe(
      "https://docs.example.com/"
    );
  });
});
