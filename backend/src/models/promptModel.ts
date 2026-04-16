import { Schema, model } from 'mongoose';

export interface PromptRow {
  id: string;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  tags: string[];
}

interface PromptDocument {
  _id: string;
  title: string;
  content: string;
  complexity: number;
  tags: string[];
  created_at: Date;
}

const promptSchema = new Schema<PromptDocument>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    complexity: { type: Number, required: true, min: 1, max: 10 },
    tags: { type: [String], default: [] },
    created_at: { type: Date, default: () => new Date() }
  },
  {
    versionKey: false
  }
);

promptSchema.index({ created_at: -1 });
promptSchema.index({ tags: 1 });

const PromptModel = model<PromptDocument>('Prompt', promptSchema);

function toPromptRow(document: PromptDocument): PromptRow {
  return {
    id: document._id,
    title: document.title,
    content: document.content,
    complexity: document.complexity,
    created_at: document.created_at.toISOString(),
    tags: document.tags
  };
}

export async function getAllPrompts(tag?: string): Promise<PromptRow[]> {
  const filter = tag ? { tags: tag } : {};
  const prompts = await PromptModel.find(filter).sort({ created_at: -1 }).lean<PromptDocument[]>();
  return prompts.map(toPromptRow);
}

export async function getPromptById(id: string): Promise<PromptRow | null> {
  const prompt = await PromptModel.findById(id).lean<PromptDocument | null>();
  return prompt ? toPromptRow(prompt) : null;
}

export async function createPrompt(input: {
  id: string;
  title: string;
  content: string;
  complexity: number;
  tags?: string[];
}): Promise<PromptRow> {
  const created = await PromptModel.create({
    _id: input.id,
    title: input.title,
    content: input.content,
    complexity: input.complexity,
    tags: input.tags ?? []
  });

  return toPromptRow(created.toObject() as PromptDocument);
}

export async function getAllTags(): Promise<Array<{ id: string; name: string }>> {
  const tags = (await PromptModel.distinct('tags')) as string[];
  return tags.sort((left, right) => left.localeCompare(right)).map((tag) => ({ id: tag, name: tag }));
}

export async function countPrompts(): Promise<number> {
  return PromptModel.countDocuments();
}
