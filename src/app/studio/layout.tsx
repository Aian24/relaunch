import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReLaunch Studio · Fresh Video Ads Every Week",
  description:
    "New AI video ads for Meta and TikTok every week, improved from what performed. Designed to sell, built on your schedule.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
