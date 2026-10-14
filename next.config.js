/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
