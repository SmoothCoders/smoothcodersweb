import { IService } from '@/lib/models/Service';
import { ICity } from '@/lib/models/City';

export interface GeneratedSEOContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  content: string;
  keywords: string[];
  slug: string;
  canonicalUrl: string;
  breadcrumbs: { name: string; url: string }[];
  structuredData: object;
  faqSchema?: object;
}

/**
 * Generate SEO-optimized content for a service in a specific city
 */
export function generateServicePageContent(
  service: IService,
  city: ICity
): GeneratedSEOContent {
  const serviceName = service.title;
  const cityName = city.name;
  const stateName = city.state;
  
  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  
  // Generate meta title (max 60 chars) - SEO optimized with power words
  // Shortened format to fit within 60 character limit
  let metaTitle = `${serviceName} ${cityName} | #1 ${currentYear}`;
  
  // Truncate if still too long
  if (metaTitle.length > 60) {
    // Try shorter format
    metaTitle = `${serviceName} in ${cityName}`;
    if (metaTitle.length > 60) {
      // Last resort: truncate service name
      const maxServiceNameLength = 60 - cityName.length - 6; // " in " = 4 chars, buffer = 2
      const shortServiceName = serviceName.length > maxServiceNameLength 
        ? serviceName.substring(0, maxServiceNameLength) + '...'
        : serviceName;
      metaTitle = `${shortServiceName} in ${cityName}`;
    }
  }
  
  // Generate meta description (max 160 chars) - SEO optimized with CTAs and keywords
  let metaDescription = `⭐ Expert ${serviceName} in ${cityName}, ${stateName}. 1000+ Projects | 24/7 Support | Free Consultation. Call +91 9021311559`;
  
  // Truncate if exceeds 160 characters
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.substring(0, 157) + '...';
  }
  
  // Generate page title - SEO friendly with location and dynamic year
  const title = `Best ${serviceName} Services in ${cityName} (${currentYear})`;
  
  // Generate slug
  const slug = `${city.slug}/${service.slug}`;
  
  // Generate canonical URL
  const canonicalUrl = `https://smoothcoders.com/${slug}`;
  
  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: cityName, url: `/${city.slug}` },
    { name: serviceName, url: `/${slug}` }
  ];
  
  // Generate comprehensive keywords for better SEO ranking
  const keywords = [
    // Primary keywords
    `${serviceName} ${cityName}`,
    `${serviceName} in ${cityName}`,
    `${serviceName} ${stateName}`,
    `best ${serviceName} ${cityName}`,
    `top ${serviceName} ${cityName}`,
    
    // Long-tail keywords
    ...(service.category ? [`${service.category} ${cityName}`] : []),
    `affordable ${serviceName} ${cityName}`,
    `professional ${serviceName} ${cityName}`,
    `expert ${serviceName} ${cityName}`,
    `${serviceName} company ${cityName}`,
    `${serviceName} agency ${cityName}`,
    `${serviceName} services near me`,
    
    // Location-based keywords
    `${serviceName} near ${cityName}`,
    `local ${serviceName} ${cityName}`,
    `${cityName} ${serviceName}`,
    
    // Action keywords
    `hire ${serviceName} ${cityName}`,
    `get ${serviceName} ${cityName}`,
    `${serviceName} consultation ${cityName}`,
    
    // Brand
    'SmoothCoders',
    service.slug,
    city.slug,
    
    // Year-specific (for freshness)
    `${serviceName} ${cityName} 2025`,
    `best ${serviceName} ${cityName} 2025`
  ];
  
  // Generate rich content
  const content = generateRichContent(service, city);
  
  // Generate structured data (Schema.org JSON-LD)
  const structuredData = generateStructuredData(service, city, canonicalUrl);
  
  // Generate FAQ schema
  const faqSchema = generateFAQSchema(service, city);
  
  return {
    metaTitle,
    metaDescription,
    title,
    content,
    keywords,
    slug,
    canonicalUrl,
    breadcrumbs,
    structuredData,
    faqSchema
  };
}

/**
 * Generate rich, SEO-optimized content for the page
 */
