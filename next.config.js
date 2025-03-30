/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimize images and improve performance
  images: {
    domains: ['via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable webpack persistent caching
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },
  // Enable full static optimization where possible
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Minimize all JavaScript output
  poweredByHeader: false,
}

module.exports = nextConfig 