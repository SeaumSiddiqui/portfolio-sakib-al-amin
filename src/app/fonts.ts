import { Inter_Tight, Space_Mono } from "next/font/google";

// Free pair. For the licensed pair, swap these for next/font/local loading
// Neue Haas Display 500 and PP Supply Mono 400 with the same `variable` names.
export const displayFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});

export const monoFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-face",
  display: "swap",
});
