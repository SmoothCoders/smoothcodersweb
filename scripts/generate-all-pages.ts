import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import models
import City from '../lib/models/City';
import Service from '../lib/models/Service';
import ServicePage from '../lib/models/ServicePage';
import { generateServicePageContent } from '../lib/utils/seo-generator';

const MONGODB_URI = process.env.MONGODB_URI!;

async function generateAllPages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all active cities
    const cities = await City.find({ isActive: true });
    console.log(`\n📍 Found ${cities.length} active cities`);

    // Get all active services
    const services = await Service.find({ isActive: true });
    console.log(`🛠️  Found ${services.length} active services\n`);

    let totalGenerated = 0;
    let totalSkipped = 0;

    // Generate pages for each city
    for (const city of cities) {
      console.log(`\n🌆 Generating pages for ${city.name}, ${city.state}...`);
      
      for (const service of services) {
        const slug = `${city.slug}/${service.slug}`;
        
        // Check if page already exists
        const existingPage = await ServicePage.findOne({ slug });
        
        if (existingPage) {
          console.log(`  ⏭️  Skipped: ${slug} (already exists)`);
          totalSkipped++;
          continue;
        }

        // Generate SEO content using AI
        const seoContent = await generateServicePageContent(service, city);

        // Create the service page
        const newPage = await ServicePage.create({
          slug,
          title: `${service.title} in ${city.name}`,
          metaTitle: seoContent.metaTitle,
          metaDescription: seoContent.metaDescription,
          keywords: seoContent.keywords,
          canonicalUrl: `https://smoothcoders.com/${slug}`,
          content: seoContent.content,
          serviceId: service._id,
          cityId: city._id,
          structuredData: seoContent.structuredData,
          faqSchema: seoContent.faqSchema,
          isActive: true,
        });

        console.log(`  ✅ Created: ${slug}`);
        totalGenerated++;
      }

      // Mark city as having pages generated
      await City.findByIdAndUpdate(city._id, {
        pagesGenerated: true,
        generatedAt: new Date(),
      });
    }

    console.log(`\n\n🎉 Page generation complete!`);
    console.log(`   Generated: ${totalGenerated} new pages`);
    console.log(`   Skipped: ${totalSkipped} existing pages`);
    console.log(`   Total pages in database: ${totalGenerated + totalSkipped}\n`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error generating pages:', error);
    process.exit(1);
  }
}

generateAllPages();
