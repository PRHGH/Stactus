# Acquisitions API

A secure Express.js REST API for user authentication and user management, built as a self-study backend project.

## 1. Overview / Description

This project provides a production-style API with authentication, role-aware authorization, request protection, and a PostgreSQL data layer powered by Drizzle ORM.

I built this project to practice designing a layered backend architecture, implementing secure auth flows, and working with modern Node.js tooling in a real-world API structure.

### Key technologies

- Node.js (ES Modules)
- Express 5
- PostgreSQL + Drizzle ORM
- JWT authentication (HTTP-only cookies)
- Arcjet security middleware
- Zod validation
- Winston logging
- Jest + Supertest
- Docker + Neon (local/prod flows)

## 2. Table of Contents

- [1. Overview / Description](#1-overview--description)
- [2. Table of Contents](#2-table-of-contents)
- [3. Features](#3-features)
- [4. Installation](#4-installation)
- [5. Usage](#5-usage)
- [6. Learning Outcomes](#6-learning-outcomes)
- [7. Project Structure](#7-project-structure)
- [8. Challenges \& Next Steps](#8-challenges--next-steps)
- [9. Credits / References](#9-credits--references)

## 3. Features

- User sign-up, sign-in, and sign-out endpoints.
- JWT-based authentication with HTTP-only cookie handling.
- Role-aware access control for protected user routes.
- Arcjet-based security and rate limiting middleware.
- Request validation with Zod schemas.
- PostgreSQL integration through Drizzle ORM.
- Structured logging via Winston + Morgan integration.
- Dockerized development and production-style environment setup.
- Health and API status endpoints.

## 4. Installation

### Prerequisites

- Node.js 20+ (recommended)
- npm
- Docker (optional, for containerized workflow)
- PostgreSQL/Neon database URL

### Local setup

```bash
git clone https://github.com/PRHGH/acquisitions.git
cd acquisitions
npm ci
```

### Environment setup

Create your environment file (or copy from `.env.example`) and define required variables such as:

- `DATABASE_URL`
- `JWT_SECRET`
- `ARCJET_KEY`

## 5. Usage

### Run locally

```bash
npm run dev
```

Run once (no watch mode):

```bash
npm start
```

### Lint and format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Database (Drizzle)

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

### Tests

```bash
npm test
```

### Docker workflows

Development stack (Neon Local + app):

```bash
docker compose -f docker-compose.dev.yml up --build
```

Production-like stack (app + Neon Cloud URL from env):

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### API examples

Health check:

```bash
curl http://localhost:3000/health
```

Sign up:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"StrongPass123!","name":"Test User"}'
```

## 6. Learning Outcomes

- Built a layered API architecture using routes, controllers, services, and models.
- Practiced secure authentication with JWTs and cookie-based sessions.
- Improved understanding of schema-driven data access with Drizzle ORM.
- Learned to apply request protection and rate limiting via Arcjet.
- Strengthened backend project tooling with ESLint, Prettier, Docker, and Jest.

## 7. Project Structure

```text
acquisitions/
|-- src/
|   |-- app.js
|   |-- index.js
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   \-- validations/
|-- tests/
|-- drizzle/
|-- scripts/
|-- docker-compose.dev.yml
|-- docker-compose.prod.yml
|-- drizzle.config.js
|-- package.json
\-- README.md
```

## 8. Challenges & Next Steps

### Challenges

- Designing authorization so users can access their own data while enforcing admin-only actions.
- Managing environment differences between local Docker (Neon Local) and production-like deployment (Neon Cloud).
- Keeping security, logging, and validation concerns cleanly separated across middleware and services.

### Next steps

- Add refresh token rotation and token revocation strategy.
- Expand automated test coverage (unit + integration + edge cases).
- Add pagination/filtering for user listing endpoints.
- Add API documentation (OpenAPI/Swagger).
- Add CI checks for lint, format, and tests.

## 9. Credits / References

- [Express documentation](https://expressjs.com/)
- [Drizzle ORM documentation](https://orm.drizzle.team/)
- [Arcjet documentation](https://docs.arcjet.com/)
- [Zod documentation](https://zod.dev/)
- [Jest documentation](https://jestjs.io/docs/getting-started)
- [Neon documentation](https://neon.com/docs)
