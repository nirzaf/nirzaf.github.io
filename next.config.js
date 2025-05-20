/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/nirzaf.github.io' : '';

const nextConfig = {
  // Enable static exports for GitHub Pages but exclude API routes
  output: 'export',
  
  // Skip API routes during static export
  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/blog': { page: '/blog' },
      '/search': { page: '/search' },
      '/tags': { page: '/tags' },
    };
    
    // Add blog post pages
    const { getAllPosts } = await import('./src/lib/mdxUtils');
    const posts = await getAllPosts();
    
    posts.forEach((post) => {
      paths[`/blog/${post.slug}`] = { page: '/blog/[slug]' };
    });
    
    // Add tag pages
    const tags = [...new Set(posts.flatMap(post => post.tags || []))];
    tags.forEach(tag => {
      paths[`/tags/${tag}`] = { page: '/tags/[tag]' };
    });
    
    return paths;
  },
  
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
