import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingRequestId = req.header('x-request-id');
  const requestId = incomingRequestId?.trim() || randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  next();
}
