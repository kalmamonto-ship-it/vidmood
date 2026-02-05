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
};

module.exports = nextConfig;