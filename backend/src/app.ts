import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { promptRouter } from './routes/promptRoutes';
import { authRouter } from './routes/authRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { requestContextMiddleware } from './middleware/requestContextMiddleware';
import { notFoundMiddleware } from './middleware/notFoundMiddleware';
import { logger } from './utils/logger';

const app = express();

morgan.token('request-id', (req) => (req as { requestId?: string }).requestId ?? '-');

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl
  })
);
app.use(requestContextMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(
  morgan(':method :url :status :response-time ms reqId=:request-id', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', authRouter);
app.use('/', promptRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