function generateRichContent(service: IService, city: ICity): string {
  const serviceName = service.title;
  const cityName = city.name;
  const stateName = city.state;
  const category = service.category || 'digital';
  const currentYear = new Date().getFullYear();
  
  return `
# ${serviceName} in ${cityName}, ${stateName} - Top Rated ${currentYear}

Are you searching for professional ${serviceName} services in ${cityName}? Look no further! SmoothCoders is your #1 trusted digital partner in ${stateName}, delivering exceptional ${category.toLowerCase()} solutions that drive real results for businesses like yours.

With over 10 years of experience and 1000+ successful projects, we've helped businesses across ${cityName} and ${stateName} achieve their digital goals. Our team of certified experts combines cutting-edge technology with proven strategies to deliver solutions that exceed expectations.

🎯 Why Choose SmoothCoders?
- ✅ Award-winning team of certified professionals
- ✅ 100% satisfaction guarantee
- ✅ Transparent pricing with no hidden costs
- ✅ 24/7 dedicated support team
- ✅ Fast turnaround time
- ✅ Free consultation and quote

## Why Choose SmoothCoders for ${serviceName} in ${cityName}?

At SmoothCoders, we understand the unique challenges businesses in ${cityName} face. Our team of expert developers and designers specialize in creating:

${service.features?.map(feature => `- ${feature}`).join('\n') || '- Cutting-edge solutions\n- User-friendly designs\n- Scalable architecture'}

## Benefits of Professional ${serviceName} in ${cityName}

### For Local Businesses in ${cityName}

- Local Expertise: We understand the ${cityName} market
- Quick Communication: Same time zone, faster responses
- On-Site Consultations: Available for meetings in ${cityName}
- Proven Track Record: Successfully served 100+ clients in ${stateName}

### Technical Excellence

- Modern technology stack
- Mobile-responsive design
- SEO-optimized from the ground up
- Fast loading times
- Secure and scalable

## Our ${serviceName} Services Include:

${service.description}

### Pricing

Starting from ₹${service.price.toLocaleString('en-IN')}

Custom quotes available based on your specific requirements

## Frequently Asked Questions

Q: How long does ${serviceName} take in ${cityName}?
A: Typical ${serviceName} projects take 2-8 weeks depending on complexity. We provide detailed timelines during consultation.

Q: Do you provide support after project completion?
A: Yes! We offer comprehensive maintenance and support packages for all our ${cityName} clients.

Q: Can I see examples of your work?
A: Absolutely! Check out our [portfolio](/portfolio) to see successful projects we've completed in ${cityName} and across ${stateName}.

Q: What makes SmoothCoders different from other ${serviceName} providers in ${cityName}?
A: Our combination of technical expertise, local market knowledge, transparent pricing, and commitment to client success sets us apart.

## Ready to Get Started?

Transform your digital presence with professional ${serviceName} services in ${cityName}. Contact SmoothCoders today for a free consultation and quote.

### Contact Us

- Phone: +91 9021311559
- Email: contact@smoothcoders.com
- Location: Serving ${cityName} and all of ${stateName}

## About SmoothCoders

SmoothCoders is a leading digital agency with over 10 years of experience in ${service.category || 'digital solutions'}. We've helped 1000+ businesses across India achieve their digital goals. Our ${cityName} team is dedicated to delivering:

- Quality: Award-winning designs and development
- Reliability: On-time delivery guaranteed
- Support: 24/7 customer support
- Value: Competitive pricing without compromising quality

Serving ${cityName}, ${stateName} and beyond since 2014
`;
}

/**
 * Generate Schema.org structured data
 */
function generateStructuredData(service: IService, city: ICity, url: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': `${service.title} in ${city.name}`,
    'description': service.seoDescription,
    'provider': {
      '@type': 'Organization',
      'name': 'SmoothCoders',
      'url': 'https://smoothcoders.com',
      'logo': 'https://smoothcoders.com/logo.png',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-9021311559',
        'contactType': 'Customer Service',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi', 'Marathi']
      },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': city.name,
        'addressRegion': city.state,
        'addressCountry': 'IN'
      }
    },
    'areaServed': {
      '@type': 'City',
      'name': city.name
    },
    'offers': {
      '@type': 'Offer',
      'price': service.price,
      'priceCurrency': 'INR',
      'url': url,
      'availability': 'https://schema.org/InStock'
    },
    'url': url,
    'image': service.image
  };
}

/**
 * Generate FAQ Schema
 */
function generateFAQSchema(service: IService, city: ICity): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `How long does ${service.title} take in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Typical ${service.title} projects in ${city.name} take 2-8 weeks depending on complexity. We provide detailed timelines during consultation.`
        }
      },
      {
        '@type': 'Question',
        'name': `What is the cost of ${service.title} in ${city.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${service.title} in ${city.name} starts from ₹${service.price.toLocaleString('en-IN')}. Final pricing depends on your specific requirements and project scope.`
        }
      },
      {
        '@type': 'Question',
        'name': `Do you provide support after ${service.title} completion?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes! We offer comprehensive maintenance and support packages for all our ${city.name} clients.`
        }
      }
    ]
  };
}

/**
 * Generate sitemap entry for a service page
 */
export function generateSitemapEntry(slug: string, updatedAt: Date) {
  return {
    url: `https://smoothcoders.com/${slug}`,
    lastModified: updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8
  };
}
