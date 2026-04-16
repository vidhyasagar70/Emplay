# AI Prompt Library

Production-ready full-stack application to create, browse, and inspect AI image generation prompts with Redis-backed view counters.

## Project Overview

This project provides a practical prompt management platform with cleanly separated frontend and backend responsibilities:

- Angular frontend for list/detail/create/login flows
- TypeScript Express API with layered architecture
- MongoDB for prompt persistence and tag lookup
- Redis as the source of truth for live view counters
- Docker Compose for consistent multi-service runtime

## Tech Stack

- Frontend: Angular 21, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Zod, JWT
- Database: MongoDB 7
- Cache: Redis 7
- DevOps: Docker, Docker Compose

## Why This Stack

I chose Node.js and MongoDB for this submission because I am more comfortable shipping quickly with that stack, which helped me keep the implementation focused and stable under the time limit.

Practical advantages for this project:

- MongoDB matches the prompt data shape well, especially the prompt content and tags array.
- The document model keeps the backend simpler and reduces schema-migration overhead.
- Node.js lets the API and frontend integration stay in the same language family.
- The stack is easy to containerize and demo consistently with Docker Compose.

## Features

### Core Features

- Prompt listing with tag filter
- Prompt detail page with live Redis-backed view counter
- Prompt creation form with strict validation
- Empty/loading/error states across pages

### Security and Auth

- Login endpoint issuing JWT access token
- Protected prompt creation endpoint
- Request validation for body/query/params
- Security headers via Helmet

### Data Modeling

- Prompt document with UUID ID, title, content, complexity, created_at, and tags
- Tags are stored on the prompt document and surfaced through the API

## Architecture Explanation

Backend follows a clean layered structure:

- config: environment, MongoDB, Redis configuration
- routes: HTTP route wiring
- controllers: request/response orchestration
- services: business logic (view counting, prompt creation)
- models: MongoDB document layer
- middleware: auth, validation, not-found, error handling
- utils: logger and reusable primitives

Request flow:

1. Route receives request
2. Validation middleware sanitizes and validates input
3. Controller delegates to service
4. Service executes business logic and calls model layer
5. Model interacts with MongoDB through a typed document layer
6. Response returned through controller

## Redis View Counter Logic

On `GET /prompts/:id`:

1. Prompt is loaded from MongoDB by UUID
2. Redis key `prompt:<id>:views` is incremented with `INCR`
3. Incremented value is returned as `view_count`

Redis is treated as source of truth for views. If Redis is unavailable, the endpoint returns `503` to avoid inconsistent counters.

## API Endpoints

### Health

- `GET /health`

### Auth

- `POST /auth/login`

Request body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Prompts

- `GET /prompts`
- `GET /prompts?tag=anime`
- `GET /prompts/:id`
- `POST /prompts` (requires `Authorization: Bearer <token>`)

Example `POST /prompts` body:

```json
{
  "title": "Cyberpunk Skyline",
  "content": "Create a cinematic aerial shot of a neon cyberpunk skyline with rain reflections and volumetric fog.",
  "complexity": 8,
  "tags": ["cyberpunk", "city", "rain"]
}
```

### Tags

- `GET /tags`

## Setup Instructions

### Run with Docker (Recommended)

1. Create env file from template:

```bash
cp .env.example .env
```

2. Build and run all services:

```bash
docker-compose up --build
```

3. Access services:

- Frontend: http://localhost:4200
- Backend: http://localhost:4000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Run Locally (Without Docker)

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Root `.env` (compose):

- `MONGODB_URI`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `JWT_SECRET`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`

Backend `.env`:

- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`

## Production Notes

- Request IDs are attached to logs and responses
- MongoDB indexes support tag filtering and created_at sorting
- Docker services include health checks and startup ordering
- Runtime containers run as non-root user

## Screenshots

Add screenshots here:

- `docs/screenshots/prompt-list.png`
- `docs/screenshots/prompt-detail.png`
- `docs/screenshots/add-prompt.png`
- `docs/screenshots/login.png`

## Future Improvements

- Refresh-token strategy and token revocation
- Pagination and cursor-based prompt listing
- Rate limiting and abuse protection middleware
- E2E tests (Cypress/Playwright) and contract tests
- Observability stack (OpenTelemetry + centralized log sink)
- Frontend environment injection for API URL at runtime
