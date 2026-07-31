import { collaborationPath } from "./collaborationUrl";

describe("collaborationPath", () => {
  it("uses the root path for a dedicated collaboration origin", () => {
    expect(collaborationPath("wss://collab.example.com")).toBe(
      "/collaboration"
    );
  });

  it("preserves a configured collaboration subpath", () => {
    expect(collaborationPath("wss://collab.example.com/ws")).toBe(
      "/ws/collaboration"
    );
  });

  it("normalizes a trailing slash", () => {
    expect(collaborationPath("wss://collab.example.com/ws/")).toBe(
      "/ws/collaboration"
    );
  });
});
