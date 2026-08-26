---
name: backend-website-starter
description: Build and maintain a personal website backend using TypeScript, Express, Prisma, PostgreSQL (on-prem or Supabase via DATABASE_TARGET), JWT auth, validation, migrations, API versioning, and Jest/Supertest testing. Use when creating, extending, or changing backend-app APIs, Prisma schema, auth, Express routes, middleware, or backend tests.
---

# Backend Website Skill

Use this skill when creating or extending a personal website backend API with authentication, localization, versioning, and a clean layered architecture.

## Goals

- Build a TypeScript + Express API.
- Use Prisma as the ORM.
- Use PostgreSQL for all environments.
- Select the database deployment target with `DATABASE_TARGET`:
  - `onprem` → local or physical-server PostgreSQL via `DATABASE_URL`
  - `supabase` → Supabase PostgreSQL via `SUPABASE_DATABASE_URL` + `SUPABASE_DIRECT_URL`
- Use Express Validator for request validation.
- Use CORS for cross-origin access.
- Use Jest and Supertest for testing.
- Use ESLint and TypeScript ESLint for code quality.
- Use `tsx` for development watch mode.
- Support JWT register/login and token verification.
- Include proper error handling and environment configuration.
- Include Prisma migrations and seed support if needed.
- Support English and Myanmar API language handling.
- Use API versioning from the start.
- Prefer latest stable package versions at implementation time.

## Important implementation notes

- Do not build production features unless requested; keep the starter clean and extensible.
- Verify current package and API details before implementation.
- Keep business logic out of routes.
- Centralize auth, validation, and error handling.
- Keep the first version minimal and easy to extend.
- Do not use SQLite.

## Recommended architecture

### App structure

- `src/server.ts` starts the HTTP server.
- `src/app.ts` creates and configures the Express app.
- `src/config/` contains env parsing and app config.
- `src/routes/` contains versioned route definitions.
- `src/controllers/` contains request handlers.
- `src/services/` contains business logic.
- `src/middleware/` contains auth, error handling, locale, and not-found middleware.
- `src/validators/` contains request validation rules.
- `src/utils/` contains shared helpers.
- `src/lib/` contains reusable internal libraries if needed.
- `src/types/` contains shared TypeScript types.
- `src/i18n/` contains language messages and helpers.
- `prisma/` contains schema, migrations, and seed files.
- `tests/` or `src/tests/` contains integration and unit tests.

## Suggested folder layout

- `src/routes/v1/`
  - `auth.routes.ts`
  - `health.routes.ts`
  - `index.ts`
- `src/controllers/`
  - `auth.controller.ts`
  - `health.controller.ts`
- `src/services/`
  - `auth.service.ts`
  - `token.service.ts`
  - `user.service.ts`
- `src/middleware/`
  - `auth.middleware.ts`
  - `error.middleware.ts`
  - `locale.middleware.ts`
  - `validate.middleware.ts`
  - `not-found.middleware.ts`
- `src/validators/`
  - `auth.validators.ts`
  - `common.validators.ts`
- `src/config/`
  - `env.ts`
  - `database-target.ts`
  - `cors.ts`
  - `logger.ts`
  - `prisma.ts`
- `src/i18n/`
  - `en.ts`
  - `my.ts`
  - `messages.ts`
- `prisma/`
  - `schema.prisma`
  - `migrations/`
  - `seed.ts`
- `scripts/`
  - `with-database-env.ts`

## Core runtime behavior

### App setup

- Enable JSON parsing.
- Configure CORS from environment variables.
- Attach locale detection middleware.
- Attach route versioning under `/api/v1`.
- Register centralized error handling.
- Return consistent API response shapes.

### Environment configuration

Use a validated env layer for:

- `NODE_ENV`
- `PORT`
- `DATABASE_TARGET`
- `DATABASE_URL` (required when `DATABASE_TARGET=onprem`)
- `SUPABASE_DATABASE_URL` (required when `DATABASE_TARGET=supabase`)
- `SUPABASE_DIRECT_URL` (required when `DATABASE_TARGET=supabase`)
- `JWT_SECRET` / `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` as used by the project
- `JWT_EXPIRES_IN` / access and refresh expiry settings
- `CORS_ORIGIN`
- `APP_LOCALE_DEFAULT`
- `UPLOAD_STORAGE` (`disabled` | `local` | `s3` | `vercel-blob`; default `disabled`)
- `UPLOAD_DIR` (used when `UPLOAD_STORAGE=local`)
- Spaces credentials (used when `UPLOAD_STORAGE=s3`; incomplete values disable uploads instead of crashing)
- `BLOB_READ_WRITE_TOKEN` (used when `UPLOAD_STORAGE=vercel-blob`; missing token disables uploads instead of crashing)

