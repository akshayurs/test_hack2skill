import type { NextConfig } from 'next';

/**
 * Next.js configuration with security headers and performance optimizations.
 *
 * @security Implements comprehensive security headers including CSP, HSTS, and XSS protection
 * @see {@link https://nextjs.org/docs/app/api-reference/next-config-js} Next.js Config Docs
 */
const nextConfig: NextConfig = {
  /** Enable React strict mode for highlighting potential problems */
  reactStrictMode: true,

  /** Disable the X-Powered-By header to reduce information leakage */
  poweredByHeader: false,

  /**
   * Security headers applied to all routes.
   *
   * These headers protect against common web vulnerabilities:
   * - XSS (Cross-Site Scripting)
   * - Clickjacking
   * - MIME type sniffing
   * - Information leakage
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
