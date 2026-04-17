# Acquisitions Docker setup (Neon Local for dev, Neon Cloud for prod)
This project is containerized with environment-specific database wiring:
- Development uses Neon Local in Docker for ephemeral branch-based workflows.
- Production uses Neon Cloud directly through `DATABASE_URL` (no Neon Local proxy in prod).

## Files added
- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.development`
- `.env.production`

## Development setup (Neon Local)
1. Update `.env.development` with real values:
   - `NEON_API_KEY`
   - `NEON_PROJECT_ID`
   - Optional `PARENT_BRANCH_ID` (blank uses Neon project's default branch)
   - `ARCJET_KEY`
2. Start the local stack:
   - `docker compose -f docker-compose.dev.yml up --build`
3. Services:
   - App: `http://localhost:3000`
   - Neon Local Postgres endpoint: `postgres://neon:npg@localhost:5432/neondb?sslmode=require`
4. Inside the Compose network, app connects using:
   - `postgres://neon:npg@neon-local:5432/neondb?sslmode=require`

### Ephemeral branch behavior
- Neon Local creates ephemeral branches automatically for dev/test workflows.
- `DELETE_BRANCH=true` ensures branches are removed when Neon Local stops.
- `PARENT_BRANCH_ID` controls which branch new ephemeral branches are based on.

## Production setup (Neon Cloud)
1. Set `.env.production` with your real Neon Cloud URL:
   - `DATABASE_URL=postgres://...neon.tech...`
   - `ARCJET_KEY=...`
2. Start production compose:
   - `docker compose -f docker-compose.prod.yml up --build -d`

Production compose runs only the application container. The database is your managed Neon Cloud instance accessed via environment variables.

## How env switching works
- `docker-compose.dev.yml` loads `.env.development`
- `docker-compose.prod.yml` loads `.env.production`
- The app reads `DATABASE_URL` from the active environment file at runtime.
