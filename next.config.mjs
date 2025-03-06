/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  images: {
    domains: [
      "avatar.vercel.sh",
      "trees.firstasia.edu.ph",
      "uiffmgyykbhewphigjsf.supabase.co",
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern:
        /^https:\/\/uiffmgyykbhewphigjsf\.supabase\.co\/storage\/v1\/object\/public\/snapfolia\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "model-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/trees\.firstasia\.edu\.ph\/api\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
