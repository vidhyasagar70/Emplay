# AI Prompt Library

Production-ready full-stack application for creating, browsing, and inspecting AI image-generation prompts with Redis-backed view counters.

## Project Overview

This project is organized as a practical prompt management platform with a clean split between the frontend and backend:

- Angular frontend for list, detail, create, and login flows
- TypeScript Express API with a layered architecture
- MongoDB for prompt persistence and tag lookup
- Redis as the source of truth for live view counters
- Docker Compose for a consistent multi-service runtime

## Assignment Coverage

The original assignment asked for Angular, Python/Django, PostgreSQL, and Redis, with permission to use another feasible stack if needed. This implementation uses Angular, Node.js, MongoDB, and Redis, which still satisfies the product goals and bonus scope while keeping the system production-ready.

Implemented requirements:

- Prompt list, detail, and add-prompt UI
- Reactive form validation for title, content, and complexity
- Prompt API with list, create, and detail endpoints
- Redis-backed live view counter returned in prompt detail responses
- Login flow and protected prompt creation endpoint
- Tag filtering support in the UI and API
- Docker Compose setup for local multi-service runtime
- Deployed frontend and backend references

For the full architecture breakdown, see [docs/application-architecture.md](docs/application-architecture.md).

## Submission Checklist

What is included in the submission package:

- Working frontend deployment reference
- Backend deployment reference
- Postman collection for all main API flows
- Dedicated architecture document
- Docker Compose setup for local execution
- README sections covering stack choice, setup, and production notes

The codebase is structured so a reviewer can quickly verify the product flow, inspect the API with Postman, and understand the implementation decisions without extra context.

## Demo Login

Use these demo credentials for the protected create flow:

- Username: `admin`
- Password: `admin123`

## Demo Video

- Google Drive: [https://drive.google.com/file/d/1y9J-PXPq2FQjtLVCDT5Cb0XKB13zUSlp/view?usp=sharing](https://drive.google.com/file/d/1y9J-PXPq2FQjtLVCDT5Cb0XKB13zUSlp/view?usp=sharing)

## Live Environment

- Frontend URL: [https://emplay-five.vercel.app/](https://emplay-five.vercel.app/)
- Backend deployment dashboard: [https://dashboard.render.com/](https://dashboard.render.com/)

## Tech Stack

- Frontend: Angular 21, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Zod, JWT
- Database: MongoDB 7
- Cache: Redis 7
- DevOps: Docker, Docker Compose, Vercel, Render

## Why I Chose This Stack

I chose Node.js and MongoDB because I am comfortable working with that stack, which let me move quickly while keeping the implementation stable and easy to reason about.

Practical advantages for this project:

- MongoDB fits the prompt document shape well, especially the prompt content and tags array.
- The document model keeps the backend simple and reduces schema-migration overhead.
- Node.js keeps the API and frontend integration in the same language family, which lowers context switching.
- The stack is easy to containerize, deploy, and demonstrate consistently.
- The same JavaScript/TypeScript skill set applies across frontend, backend, and tooling, which improves maintainability.

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

## Postman Collection

The repository includes a Postman collection for the main API workflows:

- Health check
- Login and token capture
- List prompts
- Filter prompts by tag
- Fetch prompt details by ID
- Create a prompt with Bearer authentication

Import the collection from:

- [postman/ai-prompts.postman_collection.json](postman/ai-prompts.postman_collection.json)

Collection variables:

- `baseUrl`: defaults to `http://localhost:4000`
- `token`: populated after login and reused for protected requests

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

### Run the API Collection in Postman

1. Import [postman/ai-prompts.postman_collection.json](postman/ai-prompts.postman_collection.json).
2. Set the `baseUrl` collection variable to your local or deployed backend URL.
3. Send the login request to populate the `token` variable.
4. Use the token-bearing requests to verify protected endpoints.

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
- The deployed frontend and backend references are documented above for easier handoff and review

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
