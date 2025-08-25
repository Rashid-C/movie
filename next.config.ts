import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'img.omdbapi.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
}

export default nextConfig
