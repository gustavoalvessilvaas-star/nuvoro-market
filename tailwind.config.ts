import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        graphite: "#17202a",
        night: "#0c1220",
        moss: "#256f62",
        mint: "#dff6ee",
        aqua: "#38d5c9",
        blue: "#3b82f6",
        violet: "#7c3aed",
        coral: "#e85d4f",
        gold: "#f4bf45",
        cloud: "#f5f7fb",
        line: "#dbe3ea"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(17, 24, 39, 0.12)",
        glow: "0 20px 70px rgba(56, 213, 201, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
