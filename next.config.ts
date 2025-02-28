import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'i.ibb.co',
      'res.cloudinary.com',
      'firebasestorage.googleapis.com',
      'source.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgflip.com',
      },
    ],
  },
}

export default nextConfig
