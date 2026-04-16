import { randomUUID } from 'crypto';
import { createPrompt, getAllPrompts } from '../models/promptModel';
import { samplePrompts } from '../data/samplePrompts';

export async function seedSamplePrompts(): Promise<{ inserted: number; skipped: boolean }> {
  const existingPrompts = await getAllPrompts();
  const existingTitles = new Set(existingPrompts.map((prompt) => prompt.title.trim().toLowerCase()));
  const missingPrompts = samplePrompts.filter((prompt) => !existingTitles.has(prompt.title.trim().toLowerCase()));

  if (missingPrompts.length === 0) {
    return { inserted: 0, skipped: true };
  }

  for (const prompt of missingPrompts) {
    await createPrompt({
      id: randomUUID(),
      title: prompt.title,
      content: prompt.content,
      complexity: prompt.complexity,
      tags: prompt.tags
    });
  }

  return { inserted: missingPrompts.length, skipped: false };
}