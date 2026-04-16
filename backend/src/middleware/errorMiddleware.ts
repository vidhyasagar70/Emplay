import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

interface HttpLikeError extends Error {
  statusCode?: number;
}

export function errorMiddleware(err: HttpLikeError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    logger.error('Unhandled server error', {
      requestId: _req.requestId,
      path: _req.originalUrl,
      method: _req.method,
      statusCode,
      error: err.message,
      stack: err.stack
    });
  } else {
    logger.warn('Handled request error', {
      requestId: _req.requestId,
      path: _req.originalUrl,
      method: _req.method,
      statusCode,
      error: err.message
    });
  }

  res.status(statusCode).json({
    error: message
  });
}
