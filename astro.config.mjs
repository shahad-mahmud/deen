import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://deen.shahadmahmud.com",
  // Downloaded at build time and served from this site (no request to Google from readers).
  fonts: [
    { provider: fontProviders.google(), name: "Noto Serif Bengali", cssVariable: "--font-bn", weights: [400, 700], subsets: ["bengali", "latin"], fallbacks: ["serif"] },
    { provider: fontProviders.google(), name: "Amiri", cssVariable: "--font-ar", weights: [400, 700], subsets: ["arabic"], fallbacks: ["serif"] },
  ],
});
