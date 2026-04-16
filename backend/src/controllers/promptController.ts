/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import {
  createPromptWithTags,
  fetchPromptById,
  listPrompts,
  listTags,
  PromptPayload
} from '../services/promptService';

export async function handleListPrompts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as { tag?: string };
    const prompts = await listPrompts(query.tag);
    res.status(200).json(prompts);
  } catch (err) {
    next(err);
  }
}

export async function handleGetPrompt(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.validatedParams as { id: string };
    const prompt = await fetchPromptById(params.id);
    res.status(200).json(prompt);
  } catch (err) {
    next(err);
  }
}

export async function handleCreatePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    const prompt = await createPromptWithTags(req.validatedBody as PromptPayload);
    res.status(201).json(prompt);
  } catch (err) {
    next(err);
  }
}

export async function handleListTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await listTags();
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
}
