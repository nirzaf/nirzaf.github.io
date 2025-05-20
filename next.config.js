/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/nirzaf.github.io' : '';

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
  basePath,
  
  // Asset prefix for GitHub Pages
  assetPrefix: isProd ? `${basePath}/` : '',
  
  // Optional: Add trailing slash for GitHub Pages
  trailingSlash: true,
  
  // Optional: Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Optional: Configure webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
