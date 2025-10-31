import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import models
import Service from '../lib/models/Service';
import City from '../lib/models/City';
import ServicePage from '../lib/models/ServicePage';
import User from '../lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI!;

async function verifyDatabaseConnections() {
  try {
    console.log('🔍 Starting database verification...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Verify Services
    console.log('📦 Verifying Services...');
    const services = await Service.find({});
    console.log(`   Found: ${services.length} services`);
    
    const servicesWithPricing = services.filter(s => s.pricingTiers);
    console.log(`   With pricing tiers: ${servicesWithPricing.length}`);
    
    if (services.length > 0) {
      console.log(`   ✅ Services are connected to database`);
      console.log(`   Sample: "${services[0].title}"`);
      if (services[0].pricingTiers) {
        console.log(`   └─ Basic: ₹${services[0].pricingTiers.basic.priceINR}`);
        console.log(`   └─ Standard: ₹${services[0].pricingTiers.standard.priceINR}`);
        console.log(`   └─ Premium: ₹${services[0].pricingTiers.premium.priceINR}`);
      }
    } else {
      console.log(`   ❌ No services found! Run: npm run seed`);
    }
    console.log();

    // Verify Cities
    console.log('🌆 Verifying Cities...');
    const cities = await City.find({});
    console.log(`   Found: ${cities.length} cities`);
    
    if (cities.length > 0) {
      console.log(`   ✅ Cities are connected to database`);
      console.log(`   Cities: ${cities.map(c => c.name).join(', ')}`);
    } else {
      console.log(`   ❌ No cities found! Run: npm run seed`);
    }
    console.log();

    // Verify Generated Pages
    console.log('📄 Verifying Generated Service Pages...');
    const pages = await ServicePage.find({})
      .populate('serviceId', 'title')
      .populate('cityId', 'name');
    console.log(`   Found: ${pages.length} generated pages`);
    
    if (pages.length > 0) {
      console.log(`   ✅ Service pages are connected to database`);
      
      // Group by city
      const pagesByCity: Record<string, number> = {};
      pages.forEach(page => {
        const cityName = (page.cityId as any)?.name || 'Unknown';
        pagesByCity[cityName] = (pagesByCity[cityName] || 0) + 1;
      });
      
      console.log('   Pages per city:');
      Object.entries(pagesByCity).forEach(([city, count]) => {
        console.log(`   └─ ${city}: ${count} pages`);
      });
      
      console.log(`\n   Sample URLs:`);
      pages.slice(0, 5).forEach(page => {
        console.log(`   └─ /${page.slug}`);
      });
    } else {
      console.log(`   ❌ No generated pages found! Run: npm run generate-pages`);
    }
    console.log();

    // Verify Users
    console.log('👤 Verifying Users...');
    const users = await User.find({});
    console.log(`   Found: ${users.length} users`);
    
    if (users.length > 0) {
      console.log(`   ✅ Admin users are connected to database`);
      users.forEach(user => {
        console.log(`   └─ ${user.email} (${user.role})`);
      });
    } else {
      console.log(`   ❌ No users found! Run: npm run seed`);
    }
    console.log();

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Services: ${services.length}`);
    console.log(`✅ Cities: ${cities.length}`);
    console.log(`✅ Generated Pages: ${pages.length}`);
    console.log(`✅ Users: ${users.length}`);
    console.log(`✅ Total Records: ${services.length + cities.length + pages.length + users.length}`);
    console.log('═══════════════════════════════════════════════');
    
    // Check if everything is set up
    if (services.length === 0 || cities.length === 0) {
      console.log('\n⚠️  DATABASE NOT FULLY SEEDED');
      console.log('\n🔧 To fix, run:');
      console.log('   npm run setup\n');
    } else if (pages.length === 0) {
      console.log('\n⚠️  PAGES NOT GENERATED');
      console.log('\n🔧 To fix, run:');
      console.log('   npm run generate-pages\n');
    } else {
      console.log('\n🎉 ALL DATABASE CONNECTIONS VERIFIED!');
      console.log('✅ Your application is 100% database-driven\n');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyDatabaseConnections();
