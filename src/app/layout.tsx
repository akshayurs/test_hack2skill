/**
 * Root layout for the CarbonWise application.
 *
 * Implements:
 * - SEO meta tags and Open Graph data
 * - Accessible skip navigation
 * - Security headers via Next.js config
 * - Semantic HTML structure
 *
 * @module RootLayout
 * @version 1.0.0
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * Application metadata for SEO and social sharing.
 * Provides comprehensive meta tags for search engines and social platforms.
 */
export const metadata: Metadata = {
  title: {
    default: 'CarbonWise – Track & Reduce Your Carbon Footprint',
    template: '%s | CarbonWise',
  },
  description:
    'CarbonWise helps you understand, track, and reduce your carbon footprint through personalized insights, an interactive calculator, and actionable steps toward a sustainable future.',
  keywords: [
    'carbon footprint',
    'carbon calculator',
    'sustainability',
    'climate change',
    'carbon tracking',
    'eco-friendly',
    'carbon reduction',
    'green living',
    'environmental impact',
  ],
  authors: [{ name: 'CarbonWise Team' }],
  creator: 'CarbonWise',
  publisher: 'CarbonWise',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CarbonWise',
    title: 'CarbonWise – Track & Reduce Your Carbon Footprint',
    description:
      'Understand your environmental impact and take actionable steps toward a sustainable future.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarbonWise – Track & Reduce Your Carbon Footprint',
    description:
      'Understand your environmental impact and take actionable steps toward a sustainable future.',
  },
};

/**
 * Viewport configuration for responsive design.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

/**
 * Root layout component wrapping all pages.
 *
 * @param children - Page content to render within the layout
 * @returns The complete HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {/* Accessibility: Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link" id="skip-navigation">
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}
