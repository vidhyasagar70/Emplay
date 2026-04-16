import { createHash, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

export interface LoginPayload {
  username: string;
  password: string;
}

function safeStringCompare(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();

  return timingSafeEqual(leftHash, rightHash);
}

export async function login(payload: LoginPayload) {
  if (!safeStringCompare(payload.username, env.authUsername)) {
    throw new HttpError(401, 'Invalid credentials');
  }

  if (!safeStringCompare(payload.password, env.authPassword)) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ username: payload.username }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn']
  });

  return {
    access_token: token,
    token_type: 'Bearer',
    expires_in: env.jwtExpiresIn
  };
}
