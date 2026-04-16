import { randomUUID } from 'crypto';
import {
  createPrompt,
  getAllPrompts,
  getAllTags,
  getPromptById
} from '../models/promptModel';
import { redisClient } from '../config/redis';
import { HttpError } from '../utils/httpError';

export interface PromptPayload {
  title: string;
  content: string;
  complexity: number;
  tags?: string[];
}

function normalizeTags(tags?: string[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map((tag) => String(tag || '').trim().toLowerCase()).filter(Boolean))];
}

export async function listPrompts(tag?: string) {
  return getAllPrompts(tag ? String(tag).trim().toLowerCase() : undefined);
}

export async function fetchPromptById(id: string) {
  const prompt = await getPromptById(id);
  if (!prompt) {
    throw new HttpError(404, 'Prompt not found');
  }

  if (!redisClient.isReady) {
    throw new HttpError(503, 'View counter is temporarily unavailable');
  }

  const key = `prompt:${id}:views`;
  const viewCount = await redisClient.incr(key);

  return {
    ...prompt,
    view_count: Number(viewCount)
  };
}

export async function createPromptWithTags(payload: PromptPayload) {
  const promptId = randomUUID();

  const tags = normalizeTags(payload.tags);

  await createPrompt({
    id: promptId,
    title: payload.title,
    content: payload.content,
    complexity: payload.complexity,
    tags
  });

  return getPromptById(promptId);
}

export async function listTags() {
  return getAllTags();
}
