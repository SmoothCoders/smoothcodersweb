import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import ServicePage from '../lib/models/ServicePage';

const MONGODB_URI = process.env.MONGODB_URI!;

async function clearPages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await ServicePage.deleteMany({});
    console.log('✅ All service pages deleted');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearPages();
