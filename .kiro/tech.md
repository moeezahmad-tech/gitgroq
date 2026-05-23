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
 
- **Framework:** React.js 
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

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
frontend
├── public/               # Static assets (logo, icons)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── BubbleView.jsx        # Force-directed graph visualization
│   │   │   ├── FileTree.jsx           # Collapsible file tree
│   │   │   ├── FullscreenWrapper.jsx  # Fullscreen overlay component
│   │   │   ├── MarkdownRenderer.jsx   # Markdown display
│   │   │   └── Navbar.jsx             # Navigation bar
│   │   ├── pages/            # Route pages
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Analyze.jsx   # Main analysis dashboard
│   │   │   ├── About.jsx     # About & principles
│   │   │   ├── Contact.jsx   # Contact form
│   │   │   └── NotFound.jsx  # 404 page
│   │   ├── lib/              # API client & utilities
│   │   ├── App.jsx           # Root component with routing
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles & Tailwind
│   ├── index.html            # HTML template
│   └── vite.config.js        # Vite configuration
```

### Architecture Principles

1. **Models** define Mongoose schemas only — no business logic
2. **Services** contain business logic — framework-agnostic
3. **Controllers** handle request/response — call services, never touch DB directly
4. **Routes** are thin — map HTTP verbs to controllers
5. **Components** follow separation — presentational vs. feature vs. page


---

## Shared Conventions

- Use ESLint and Prettier for consistent formatting across both directories.
- Prefer named exports for utilities and default exports for components/pages.
- Keep environment-specific values in `.env` files. Never hardcode URLs, keys, or secrets.
- Write descriptive commit messages explaining *why*, not just *what*.
