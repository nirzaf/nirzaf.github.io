/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',
  
  // Configure remote image patterns
  images: {
    unoptimized: true, // Required for static exports
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
  
  // Base path for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/nirzaf.github.io' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nirzaf.github.io/' : '',
};

module.exports = nextConfig;
