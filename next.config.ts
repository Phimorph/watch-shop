import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV === 'development'

// No nonces: they force every page to render per request and would defeat the prerendered shell.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    localPatterns: [{ pathname: '/media/**' }],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    // Uploads live in public/media and are served as static files first; this catches
    // ones added after the build, which only Payload's file route knows about.
    return [{ source: '/media/:file', destination: '/api/media/file/:file' }]
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // The admin panel needs its own inline scripts and blobs; the public site gets the strict policy.
        source: '/((?!admin|api).*)',
        headers: [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }],
      },
      {
        // Uploads are served as static files typed by extension; nothing in them may run.
        source: '/media/:path*',
        headers: [{ key: 'Content-Security-Policy', value: "default-src 'none'; sandbox" }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
