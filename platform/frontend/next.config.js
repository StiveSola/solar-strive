/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_ARKADE_SERVER_URL: process.env.NEXT_PUBLIC_ARKADE_SERVER_URL || 'https://mutinynet.arkade.sh',
    NEXT_PUBLIC_ESPLORA_URL: process.env.NEXT_PUBLIC_ESPLORA_URL || 'https://mutinynet.com/api',
  },
}

module.exports = nextConfig