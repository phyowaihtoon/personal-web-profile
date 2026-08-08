---
name: frontend-website-starter
description: Build and maintain a personal website frontend using Vite, React, TypeScript, React Router, React Query, React Hook Form, shadcn/ui, Tailwind CSS, Lucide Icons, dark mode, i18n, and JWT admin auth.
---

# Frontend Website Skill

Use this skill when creating or extending a personal website frontend with a public portal and an admin portal.

## Goals

- Build a Vite + React + TypeScript app.
- Use React Router for routing.
- Use TanStack React Query for server state.
- Use React Hook Form for forms.
- Use shadcn/ui with Tailwind CSS for UI.
- Use Lucide Icons for icons.
- Support light/dark mode with a toggle.
- Support English and Myanmar localization with translation files.
- Provide a public portal with empty starter pages:
  - Home
  - About
  - Experience
  - Blog
- Provide an admin portal with:
  - Register
  - Login
  - JWT token verification
  - Protected routes
- Include standard tests with Vitest and Testing Library.
- Prefer the latest stable package versions at implementation time.

## Important implementation notes

- Do not build production features unless requested; keep the starter clean and extensible.
- Verify current package and API details before implementation.
- Keep the architecture modular so future agents can add content quickly.

## Recommended architecture

### App structure

- `src/main.tsx` bootstraps providers and router.
- `src/app/` contains app-level setup.
- `src/components/` contains reusable UI and shared components.
- `src/features/` contains domain features such as auth and blog.
- `src/pages/` contains route pages for public and admin portals.
- `src/lib/` contains utilities, API client, i18n helpers, token helpers.
- `src/translations/` contains locale files.
- `src/test/` contains test setup.

### Suggested folders

- `src/app/providers/`
  - `query-provider.tsx`
  - `theme-provider.tsx`
  - `locale-provider.tsx`
  - `auth-provider.tsx`
- `src/app/router/`
  - public routes
  - admin routes
- `src/components/theme/`
  - theme toggle
- `src/components/locale/`
  - language toggle
- `src/features/auth/`
  - auth API
  - auth hooks
  - auth types
- `src/pages/public/`
  - home
  - about
  - experience
  - blog
- `src/pages/admin/`
  - login
  - register
  - dashboard
  - token verification

## Providers

Wrap the app with these providers in a stable order:

1. `QueryClientProvider`
2. Theme provider
3. Localization provider
4. Auth provider
5. Router provider

### Provider behavior

- **React Query provider**: configure a shared `QueryClient`.
- **Theme provider**: store theme in local storage and apply `dark` class.
- **Locale provider**: store selected language in local storage.
- **Auth provider**: store JWT state, user info, and auth status.
- **Router**: define public and admin route groups.

## Public portal

Create a default empty layout for public pages.

### Routes

- `/` → Home
- `/about` → About
- `/experience` → Experience
- `/blog` → Blog

### Public layout

- Minimal navigation
- Theme toggle
- Language toggle
- Responsive header and footer
- Empty content sections ready for later expansion

## Admin portal

Provide standard JWT auth flows.

### Routes

- `/admin/login`
- `/admin/register`
- `/admin/verify`
- `/admin/*` protected routes

### Auth behavior

- Login submits credentials with React Hook Form.
- Register submits credentials with React Hook Form.
- Store access token securely in app state and persistence layer as needed.
- Verify token on app load or protected route entry.
- Redirect unauthenticated users to login.
- Redirect authenticated users away from login/register pages.

### Auth API expectations

Use standard endpoints conceptually such as:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/verify`

If the backend differs, adapt the client in one place only.

## Localization

Support English and Myanmar.

### Requirements

- Use translation files:
  - `src/translations/en.json`
  - `src/translations/my.json`
- Provide a language toggle.
- Keep keys consistent across locales.
- Localize:
  - navigation
  - buttons
  - form labels
  - validation messages
  - empty states

## Theme support

- Support light and dark themes.
- Use a toggle component in the UI.
- Persist preference.
- Respect system preference on first load if no saved choice exists.

## UI guidance

- Use shadcn/ui components as the base design system.
- Use Tailwind CSS utilities for layout and spacing.
- Use Lucide Icons for iconography.
- Keep components composable and accessible.
- Prefer semantic HTML and keyboard-friendly interactions.

## Forms

Use React Hook Form for:

- login
- register
- future profile/admin forms

Include validation rules and reusable form field components where useful.

## Testing

Use Vitest for unit and component tests.

### Test coverage should include

- provider rendering
- theme toggle behavior
- language toggle behavior
- route protection
- auth hook or auth flow logic
- public page smoke rendering
- admin login/register form validation

### Test setup

- `src/test/setup.ts`
- Testing Library matchers
- router and provider test helpers

## Suggested implementation checklist

1. Initialize Vite React TypeScript app.
2. Add Tailwind CSS and shadcn/ui.
3. Add React Router, React Query, React Hook Form.
4. Add theme and locale providers.
5. Add translation JSON files.
6. Add public pages and empty layout.
7. Add admin auth pages and protected routes.
8. Add JWT token handling and verification.
9. Add tests and shared test setup.
10. Validate accessibility and responsive behavior.

## Skill usage guidance

When implementing this skill:

- Keep the first version minimal and clean.
- Do not hardcode business data.
- Centralize API and auth logic.
- Keep translations and route labels synchronized.
- Add only the dependencies required by the stack.
- Use the latest stable package versions available at implementation time.