import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "mkzzdadkyu.ufs.sh",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
