/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  // For standalone Docker builds
  output: 'standalone',
}

module.exports = nextConfig