import env from "../env";
import { sanitizeResourceUrl } from "./resourceUrl";

const originalBasePath = env.BASE_PATH;

afterEach(() => {
  if (originalBasePath === undefined) {
    delete env.BASE_PATH;
  } else {
    env.BASE_PATH = originalBasePath;
  }
});

describe("sanitizeResourceUrl", () => {
  it("prefixes root-relative resources with the configured base path", () => {
    env.BASE_PATH = "/outline";

    expect(sanitizeResourceUrl("/api/attachments.redirect?id=123")).toBe(
      "/outline/api/attachments.redirect?id=123"
    );
  });

  it("does not duplicate an existing base path", () => {
    env.BASE_PATH = "/outline";

    expect(
      sanitizeResourceUrl("/outline/api/attachments.redirect?id=123")
    ).toBe("/outline/api/attachments.redirect?id=123");
  });

  it("leaves root-relative resources unchanged for root deployments", () => {
    env.BASE_PATH = "";

    expect(sanitizeResourceUrl("/api/attachments.redirect?id=123")).toBe(
      "/api/attachments.redirect?id=123"
    );
  });

  it("leaves absolute and protocol-relative resources unchanged", () => {
    env.BASE_PATH = "/outline";

    expect(sanitizeResourceUrl("https://cdn.example.com/file.pdf")).toBe(
      "https://cdn.example.com/file.pdf"
    );
    expect(sanitizeResourceUrl("//cdn.example.com/file.pdf")).toBe(
      "//cdn.example.com/file.pdf"
    );
  });

  it("returns undefined for empty resources", () => {
    expect(sanitizeResourceUrl(undefined)).toBeUndefined();
    expect(sanitizeResourceUrl(null)).toBeUndefined();
    expect(sanitizeResourceUrl("")).toBeUndefined();
  });
});
