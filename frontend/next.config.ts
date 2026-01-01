import type { NextConfig } from "next";

// "https://sgp1.digitaloceanspaces.com/profilm/other/20251223162154_4b81e4ad.png" remote image example
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgp1.digitaloceanspaces.com",
        port: "",
        pathname: "/profilm/**",
      },
      {
        protocol: "https",
        hostname: "profilm.sgp1.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
