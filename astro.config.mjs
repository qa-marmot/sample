import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  integrations: [tailwind()],

  devToolbar: { enabled: false },

  output: isDev ? "static" : "server",

  ...(isDev
    ? {}
    : {
        adapter: cloudflare({ imageService: "cloudflare" }),
      }),
});
