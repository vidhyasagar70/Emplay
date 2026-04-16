import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function buildRedisUrlFromParts(): string | undefined {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = Number(process.env.REDIS_PORT || 6379);
  const db = Number(process.env.REDIS_DB || 0);
  const password = process.env.REDIS_PASSWORD;

  const hasExplicitPart =
    Boolean(process.env.REDIS_HOST) ||
    Boolean(process.env.REDIS_PORT) ||
    Boolean(process.env.REDIS_DB) ||
    typeof process.env.REDIS_PASSWORD === 'string';

  if (!hasExplicitPart) {
    return undefined;
  }

  const auth = password ? `:${encodeURIComponent(password)}@` : '';
  return `redis://${auth}${host}:${port}/${db}`;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  mongoUri:
    process.env.MONGODB_URI ||
    (isProduction ? undefined : 'mongodb://127.0.0.1:27017/ai_prompts'),
  redisUrl:
    process.env.REDIS_URL ||
    buildRedisUrlFromParts() ||
    (isProduction ? undefined : 'redis://localhost:6379'),
  disableRedis: process.env.DISABLE_REDIS === 'true',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  authUsername: process.env.AUTH_USERNAME || 'admin',
  authPassword: process.env.AUTH_PASSWORD || 'admin123'
};

if (isProduction && !env.mongoUri) {
  throw new Error('MONGODB_URI is required');
}

if (isProduction && !env.redisUrl && !env.disableRedis) {
  throw new Error('REDIS_URL is required');
}