Fail fast if required variables are missing for the selected database target. Incomplete upload storage configuration must not prevent boot.

Resolve Prisma connection URLs before Prisma Client or Prisma CLI commands run:
- `onprem` → `DATABASE_URL` (and mirror as `DIRECT_URL`)
- `supabase` → pooled `SUPABASE_DATABASE_URL` as `DATABASE_URL`, direct `SUPABASE_DIRECT_URL` as `DIRECT_URL`

## Database

### Prisma support

- Use PostgreSQL only (`provider = "postgresql"`).
- Support on-prem PostgreSQL and Supabase via `DATABASE_TARGET`.
- Keep one Prisma schema for both targets.
- Run migrations for schema changes.
- Generate Prisma client as part of development and build workflows.
- Prefer `npm run prisma:*` scripts that apply database env resolution before Prisma CLI.

### Suggested entities

- `User`
  - id
  - name
  - email
  - passwordHash
  - role
  - createdAt
  - updatedAt

Add more entities later as needed.

## Auth

Provide standard JWT auth flows.

### Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/verify`

### Auth behavior

- Hash passwords before storage.
- Verify credentials on login.
- Issue JWT access tokens.
- Verify JWT in protected middleware.
- Return the authenticated user from `/me`.
- Return verification status from `/verify`.
- Use clean token extraction from the `Authorization: Bearer` header.
- Keep auth logic in services, not controllers.

### Security guidance

- Never store plaintext passwords.
- Use strong password validation rules.
- Do not leak sensitive auth details in error messages.
- Keep JWT secret and expiry in environment variables.
- Consider refresh tokens only if later requested.

## Validation

Use Express Validator for request validation.

### Validate at minimum

- register input
- login input
- common route params
- pagination or filter query params if added later

### Validation rules

- Return a consistent 400 response for invalid input.
- Localize validation messages where practical.
- Keep validators separate from controllers.

## Error handling

Implement standard error handling.

### Requirements

- Centralized error middleware.
- Standard error response format.
- Handle validation, auth, not found, and unexpected errors.
- Avoid exposing stack traces in production.
- Log server-side errors appropriately.

## Localization

Support English and Myanmar for API messages.

### Requirements

- Detect locale via header or query parameter.
- Default to English when locale is missing or invalid.
- Keep translation keys consistent across locales.
- Localize:
  - validation messages
  - auth messages
  - not-found messages
  - health/status messages where useful

### Suggested locale handling

- `Accept-Language` header
- optional `lang` query parameter
- internal locale helper to resolve the active language

## API versioning

Use versioned routes from the start.

### Requirements

- Prefix routes with `/api/v1`
- Keep versioned route registration isolated
- Make future `/api/v2` migration simple

## CORS

- Configure allowed origins from env.
- Support credentials only if required.
- Keep defaults safe for local development.

## Logging and utilities

- Add request-safe logging where helpful.
- Keep reusable helpers in `src/utils/`.
- Keep Prisma access through a single client module.
- Keep token creation and verification in a dedicated service.

## Testing

Use Jest for tests and Supertest for HTTP integration tests.

### Test coverage should include

- app initialization
- health route
- auth register/login/verify flow
- auth middleware protection
- validation failures
- error handling
- locale resolution
- versioned route availability

### Test setup

- Use PostgreSQL for the test database.
- Default `DATABASE_TARGET=onprem` in test setup.
- Allow override with `TEST_DATABASE_URL` or standard target env vars.
- Run Prisma migrations or reset schema in test setup.
- Add reusable test helpers for app, auth, and database state.

## Linting and formatting

- Use ESLint with TypeScript ESLint.
- Keep rules strict enough to catch common mistakes.
- Add consistent import and unused variable handling.
- Use Prettier only if later requested.

## Development workflow

- Use `tsx watch` for local development.
- Keep build and test commands separated.
- Run Prisma generate after schema changes.
- Run migrations before integration testing.

## Suggested implementation checklist

1. Initialize Express + TypeScript app.
2. Add Prisma with PostgreSQL and `DATABASE_TARGET` resolution.
3. Add env validation and config loading.
4. Add API versioned routes under `/api/v1`.
5. Add auth controllers, services, validators, and middleware.
6. Add centralized error handling.
7. Add locale resolution and message translations.
8. Add Jest and Supertest test setup against PostgreSQL.
9. Add ESLint and TypeScript ESLint config.
10. Add Prisma migrations and verify test database workflow.

## Skill usage guidance

When implementing this skill:

- Keep routes thin and services reusable.
- Keep auth and database logic isolated.
- Keep the API response format consistent.
- Add only the dependencies required by the stack.
- Verify latest stable package versions before setup.
- Favor clarity and maintainability over complexity.
