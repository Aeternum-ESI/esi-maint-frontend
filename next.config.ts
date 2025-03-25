import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true,
    },
    images: {
        domains: ["lh3.googleusercontent.com"],
    },
    /* config options here */
};

export default nextConfig;
