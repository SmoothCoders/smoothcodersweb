import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import City from '@/lib/models/City';
import ServicePage from '@/lib/models/ServicePage';
import { generateServicePageContent } from '@/lib/utils/seo-generator';

// POST /api/admin/generate-pages - Generate service pages for a city
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { cityId } = await request.json();
    
    if (!cityId) {
      return NextResponse.json(
        { success: false, error: 'City ID is required' },
        { status: 400 }
      );
    }
    
    // Get the city
    const city = await City.findById(cityId);
    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }
    
    // Get all active services
    const services = await Service.find({ isActive: true });
    
    if (services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active services found' },
        { status: 400 }
      );
    }
    
    const generatedPages: any[] = [];
    const skippedPages: string[] = [];
    const errors: any[] = [];
    
    // Generate a page for each service
    for (const service of services) {
      try {
        // Check if page already exists
        const existingPage = await ServicePage.findOne({
          serviceId: service._id,
          cityId: city._id
        });
        
        if (existingPage) {
          skippedPages.push(`${city.name} - ${service.title} (already exists)`);
          continue;
        }
        
        // Generate SEO content
        const seoContent = generateServicePageContent(service, city);
        
        // Create the service page
        const servicePage = await ServicePage.create({
          serviceId: service._id,
          cityId: city._id,
          title: seoContent.title,
          metaTitle: seoContent.metaTitle,
          metaDescription: seoContent.metaDescription,
          keywords: seoContent.keywords,
          content: seoContent.content,
          slug: seoContent.slug,
          canonicalUrl: seoContent.canonicalUrl,
          breadcrumbs: seoContent.breadcrumbs,
          structuredData: seoContent.structuredData,
          faqSchema: seoContent.faqSchema,
          isGenerated: true
        });
        
        generatedPages.push({
          service: service.title,
          city: city.name,
          slug: seoContent.slug,
          url: `/${seoContent.slug}`
        });
      } catch (error: any) {
        errors.push({
          service: service.title,
          error: error.message
        });
      }
    }
    
    // Update city's pagesGenerated flag
    await City.findByIdAndUpdate(cityId, {
      pagesGenerated: true,
      generatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: `Generated ${generatedPages.length} pages for ${city.name}`,
      data: {
        generated: generatedPages,
        skipped: skippedPages,
        errors: errors,
        summary: {
          totalServices: services.length,
          pagesGenerated: generatedPages.length,
          pagesSkipped: skippedPages.length,
          errors: errors.length
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/generate-pages - Regenerate/update pages for a city
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { cityId } = await request.json();
    
    if (!cityId) {
      return NextResponse.json(
        { success: false, error: 'City ID is required' },
        { status: 400 }
      );
    }
    
    // Get the city
    const city = await City.findById(cityId);
    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }
    
    // Get all active services
    const services = await Service.find({ isActive: true });
    
    const updatedPages: any[] = [];
    const errors: any[] = [];
    
    // Update each service page
    for (const service of services) {
      try {
        // Find existing page
        const existingPage = await ServicePage.findOne({
          serviceId: service._id,
          cityId: city._id
        });
        
        // Generate fresh SEO content
        const seoContent = generateServicePageContent(service, city);
        
        if (existingPage) {
          // Update existing page
          await ServicePage.findByIdAndUpdate(existingPage._id, {
            title: seoContent.title,
            metaTitle: seoContent.metaTitle,
            metaDescription: seoContent.metaDescription,
            keywords: seoContent.keywords,
            content: seoContent.content,
            slug: seoContent.slug,
            canonicalUrl: seoContent.canonicalUrl,
            breadcrumbs: seoContent.breadcrumbs,
            structuredData: seoContent.structuredData,
            faqSchema: seoContent.faqSchema,
            isGenerated: true
          });
          
          updatedPages.push({
            service: service.title,
            city: city.name,
            action: 'updated'
          });
        } else {
          // Create new page
          await ServicePage.create({
            serviceId: service._id,
            cityId: city._id,
            ...seoContent,
            isGenerated: true
          });
          
          updatedPages.push({
            service: service.title,
            city: city.name,
            action: 'created'
          });
        }
      } catch (error: any) {
        errors.push({
          service: service.title,
          error: error.message
        });
      }
    }
    
    // Update city's generatedAt timestamp
    await City.findByIdAndUpdate(cityId, {
      pagesGenerated: true,
      generatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: `Updated pages for ${city.name}`,
      data: {
        updated: updatedPages,
        errors: errors,
        summary: {
          totalServices: services.length,
          pagesUpdated: updatedPages.length,
          errors: errors.length
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
