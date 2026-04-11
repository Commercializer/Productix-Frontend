import type { Config } from "tailwindcss";
import basePreset from "../../packages/config/tailwind/base";

const config: Config = {
  content: [
    "./stories/**/*.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  presets: [basePreset as Config],
  plugins: [],
};

export default config;
