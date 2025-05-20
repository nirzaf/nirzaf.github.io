/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure remote image patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.f-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.freelancer.com',
        pathname: '/**',
      },
    ],
  },
  // Add other configuration options
  reactStrictMode: true,
  // Increase the timeout for builds on Vercel
  experimental: {
    // Empty for now
  },
};

module.exports = nextConfig;
