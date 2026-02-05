/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nonaktifkan Turbopack
  experimental: {
    nextScriptWorkers: false
  },
  // Tambahkan konfigurasi untuk menghindari masalah dengan next/font
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Konfigurasi webpack yang lebih sederhana
    if (isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }

    return config;
  },
  // Konfigurasi untuk menangani service worker
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
};

module.exports = nextConfig;