import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FF6700",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://relaunch.us"),
  title: "ReLaunch — Marketing Strategically Designed to Sell",
  description:
    "We strategize, create, and deliver marketing built to sell — and you can see it in your numbers. Marketing, websites, ads and custom software for small businesses across the U.S., Canada, the UK and Australia.",
  keywords: [
    "ReLaunch",
    "Small Business Marketing Agency",
    "Marketing Agency Phoenix",
    "Marketing Strategically Designed to Sell",
    "AI Automation",
    "Web Development",
    "Subscription Marketing",
    "PPC Advertising",
    "Local SEO",
    "ReLaunch Social",
    "Custom Software Development",
  ],
  authors: [{ name: "ReLaunch Marketing & Advertising" }],
  creator: "ReLaunch",
  openGraph: {
    title: "ReLaunch — Marketing Strategically Designed to Sell",
    description:
      "We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.",
    url: "https://relaunch.us",
    siteName: "ReLaunch",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

import Providers from "@/components/Providers";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className={`${inter.className} bg-white text-[#090D16] font-sans antialiased selection:bg-[#FF6700] selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
