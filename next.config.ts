import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Optimize production build
  poweredByHeader: false,
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Reduce preload warnings and optimize
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    optimizeCss: true,
  },
  
  // Turbopack config (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
