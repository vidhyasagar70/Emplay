import { app } from './app';
import { env } from './config/env';
import { connectMongo } from './config/mongo';
import { connectRedis, disableRedisClient } from './config/redis';
import { seedSamplePrompts } from './services/seedService';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    await connectMongo();
  } catch (err) {
    logger.error('Failed to connect to MongoDB. Check MONGODB_URI.', {
      error: err instanceof Error ? err.message : String(err)
    });

    throw err;
  }

  try {
    await connectRedis();
  } catch (err) {
    if (env.nodeEnv === 'production') {
      throw err;
    }

    await disableRedisClient();

    logger.warn('Redis connection failed in development mode. Continuing with degraded behavior.', {
      error: err instanceof Error ? err.message : String(err)
    });
  }

  if (env.nodeEnv !== 'production') {
    try {
      const seedResult = await seedSamplePrompts();

      if (seedResult.skipped) {
        logger.info('Sample prompts seed skipped because prompts already exist');
      } else {
        logger.info('Sample prompts seeded', { inserted: seedResult.inserted });
      }
    } catch (err) {
      logger.error('Failed to seed sample prompts', {
        error: err instanceof Error ? err.message : String(err)
      });
      throw err;
    }
  }

  app.listen(env.port, () => {
    logger.info('Backend server started', {
      port: env.port,
      nodeEnv: env.nodeEnv
    });
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap server', { error: err.message, stack: err.stack });
  process.exit(1);
});
