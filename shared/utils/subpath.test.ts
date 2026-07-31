import env from "../env";
import {
  getBasePath,
  withBasePath,
  withoutBasePath,
} from "./subpath";
import { sanitizeImageSrc } from "./urls";

const originalBasePath = env.BASE_PATH;
const originalUrl = env.URL;

afterAll(() => {
  env.BASE_PATH = originalBasePath;
  env.URL = originalUrl;
});

describe("subpath", () => {
  beforeEach(() => {
    env.BASE_PATH = "/outline";
    env.URL = "https://example.com/outline";
  });

  it("returns the configured base path", () => {
    expect(getBasePath()).toBe("/outline");
  });

  it("prefixes application-relative paths once", () => {
    expect(withBasePath("/api/auth.info")).toBe("/outline/api/auth.info");
    expect(withBasePath("/outline/api/auth.info")).toBe(
      "/outline/api/auth.info"
    );
  });

  it("leaves external URLs unchanged", () => {
    expect(withBasePath("https://example.net/image.png")).toBe(
      "https://example.net/image.png"
    );
    expect(withBasePath("//example.net/image.png")).toBe(
      "//example.net/image.png"
    );
  });

  it("removes the base path while preserving suffixes", () => {
    expect(withoutBasePath("/outline")).toBe("/");
    expect(withoutBasePath("/outline/home?draft=true#top")).toBe(
      "/home?draft=true#top"
    );
    expect(withoutBasePath("/other/home")).toBe("/other/home");
  });

  it("prefixes root-relative image sources at render time", () => {
    expect(sanitizeImageSrc("/api/attachments.redirect?id=1")).toBe(
      "/outline/api/attachments.redirect?id=1"
    );
    expect(sanitizeImageSrc("https://example.net/image.png")).toBe(
      "https://example.net/image.png"
    );
  });

  it("does not add a prefix for root deployments", () => {
    env.BASE_PATH = "";
    env.URL = "https://example.com";

    expect(withBasePath("/api/auth.info")).toBe("/api/auth.info");
  });
});
