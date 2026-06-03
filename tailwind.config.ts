import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark base
        base: "#0a0a0f",
        card: "#13131c",
        "card-hover": "#181826",
        // Primary: blue + purple
        primary: "#5b7cfa",
        purple: "#a855f7",
        // Secondary: toned-down hot pink
        secondary: "#d6477e",
        "secondary-bright": "#ec5e94",
        // Text
        muted: "#9aa0b4",
        faint: "#6b7088",
        // Movement
        up: "#37d39a",
        down: "#fb7185",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
