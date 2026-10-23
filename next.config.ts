import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export required for Capacitor mobile build
  // When deploying to Vercel, remove `output: 'export'` — Vercel handles SSR natively
  // For mobile APK build: `npm run build:mobile` sets NEXT_STATIC_EXPORT=true
  ...(process.env.NEXT_STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    // Required for static export — Next.js image optimisation needs a server
    unoptimized: true,
  },
  // Allow Capacitor live-reload server in development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
