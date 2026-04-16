import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';
import { HttpError } from '../utils/httpError';

type RequestSource = 'body' | 'params' | 'query';

export function validateRequest(schema: ZodTypeAny, source: RequestSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = source === 'params' ? req.params : source === 'query' ? req.query : req.body;
    const result = schema.safeParse(value);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return next(new HttpError(400, firstError.message));
    }

    if (source === 'params') {
      req.validatedParams = result.data;
    } else if (source === 'query') {
      req.validatedQuery = result.data;
    } else {
      req.validatedBody = result.data;
    }

    return next();
  };
}
