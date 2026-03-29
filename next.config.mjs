/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },

                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },

                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },

                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },

                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },

                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;",
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [
                    {
                        type: "header",
                        key: "x-forwarded-proto",
                        value: "http",
                    },
                ],
                destination: "https://nariaholidays.com/:path*",
                permanent: true,
            },
        ];
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
    },
};

export default nextConfig;
