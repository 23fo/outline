import { normalizeHost } from "./urls";

describe("normalizeHost", () => {
  it("defaults to https when no protocol is given", () => {
    expect(normalizeHost("app.getoutline.com")).toBe(
      "https://app.getoutline.com"
    );
  });

  it("preserves an explicit protocol", () => {
    expect(normalizeHost("http://localhost:3000")).toBe(
      "http://localhost:3000"
    );
  });

  it("preserves paths and strips trailing slashes", () => {
    expect(normalizeHost("https://docs.example.com/")).toBe(
      "https://docs.example.com"
    );
    expect(normalizeHost("docs.example.com/outline/")).toBe(
      "https://docs.example.com/outline"
    );
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeHost("  app.getoutline.com  ")).toBe(
      "https://app.getoutline.com"
    );
  });

  it("throws on an unparseable host", () => {
    expect(() => normalizeHost("not a url")).toThrow();
  });
});
