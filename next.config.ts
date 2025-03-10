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
  // webpack: (config, { isServer }) => {
  //   config.infrastructureLogging = {
  //     level: "verbose", // 开启 Webpack 详细日志
  //     debug: /.*/, // 匹配所有调试信息
  //   };
  //   return config;
  // },
};

export default nextConfig;
