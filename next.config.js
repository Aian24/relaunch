/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/chicago-dog-42",
        destination: "/work/chicago-dog-42",
      },
      {
        source: "/carmen-hotel",
        destination: "/work/carmen-hotel",
      },
      {
        source: "/property-appraiser",
        destination: "/work/property-appraiser",
      },
      {
        source: "/aspiration-bank",
        destination: "/work/aspiration-bank",
      },
      {
        source: "/turflife-2",
        destination: "/work/turflife-2",
      },
      {
        source: "/turflife",
        destination: "/work/turflife-2",
      },
      {
        source: "/swing-perfect",
        destination: "/work/swing-perfect",
      },
      {
        source: "/audit-tool",
        destination: "http://127.0.0.1:3001/audit.html",
      },
      {
        source: "/audit.html",
        destination: "http://127.0.0.1:3001/audit.html",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/method",
        destination: "/social",
        permanent: true,
      },
      {
        source: "/ai",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/enterprise",
        destination: "/custom-software",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
