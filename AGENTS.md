# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core development commands
- Install dependencies: `npm ci`
- Run API locally (watch mode): `npm run dev`
- Run API once: `npm start`
- Lint: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Format all files: `npm run format`
- Check formatting only: `npm run format:check`

## Database and schema commands (Drizzle)
- Generate migration from model changes: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Open Drizzle Studio: `npm run db:studio`

## Docker/dev environment commands
- Start development stack (Neon Local + app): `docker compose -f docker-compose.dev.yml up --build`
- Start production-like stack (app only, Neon Cloud via `DATABASE_URL`): `docker compose -f docker-compose.prod.yml up --build -d`
- Script wrappers (bash scripts in `scripts/`): `npm run dev:docker`, `npm run prod:docker`

## Tests in this repository
- There is currently no test runner configured in `package.json` (no `npm test` script).
- Existing executable DB check scripts:
  - `node test-db.js`
  - `node test-drizzle.js`
- To run a single check script, execute one file directly (example): `node test-db.js`

## Environment and runtime model
- Runtime env is loaded via `dotenv/config` from `src/index.js`.
- Local development and production select different env files through compose:
  - `docker-compose.dev.yml` -> `.env.development` (Neon Local)
  - `docker-compose.prod.yml` -> `.env.production` (Neon Cloud)
- App startup chain:
  - `src/index.js` loads env and imports `src/server.js`
  - `src/server.js` binds the Express app from `src/app.js`

## High-level architecture
- The API follows a layered flow:
  - **Routes** (`src/routes`) define HTTP endpoints.
  - **Controllers** (`src/controllers`) validate/shape requests and responses.
  - **Services** (`src/services`) contain business logic and DB calls.
  - **Models** (`src/models`) define Drizzle schema.
- Path aliases are configured in `package.json#imports` (`#services/*`, `#controllers/*`, etc.) and are used throughout the codebase.

## Request lifecycle and cross-cutting concerns
- `src/app.js` applies global middleware in this order:
  1. `helmet`, `cors`, JSON/urlencoded parsers
  2. `morgan` request logging (except `/health`), routed into Winston
  3. `cookie-parser`
  4. global Arcjet-based `securityMiddleware`
- Main route groups:
  - `/api/auth` -> sign-up/sign-in/sign-out
  - `/api/users` -> user endpoints (currently only list is implemented with DB-backed logic)

## Security/auth details to keep in mind
- Arcjet is configured in `src/config/arcjet.js` with `shield`, bot detection, and a base sliding window.
- `src/middleware/security.middleware.js` adds role-based rate limits (`admin`/`user`/`guest`) on top of Arcjet rules and returns 403 on denial.
- Authentication tokens are JWTs (`src/utils/jwt.js`) and are stored in HTTP-only cookies via `src/utils/cookies.js`.
- Validation uses Zod schemas in `src/validations/auth.validation.js`.

## Data layer details
- DB client setup is in `src/config/database.js` using `postgres` + `drizzle-orm/postgres-js`.
- `DATABASE_URL` is required; startup fails if missing.
- Schema source for Drizzle generation is `src/models/*.js` (`drizzle.config.js`), and SQL migrations are written to `drizzle/`.
- Current migration set creates a `users` table (`drizzle/0000_mature_lethal_legion.sql`).

## Logging
- Central logger is `src/config/logger.js` (Winston).
- File logs are written to `logs/error.log` and `logs/combined.log`.
- Non-production also logs to console.
