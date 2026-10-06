/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sbtowcdpxtxrqbxyhixn.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'tohjlmehhnfhuvrkaujm.supabase.co',
      }
    ],
  },
};

export default nextConfig;
