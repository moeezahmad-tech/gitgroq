# GitGroq — Technical Stack & Architecture

## Overview

GitGroq is "The AI Commit Explainer" — a full-stack tool that analyzes git commits and provides AI-powered explanations of code changes.

## Tech Stack

### Backend (`/backend`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Architecture:** Modular MVC (Model–View–Controller)

### Frontend (`/frontend`)
 
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Component Pattern:** Standard component separation (presentational vs. container)

---

## Backend Architecture Rules

### Directory Structure

```
backend/
├── config/          # Database connection, environment config
├── controllers/     # Route handlers (business logic orchestration)
├── middleware/      # Express middleware (auth, validation, error handling)
├── models/          # Mongoose schemas and models
├── routes/          # Express route definitions (thin, delegate to controllers)
├── services/       # Business logic and external API integrations
├── utils/           # Shared helper functions
├── server.js        # App entry point
└── .env             # Environment variables (never committed)
```

### MVC Conventions

1. **Models** define Mongoose schemas only. No business logic in models.
2. **Controllers** handle request/response. They call services, never access the database directly.
3. **Services** contain business logic and database queries. They are framework-agnostic (no `req`/`res`).
4. **Routes** are thin — map HTTP verbs to controller methods, apply middleware.
5. **Middleware** handles cross-cutting concerns: authentication, validation, error formatting.

### Backend Standards

- Use `async/await` with centralized error handling middleware.
- Validate request input at the middleware or controller layer before passing to services.
- Environment variables accessed via a config module, not scattered `process.env` calls.
- All Mongoose models use singular PascalCase names (e.g., `Commit`, `User`, `Explanation`).
- Export one entity per file. Name files in kebab-case (e.g., `commit-controller.js`).

---

## Frontend Architecture Rules

### Directory Structure

```
frontend/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.js     # Root layout
│   ├── page.js       # Home page
│   └── [feature]/    # Feature-specific routes
├── components/       # Reusable UI components
│   ├── ui/           # Primitive/presentational components (Button, Card, Input)
│   └── [feature]/    # Feature-specific composed components
├── lib/              # Utilities, API client, helpers
├── hooks/            # Custom React hooks
├── styles/           # Global styles and Tailwind config
└── public/           # Static assets
```

### Component Separation

1. **Presentational components** (`components/ui/`) — stateless, accept props, render UI. No data fetching.
2. **Feature components** (`components/[feature]/`) — compose presentational components, may manage local state.
3. **Page components** (`app/`) — handle data fetching (server components) and layout composition.
4. **Hooks** (`hooks/`) — encapsulate reusable stateful logic.

### Frontend Standards

- Use server components by default. Add `'use client'` only when interactivity is required.
- Tailwind classes for all styling. No inline style objects or CSS modules unless absolutely necessary.
- Icons exclusively from `lucide-react`. Import individually (e.g., `import { GitCommit } from 'lucide-react'`).
- One component per file. Name files in PascalCase matching the export (e.g., `CommitCard.jsx`).
- Colocate tests next to their component (`CommitCard.test.jsx`).
- API calls go through a centralized client in `lib/api.js`, not scattered `fetch` calls in components.

---

## Shared Conventions

- Use ESLint and Prettier for consistent formatting across both directories.
- Prefer named exports for utilities and default exports for components/pages.
- Keep environment-specific values in `.env` files. Never hardcode URLs, keys, or secrets.
- Write descriptive commit messages explaining *why*, not just *what*.
