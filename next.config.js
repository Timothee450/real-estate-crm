/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.249:3000'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
}

module.exports = nextConfig 