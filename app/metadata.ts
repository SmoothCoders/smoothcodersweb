import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smoothcoders.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SmoothCoders - Transforming Ideas Into Digital Success',
    template: '%s | SmoothCoders'
  },
  description: 'Leading web development and digital marketing agency. We create stunning websites, mobile apps, and drive digital growth for businesses.',
  keywords: ['web development', 'digital marketing', 'mobile app development', 'SEO services', 'e-commerce solutions'],
  authors: [{ name: 'SmoothCoders' }],
  creator: 'SmoothCoders',
  publisher: 'SmoothCoders',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SmoothCoders',
    title: 'SmoothCoders - Transforming Ideas Into Digital Success',
    description: 'Leading web development and digital marketing agency.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SmoothCoders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmoothCoders - Transforming Ideas Into Digital Success',
    description: 'Leading web development and digital marketing agency.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
