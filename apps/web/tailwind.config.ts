import type { Config } from "tailwindcss";
import basePreset from "../../packages/config/tailwind/base";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/editor/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  presets: [basePreset as Config],
  plugins: [],
};

export default config;
