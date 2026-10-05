import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "india.indewild.com",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
};

export default nextConfig;
