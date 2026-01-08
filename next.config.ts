import NextBundleAnalyzer from '@next/bundle-analyzer'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Get backend API endpoint for image domains
const getBackendHostname = () => {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!apiEndpoint) return null
  try {
    const url = new URL(apiEndpoint)
    return url.hostname
  } catch {
    return null
  }
}

const backendHostname = getBackendHostname()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      },
      // Add backend hostname if available
      ...(backendHostname
        ? [
            {
              hostname: backendHostname,
              pathname: '/**'
            }
          ]
        : [])
    ]
  }
}
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})
export default withBundleAnalyzer(withNextIntl(nextConfig))
