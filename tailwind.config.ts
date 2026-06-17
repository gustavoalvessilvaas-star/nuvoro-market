import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        moss: "#37685b",
        mint: "#e8f4ef",
        coral: "#d85c45",
        cloud: "#f7f8f6",
        line: "#dfe6e1"
      },
      boxShadow: {
        soft: "0 16px 48px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
