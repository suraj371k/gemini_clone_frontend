import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint during build
  },
};

module.exports = nextConfig;


export default nextConfig;
