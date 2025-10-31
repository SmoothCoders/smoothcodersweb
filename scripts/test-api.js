const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testAPI() {
  try {
    console.log('🧪 TESTING DATABASE & APIs\n');
    console.log('='.repeat(80) + '\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const db = mongoose.connection.db;

    // Test 1: Check Cities
    console.log('TEST 1: Checking Cities...');
    const cities = await db.collection('cities').find({}).toArray();
    console.log(`Found ${cities.length} cities:\n`);

    if (cities.length > 0) {
      for (const city of cities) {
        console.log(`📍 ${city.name}, ${city.state}`);
        console.log(`   ID: ${city._id}`);
        console.log(`   Slug: ${city.slug || 'MISSING'}`);
        console.log(`   Has metaTitle: ${city.metaTitle ? 'YES (OLD SCHEMA!)' : 'No'}`);
        console.log(`   Has landmarks: ${city.landmarks ? 'Yes' : 'No'}`);
        console.log(`   Pages Generated: ${city.pagesGenerated ? 'Yes' : 'No'}`);
        console.log('');
      }
    } else {
      console.log('❌ No cities found!\n');
    }

    // Test 2: Check Services
    console.log('TEST 2: Checking Services...');
    const services = await db.collection('services').find({}).toArray();
    console.log(`Found ${services.length} services:\n`);

    if (services.length > 0) {
      for (const service of services) {
        console.log(`📦 ${service.title}`);
        console.log(`   ID: ${service._id}`);
        console.log(`   Slug: ${service.slug || 'MISSING'}`);
        console.log(`   Active: ${service.isActive ? 'Yes' : 'No'}`);
        console.log('');
      }
    } else {
      console.log('❌ No services found!\n');
    }

    // Test 3: Check Service Pages
    console.log('TEST 3: Checking Service Pages...');
    const servicePages = await db.collection('servicepages').find({}).toArray();
    console.log(`Found ${servicePages.length} service pages:\n`);

    if (servicePages.length > 0) {
      // Group by city
      const pagesByCity = {};
      for (const page of servicePages) {
        const cityId = page.cityId ? page.cityId.toString() : 'Unknown';
        if (!pagesByCity[cityId]) pagesByCity[cityId] = [];
        pagesByCity[cityId].push(page);
      }

      for (const [cityId, cityPages] of Object.entries(pagesByCity)) {
        const city = cities.find(c => c._id.toString() === cityId);
        console.log(`📍 ${city ? city.name : 'Unknown City'} (${cityPages.length} pages):`);
        
        for (const page of cityPages) {
          console.log(`   - ${page.title || page.slug}`);
          console.log(`     Meta Title: ${page.metaTitle || 'MISSING'}`);
          console.log(`     URL: /${page.slug}`);
        }
        console.log('');
      }
    } else {
      console.log('❌ No service pages found!');
      console.log('ℹ️  You need to click "Generate Pages" for each city\n');
    }

    // Test 4: Test API endpoint
    if (cities.length > 0) {
      console.log('TEST 4: Testing API Endpoint...');
      const firstCity = cities[0];
      console.log(`Testing: GET /api/admin/cities/${firstCity._id}\n`);

      // Import the City model
      const CityModel = require('../lib/models/City').default;
      
      try {
        const cityFromModel = await CityModel.findById(firstCity._id).lean();
        if (cityFromModel) {
          console.log('✅ City model can read the city');
          console.log(`   Name: ${cityFromModel.name}`);
          console.log(`   State: ${cityFromModel.state}`);
          console.log(`   Slug: ${cityFromModel.slug}`);
        } else {
          console.log('❌ City model returned null!');
          console.log('   This means there\'s a schema mismatch.');
          console.log('   Run: node scripts/migrate-existing-data.js');
        }
      } catch (error) {
        console.log('❌ Error reading city with model:');
        console.log(`   ${error.message}`);
        console.log('\n   Run: node scripts/migrate-existing-data.js');
      }
      console.log('');
    }

    await mongoose.connection.close();

    console.log('='.repeat(80));
    console.log('\n📋 SUMMARY:\n');
    console.log(`   Cities: ${cities.length}`);
    console.log(`   Services: ${services.length}`);
    console.log(`   Service Pages: ${servicePages.length}\n`);

    // Recommendations
    console.log('💡 RECOMMENDATIONS:\n');
    
    const oldCities = cities.filter(c => c.metaTitle || c.metaDescription);
    if (oldCities.length > 0) {
      console.log('⚠️  ACTION REQUIRED:');
      console.log(`   ${oldCities.length} cities have old schema (metaTitle/metaDescription)`);
      console.log('   Run: node scripts/migrate-existing-data.js\n');
    }

    if (cities.length > 0 && servicePages.length === 0) {
      console.log('⚠️  ACTION RECOMMENDED:');
      console.log('   You have cities but no service pages');
      console.log('   Go to /admin/cities and click "Generate Pages"\n');
    }

    if (services.length === 0) {
      console.log('ℹ️  No services found');
      console.log('   Add services at /admin/services/new\n');
    }

    if (cities.length === 0) {
      console.log('ℹ️  No cities found');
      console.log('   Add cities at /admin/cities/new\n');
    }

    if (oldCities.length === 0 && cities.length > 0 && services.length > 0) {
      console.log('✅ Everything looks good!');
      console.log('   Your data schema is up to date.\n');
    }

    console.log('🚀 Next: Start dev server and test UI');
    console.log('   npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.log('\nMake sure:');
    console.log('- MongoDB is running');
    console.log('- MONGODB_URI is set in .env.local\n');
    process.exit(1);
  }
}

testAPI();
