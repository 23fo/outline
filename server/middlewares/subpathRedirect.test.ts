import type { Context } from "koa";
import { vi } from "vitest";
import sharedEnv from "@shared/env";
import subpathRedirect from "./subpathRedirect";

const originalBasePath = sharedEnv.BASE_PATH;

afterEach(() => {
  if (originalBasePath === undefined) {
    delete sharedEnv.BASE_PATH;
  } else {
    sharedEnv.BASE_PATH = originalBasePath;
  }
});

function createContext(location?: string) {
  const set = vi.fn();
  const ctx = {
    response: {
      get: vi.fn(() => location),
    },
    set,
  } as unknown as Context;

  return { ctx, set };
}

describe("subpathRedirect", () => {
  it("leaves responses without a Location header unchanged", async () => {
    sharedEnv.BASE_PATH = "/outline";
    const { ctx, set } = createContext();
    const next = vi.fn(async () => undefined);

    await subpathRedirect("/outline")(ctx, next);

    expect(next).toHaveBeenCalledOnce();
    expect(set).not.toHaveBeenCalled();
  });

  it("prefixes a root-relative redirect", async () => {
    sharedEnv.BASE_PATH = "/outline";
    const { ctx, set } = createContext("/auth/oidc");

    await subpathRedirect("/outline")(ctx, async () => undefined);

    expect(set).toHaveBeenCalledWith("Location", "/outline/auth/oidc");
  });

  it("does not duplicate an existing base path", async () => {
    sharedEnv.BASE_PATH = "/outline";
    const { ctx, set } = createContext("/outline/auth/oidc");

    await subpathRedirect("/outline")(ctx, async () => undefined);

    expect(set).toHaveBeenCalledWith("Location", "/outline/auth/oidc");
  });

  it("leaves absolute redirects unchanged", async () => {
    sharedEnv.BASE_PATH = "/outline";
    const { ctx, set } = createContext("https://id.example.com/authorize");

    await subpathRedirect("/outline")(ctx, async () => undefined);

    expect(set).not.toHaveBeenCalled();
  });

  it("does not rewrite redirects for root deployments", async () => {
    sharedEnv.BASE_PATH = "";
    const { ctx, set } = createContext("/auth/oidc");

    await subpathRedirect("")(ctx, async () => undefined);

    expect(set).not.toHaveBeenCalled();
  });
});
