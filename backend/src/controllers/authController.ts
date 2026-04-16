import { NextFunction, Request, Response } from 'express';
import { login, LoginPayload } from '../services/authService';

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await login(req.validatedBody as LoginPayload);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
