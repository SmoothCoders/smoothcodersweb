// Database Optimization Script
// Run: node optimize-database.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function optimizeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections\n`);

    // Optimize each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`🔧 Optimizing: ${collectionName}`);

      try {
        // Get collection stats before
        const statsBefore = await db.command({ collStats: collectionName });
        console.log(`  📏 Size before: ${(statsBefore.size / 1024).toFixed(2)} KB`);
        console.log(`  📄 Documents: ${statsBefore.count}`);

        // Compact collection (MongoDB 4.4+)
        try {
          await db.command({ compact: collectionName, force: true });
          console.log(`  ✓ Compacted`);
        } catch (e) {
          console.log(`  ⚠ Compact not supported or failed`);
        }

        // Rebuild indexes
        await db.collection(collectionName).reIndex();
        console.log(`  ✓ Indexes rebuilt`);

        // Get stats after
        const statsAfter = await db.command({ collStats: collectionName });
        const savedKB = (statsBefore.size - statsAfter.size) / 1024;
        console.log(`  📏 Size after: ${(statsAfter.size / 1024).toFixed(2)} KB`);
        console.log(`  💾 Saved: ${savedKB.toFixed(2)} KB`);
        console.log(``);
      } catch (error) {
        console.log(`  ❌ Error optimizing ${collectionName}:`, error.message);
        console.log(``);
      }
    }

    // Add recommended indexes for performance
    console.log('📇 Adding performance indexes...\n');

    // Users collection
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('  ✓ users: email index');
    } catch (e) { /* Index may already exist */ }

    // Services collection  
    try {
      await db.collection('services').createIndex({ slug: 1 }, { unique: true });
      await db.collection('services').createIndex({ isActive: 1 });
      console.log('  ✓ services: slug, isActive indexes');
    } catch (e) { /* Indexes may already exist */ }

    // Cities collection
    try {
      await db.collection('cities').createIndex({ slug: 1 }, { unique: true });
      await db.collection('cities').createIndex({ isActive: 1 });
      console.log('  ✓ cities: slug, isActive indexes');
    } catch (e) { /* Indexes may already exist */ }

    // Service Pages collection
    try {
      await db.collection('servicepages').createIndex({ citySlug: 1, serviceSlug: 1 }, { unique: true });
      await db.collection('servicepages').createIndex({ isActive: 1 });
      console.log('  ✓ servicepages: composite and isActive indexes');
    } catch (e) { /* Indexes may already exist */ }

    // Inquiries collection
    try {
      await db.collection('inquiries').createIndex({ email: 1 });
      await db.collection('inquiries').createIndex({ status: 1 });
      await db.collection('inquiries').createIndex({ createdAt: -1 });
      console.log('  ✓ inquiries: email, status, createdAt indexes');
    } catch (e) { /* Indexes may already exist */ }

    // Contacts collection
    try {
      await db.collection('contacts').createIndex({ email: 1 });
      await db.collection('contacts').createIndex({ createdAt: -1 });
      console.log('  ✓ contacts: email, createdAt indexes');
    } catch (e) { /* Indexes may already exist */ }

    // Settings collection
    try {
      await db.collection('settings').createIndex({ key: 1 }, { unique: true });
      console.log('  ✓ settings: key index');
    } catch (e) { /* Index may already exist */ }

    console.log('\n✅ Database optimization complete!\n');

    // Show final database stats
    const dbStats = await db.stats();
    console.log('📊 Database Statistics:');
    console.log(`  Collections: ${dbStats.collections}`);
    console.log(`  Indexes: ${dbStats.indexes}`);
    console.log(`  Data Size: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Storage Size: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Index Size: ${(dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run optimization
optimizeDatabase();
