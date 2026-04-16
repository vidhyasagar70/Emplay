import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let connectionInitialized = false;

function getMongoTarget(uri: string): string {
  try {
    const parsed = new URL(uri);
    return `${parsed.hostname}:${parsed.port || '27017'}/${parsed.pathname.replace(/^\//, '') || 'ai_prompts'}`;
  } catch {
    return 'unknown-target';
  }
}

export async function connectMongo() {
  if (connectionInitialized && mongoose.connection.readyState === 1) {
    return;
  }

  connectionInitialized = true;

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected', { target: getMongoTarget(env.mongoUri || '') });
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB client error', {
      error: err instanceof Error ? err.message : String(err),
      name: err instanceof Error ? err.name : 'Error'
    });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.mongoUri || 'mongodb://127.0.0.1:27017/ai_prompts');
}