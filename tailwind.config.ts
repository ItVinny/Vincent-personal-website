import type { Config } from "tailwindcss";

const config: Config = {
  // "class" (not the default "media") so the public site's light/dark
  // toggle is user-controlled via a JS-applied class, rather than only
  // ever following the OS setting. Scoped to the public pages only --
  // the admin never applies the "dark" class and has no dark: variants
  // in its own classes, so it's unaffected either way.
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Admin dashboard typeface -- unchanged, Apple system fonts.
        display: [
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        body: [
          "SF Pro Text",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        // Public site typeface, per the MongoDB design system -- Inter
        // substitutes for Euclid Circular A (a paid commercial font).
        mongo: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
