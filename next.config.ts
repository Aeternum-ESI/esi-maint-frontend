import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "avatar.iran.liara.run",
                port : "",
                pathname:"/**"
            }
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    redirects: async () => [
        {
            source: "/dashboard",
            destination: "/dashboard/overview",
            permanent: false,
        },
    ],
    /* config options here */
};

export default nextConfig;
