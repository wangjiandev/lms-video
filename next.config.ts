import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'epx-lms.fly.storage.tigris.dev',
        port: '',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
