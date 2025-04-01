/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the simplest possible config for Vercel compatibility
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Add trailing slash for better compatibility with some hosting setups
  trailingSlash: true,
  
  // Disable image optimization if it's causing issues
  images: {
    unoptimized: true,
  },
  
  // Simple headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 