import mongoose from 'mongoose';
import { connectMongo } from './config/mongo';
import { seedSamplePrompts } from './services/seedService';

async function run() {
  await connectMongo();
  const result = await seedSamplePrompts();
  console.log(`Seed complete: inserted=${result.inserted}, skipped=${result.skipped}`);
}

run()
  .catch((err) => {
    console.error('Seed failed:', err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });