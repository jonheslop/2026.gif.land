// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import varlockAstroIntegration from '@varlock/astro-integration';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
  integrations: [varlockAstroIntegration()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.local(),
        name: "soehne",
        cssVariable: "--font-soehne",
        options: {
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
      },
    ],
  },
});
