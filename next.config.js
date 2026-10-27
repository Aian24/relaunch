/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
