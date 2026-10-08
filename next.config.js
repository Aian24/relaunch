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
    ];
  },
};

module.exports = nextConfig;
