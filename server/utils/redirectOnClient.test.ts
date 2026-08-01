import { resolveClientRedirectUrl } from "./redirectOnClient";

describe("resolveClientRedirectUrl", () => {
  it("prefixes root-relative redirects with the application subpath", () => {
    expect(resolveClientRedirectUrl("/oauth/authorize?code=test", "/outline")).toBe(
      "/outline/oauth/authorize?code=test"
    );
  });

  it("does not duplicate an existing application subpath", () => {
    expect(
      resolveClientRedirectUrl(
        "/outline/oauth/authorize?code=test",
        "/outline"
      )
    ).toBe("/outline/oauth/authorize?code=test");
  });

  it("leaves absolute and root deployment URLs unchanged", () => {
    expect(
      resolveClientRedirectUrl(
        "https://docs.example.com/outline/home",
        "/outline"
      )
    ).toBe("https://docs.example.com/outline/home");
    expect(resolveClientRedirectUrl("/home", "")).toBe("/home");
  });
});
