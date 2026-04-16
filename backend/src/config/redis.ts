import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

let allowReconnect = true;

export const redisClient = createClient({
  url: env.redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (!allowReconnect) {
        return false;
      }

      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => {
  logger.error('Redis client error', {
    error: err.message || String(err),
    name: err.name,
    code: (err as Error & { code?: string }).code
  });
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

async function stopReconnectAttempts() {
  allowReconnect = false;

  if (redisClient.isOpen) {
    try {
      await redisClient.disconnect();
    } catch {
      // Ignore teardown errors while intentionally disabling Redis in dev mode.
    }
  }
}

export async function disableRedisClient() {
  await stopReconnectAttempts();
}

export async function connectRedis() {
  if (env.disableRedis) {
    logger.warn('Redis disabled by DISABLE_REDIS=true. Continuing without view counter support.');
    await stopReconnectAttempts();
    return;
  }

  if (!redisClient.isOpen) {
    // Set a 5-second timeout for initial connection
    const connectionPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout (5s)')), 5000)
    );
    
    try {
      await Promise.race([connectionPromise, timeoutPromise]);
    } catch (err) {
      // In development, stop retry loops so logs don't spam while app runs degraded.
      if (env.nodeEnv !== 'production') {
        await stopReconnectAttempts();
      }

      // Connection failed or timed out - let error propagate for handling in index.ts
      throw err;
    }
  }

  // Test with ping, also with timeout
  try {
    const pingPromise = redisClient.ping();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis ping timeout (2s)')), 2000)
    );
    await Promise.race([pingPromise, timeoutPromise]);
  } catch (err) {
    if (env.nodeEnv !== 'production') {
      await stopReconnectAttempts();
    }

    throw new Error(`Redis ping failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
