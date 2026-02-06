/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC completely to avoid Windows compatibility issues
  swcMinify: false,
  experimental: {
    nextScriptWorkers: false,
  },
  // Also disable experimental Turbopack
  webpack: (config, { isServer }) => {
    // Add fallback for fs module in server environment
    if (isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }

    return config;
  },
  // Configuration for handling service worker
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
  // Unoptimized images to avoid build issues
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;