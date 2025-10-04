// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
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
