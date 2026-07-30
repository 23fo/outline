import { signin } from "@shared/utils/routeHelpers";
import env from "@server/env";
import type { Plugin, Hook } from "@server/utils/PluginManager";

export default function presentProviderConfig(
  config: Plugin<Hook.AuthProvider>
) {
  return {
    id: config.value.id,
    name: config.name,
    authUrl: `${env.basePath}${signin(config.value.id)}`,
  };
}
