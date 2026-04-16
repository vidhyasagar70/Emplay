import { Router } from 'express';
import {
  handleCreatePrompt,
  handleGetPrompt,
  handleListPrompts,
  handleListTags
} from '../controllers/promptController';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { createPromptSchema, promptIdParamSchema, promptListQuerySchema } from '../schemas';

const promptRouter = Router();

promptRouter.get('/prompts', validateRequest(promptListQuerySchema, 'query'), handleListPrompts);
promptRouter.get('/prompts/:id', validateRequest(promptIdParamSchema, 'params'), handleGetPrompt);
promptRouter.post('/prompts', authMiddleware, validateRequest(createPromptSchema), handleCreatePrompt);
promptRouter.get('/tags', handleListTags);

export { promptRouter };
