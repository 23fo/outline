import type { Context } from "koa";
import Koa from "koa";
import Router from "koa-router";
import { TeamPreference } from "@shared/types";
import {
  authorizationServerMetadataPath,
  protectedResourceMetadataPath,
} from "@shared/utils/oauthMetadata";
import env from "@server/env";
import { getTeamFromContext } from "@server/utils/passport";

const app = new Koa();
const router = new Router();

function originForRequest(ctx: Context): string {
  return env.isCloudHosted
    ? ctx.request.URL.origin
    : new URL(env.URL).origin;
}

router.get(authorizationServerMetadataPath(env.basePath), async (ctx) => {
  const base = `${originForRequest(ctx)}${env.basePath}`;
  const team = await getTeamFromContext(ctx, { includeOAuthState: false });
  const mcpEnabled = team?.getPreference(TeamPreference.MCP) ?? true;

  ctx.body = {
    issuer: base,
    authorization_endpoint: `${base}/oauth/authorize`,
    token_endpoint: `${base}/oauth/token`,
    revocation_endpoint: `${base}/oauth/revoke`,
    ...(!env.OAUTH_DISABLE_DCR &&
      mcpEnabled && {
        registration_endpoint: `${base}/oauth/register`,
      }),
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: ["read", "write"],
  };
});

router.get(
  protectedResourceMetadataPath(`${env.basePath}/mcp`),
  async (ctx) => {
    const team = await getTeamFromContext(ctx, { includeOAuthState: false });
    const mcpEnabled = team?.getPreference(TeamPreference.MCP) ?? true;

    if (!mcpEnabled) {
      ctx.status = 404;
      return;
    }

    const base = `${originForRequest(ctx)}${env.basePath}`;
    ctx.body = {
      resource: `${base}/mcp`,
      authorization_servers: [base],
      scopes_supported: ["read", "write"],
      bearer_methods_supported: ["header"],
    };
  }
);

app.use(router.routes());

export default app;
