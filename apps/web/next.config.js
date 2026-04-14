/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@admin/ui', '@admin/supabase'],
}

module.exports = nextConfig
