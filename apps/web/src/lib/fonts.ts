import { JetBrains_Mono } from "next/font/google";

// Google Sans Flex is loaded via <link> in layout.tsx head.
// We export a minimal object that matches the shape expected by layout.tsx.
export const fontSans = {
  variable: "--font-sans-unused",
  className: "",
};

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
