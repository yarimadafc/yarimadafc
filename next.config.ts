import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['sbtowcdpxtxrqbxyhixn.supabase.co'],
  },
};

export default withNextIntl(nextConfig);
