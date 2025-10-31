import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ServicePage from './ServicePageContent';
import { connectDB } from '@/lib/mongodb';
import ServicePageModel from '@/lib/models/ServicePage';

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  await connectDB();
  
  const { city, service } = await params;
  const slug = `${city}/${service}`;
  const page = await ServicePageModel.findOne({ slug })
    .populate('serviceId')
    .populate('cityId')
    .lean();

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const serviceData = page.serviceId as any;
  const imageUrl = serviceData?.image || '/og-image.jpg';

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://smoothcoders.com/${slug}`,
      siteName: 'SmoothCoders',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: page.canonicalUrl,
    },
  };
}

// Main page component
export default async function Page({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  await connectDB();
  
  const { city, service } = await params;
  const slug = `${city}/${service}`;
  const page = await ServicePageModel.findOne({ slug })
    .populate('serviceId')
    .populate('cityId')
    .lean();

  if (!page) {
    notFound();
  }

  // Convert MongoDB document to plain object
  const pageData = JSON.parse(JSON.stringify(page));

  return <ServicePage page={pageData} />;
}

// Generate static paths for ISR
export async function generateStaticParams() {
  await connectDB();
  
  const pages = await ServicePageModel.find({})
    .select('slug')
    .limit(100) // Limit for initial build
    .lean();

  return pages.map((page) => {
    const [city, service] = page.slug.split('/');
    return {
      city,
      service,
    };
  });
}

// Enable ISR with revalidation
export const revalidate = 86400; // Revalidate every 24 hours
