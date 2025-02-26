import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /leaflet\/dist\/images\//,
            type: "asset/resource",
        });
        return config;
    },
    images: {
        unoptimized: true, // Disables Next.js image optimization (fixes sharp issue)
    },
};

export default nextConfig;
