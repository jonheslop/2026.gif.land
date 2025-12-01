// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({
    // Important: Use advanced mode for proper Functions support
    mode: "advanced",

    // Let Pages manage the Functions directory structure
    runtime: {
      mode: "local",
      persistTo: "./functions",
    },

    // Platform proxy for local dev with R2
    platformProxy: {
      enabled: true,
      configPath: "wrangler.toml",
    },
  }),
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "soehne",
        cssVariable: "--font-soehne",
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/fonts/soehne-web-buch.woff2"],
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/fonts/soehne-web-buch-kursiv.woff2"],
          },
          // ...
        ],
      },
    ],
  },
});
