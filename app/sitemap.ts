import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import ServicePage from '@/lib/models/ServicePage';
import Service from '@/lib/models/Service';
import City from '@/lib/models/City';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const baseUrl = 'https://smoothcoders.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Get all service pages
  const servicePages = await ServicePage.find({})
    .select('slug updatedAt')
    .lean();

  const servicePagesUrls: MetadataRoute.Sitemap = servicePages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Get all cities
  const cities = await City.find({ isActive: true })
    .select('slug updatedAt')
    .lean();

  const cityUrls: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(city.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePagesUrls, ...cityUrls];
}
