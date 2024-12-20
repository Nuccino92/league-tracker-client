/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.firstwefeast.com',
      },
      {
        protocol: 'https',
        hostname: 'as1.ftcdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
