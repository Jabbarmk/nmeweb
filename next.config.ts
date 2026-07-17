import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.nmeapp.in",
        pathname: "/public/upload/**",
      },
      // Local XAMPP API during development (NME_API_BASE_URL=http://localhost/...)
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
