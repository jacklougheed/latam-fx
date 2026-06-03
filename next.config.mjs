/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enables instrumentation.ts so the background rate-refresher starts with the server.
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
