import { JetBrains_Mono } from "next/font/google";

// Google Sans Flex is loaded via <link> in layout.tsx head, matching the
// main Productix app's brand font so both surfaces stay visually aligned.
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});
