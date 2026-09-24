import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // The Blue Eye is a mostly static, content-rich guide site. The weather
  // section is rendered by a Server Component that fetches Open-Meteo on the
  // server (cached). No extra OpenNext overrides are needed.
});
