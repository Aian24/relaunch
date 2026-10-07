import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#C0622A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ReLaunch — Marketing, AI & Digital Services | Phoenix, AZ",
  description:
    "Everything your business needs. One subscription. From marketing to AI to web — pick the services that fit, bundle them together, and save. Pause or cancel anytime. No contracts.",
  keywords: [
    "ReLaunch",
    "Marketing Agency Phoenix",
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
    title: "ReLaunch — Marketing, AI & Digital Services",
    description:
      "Everything your business needs. One subscription. From marketing to AI to web — pick the services that fit, bundle them together, and save. Pause or cancel anytime. No contracts.",
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
      <body className="bg-white text-[#090D16] font-sans antialiased selection:bg-[#C0622A] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
