---
inclusion: always
---

# GitGroq Coding Standards

## General Rules

- Use `async/await` everywhere — no raw `.then()` chains except for fire-and-forget calls
- All API responses follow the shape `{ data }` on success or `{ error: { message } }` on failure
- Never hardcode URLs — always use environment variables (`VITE_API_URL`, `GITHUB_TOKEN`, etc.)
- Use early returns for validation to avoid deep nesting

## Backend (Node.js / Express)

- CommonJS modules (`require` / `module.exports`)
- Controllers validate input, call services, return responses — no direct DB access
- Services contain business logic and are framework-agnostic (no `req`/`res`)
- Error handling: catch in controller, map to HTTP status, or pass to `next(err)`
- GitHub API calls must include `User-Agent: GitGroq-App` header
- Rate limit errors (403 from GitHub) should be returned as 429 to the client

## Frontend (React / Vite / Tailwind)

- ES modules (`import` / `export`)
- Functional components with hooks only — no class components
- State management via `useState` / `useReducer` — no external state library
- API calls happen in event handlers or `useEffect`, never in render
- Tailwind classes only — no inline styles except for dynamic values
- Dark theme: `bg-gray-900/950`, `border-gray-700/800`, `text-gray-200/400`, accent `emerald-400/500`
- Icons from `lucide-react` only
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)

## File Naming

- Backend: kebab-case (`analyze-controller.js`, `analyze-service.js`)
- Frontend components: PascalCase (`CodeViewer.jsx`, `BubbleView.jsx`)
- Frontend pages: PascalCase (`Analyze.jsx`, `Home.jsx`)
- Frontend utilities: camelCase (`api.js`)

## Testing

- Backend tests use Jest with CommonJS
- Property-based tests use `fast-check`
- Test files go in `backend/tests/` named `{feature}.test.js`
- Mock external dependencies (GitHub API, Groq SDK) — never make real API calls in tests
