/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        FE_URL: process.env.FE_URL
      },
};

export default nextConfig;
