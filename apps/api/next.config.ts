import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/domain"],
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      // Include workspace packages in standalone build
      '/api/**': ['./packages/**'],
    },
  },
};

export default nextConfig;
