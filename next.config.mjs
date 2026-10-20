/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pg', 'stripe'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
