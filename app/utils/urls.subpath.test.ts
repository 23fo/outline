import { vi } from "vitest";
import sharedEnv from "@shared/env";
import env from "~/env";
import { getRedirectUrl } from "./urls";

vi.mock("@shared/utils/domains", () => ({
  parseDomain: () => ({
    custom: false,
    teamSubdomain: false,
    host: "docs.example.com",
  }),
}));

const originalAppBasePath = env.BASE_PATH;
const originalAppUrl = env.URL;
const originalSharedBasePath = sharedEnv.BASE_PATH;

afterAll(() => {
  env.BASE_PATH = originalAppBasePath;
  env.URL = originalAppUrl;
  sharedEnv.BASE_PATH = originalSharedBasePath;
});

describe("getRedirectUrl", () => {
  it("adds the configured base path exactly once", () => {
    env.BASE_PATH = "/outline";
    env.URL = "https://docs.example.com/outline";
    sharedEnv.BASE_PATH = "/outline";

    expect(new URL(getRedirectUrl("/auth/oidc")).pathname).toBe(
      "/outline/auth/oidc"
    );
    expect(new URL(getRedirectUrl("/outline/auth/oidc")).pathname).toBe(
      "/outline/auth/oidc"
    );
  });

  it("keeps auth paths unchanged for root deployments", () => {
    env.BASE_PATH = "";
    env.URL = "https://docs.example.com";
    sharedEnv.BASE_PATH = "";

    expect(new URL(getRedirectUrl("/auth/oidc")).pathname).toBe("/auth/oidc");
  });
});
