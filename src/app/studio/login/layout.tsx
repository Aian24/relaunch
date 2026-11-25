import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In · ReLaunch Studio Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
