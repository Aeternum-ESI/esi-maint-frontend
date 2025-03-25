import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    /* config options here */
};

export default nextConfig;
