import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedParams?: unknown;
      validatedQuery?: unknown;
      user?: JwtPayload | string;
      requestId?: string;
    }
  }
}

export {};
