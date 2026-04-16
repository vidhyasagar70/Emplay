import { z } from 'zod';

const titleSchema = z
  .string()
  .trim()
  .min(3, 'Title must be at least 3 characters long')
  .max(255, 'Title must be at most 255 characters long')
  .refine((value) => !/[<>]/.test(value), 'Input contains invalid characters');

const contentSchema = z
  .string()
  .trim()
  .min(20, 'Content must be at least 20 characters long')
  .max(5000, 'Content must be at most 5000 characters long')
  .refine((value) => !/[<>]/.test(value), 'Input contains invalid characters');

export const createPromptSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  complexity: z.coerce
    .number({ invalid_type_error: 'Complexity must be a number between 1 and 10' })
    .int('Complexity must be an integer')
    .min(1, 'Complexity must be at least 1')
    .max(10, 'Complexity must be at most 10'),
  tags: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'Tag cannot be empty')
        .max(50, 'Tag must be at most 50 characters')
        .regex(/^[a-z0-9-]+$/, 'Tag can only contain lowercase letters, numbers, and hyphens')
    )
    .max(10, 'Maximum 10 tags are allowed')
    .optional()
    .default([])
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(100, 'Username is too long'),
  password: z.string().min(1, 'Password is required').max(200, 'Password is too long')
});

export const promptIdParamSchema = z.object({
  id: z.string().uuid('Invalid prompt id format')
});

export const promptListQuerySchema = z.object({
  tag: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'Tag can only contain lowercase letters, numbers, and hyphens')
    .optional()
});
