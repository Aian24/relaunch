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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#090D16] font-sans antialiased selection:bg-[#FF6700] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
