# GitGrok — Development Log

A chronological record of features, fixes, and decisions made during development.

---

## 2026-05-23 — Commit Diff Accordion & AI Summaries

### Features Added

**1. Commit Diff Accordion (Frontend + Backend)**

Clicking a commit in the "All Commits" tab now expands an inline diff panel showing all files changed in that commit with color-coded patches.

- Backend: New `POST /api/analyze/commit-diff` endpoint accepts `{ owner, repo, sha }` and returns `{ files: [{ filename, status, additions, deletions, patch }] }`
- Backend: `fetchCommitDetails` exported from analyze-service for reuse
- Backend: Commits now return full 40-char SHA (`sha`) + display-friendly `shortSha`
- Frontend: Accordion behavior — only one commit expanded at a time
- Frontend: Client-side diff caching to avoid redundant API calls
- Frontend: Diff lines color-coded: green (additions), red (deletions), blue (hunk headers)
- Frontend: Loading spinner and error states in the expanded panel

**2. AI Commit Summaries**

When a commit is expanded, an AI-generated summary appears at the top of the diff panel.

- Backend: New `POST /api/analyze/summarize-commit` endpoint using Groq (llama-3.3-70b)
- Accepts commit message + file list, returns 2-3 sentence summary
- Frontend: Non-blocking fetch — diff shows immediately, summary streams in after
- Cached per-commit so re-expanding is instant
- Graceful degradation — if AI fails, diff still works fine

**3. Responsive Design**

- Navbar: Hamburger menu on mobile with slide-down nav links
- Analyze page: Sidebar becomes a dropdown selector on mobile (`< lg` breakpoint)
- Search form stacks vertically on small screens
- Home page: Hero text, buttons, and feature grid scale for mobile

**4. Code Viewer Improvements**

- Fixed UTF-8 decoding: replaced raw `atob()` with `TextDecoder('utf-8')` to properly handle multi-byte characters (was showing `âââ` for special symbols)
- Image preview: clicking image files (png, jpg, gif, svg, webp) now renders the actual image instead of garbled binary

### Backend Changes

| File | Change |
|------|--------|
| `services/analyze-service.js` | Export `fetchCommitDetails`, return full SHA + shortSha |
| `controllers/analyze-controller.js` | Add `getCommitDiff` and `summarizeCommit` functions |
| `routes/analyze-routes.js` | Register `/commit-diff` and `/summarize-commit` routes |
| `tests/getCommitDiff.test.js` | 12 tests (unit + property-based) for the new endpoint |
| `package.json` | Added `jest` and `fast-check` dev dependencies |

### Frontend Changes

| File | Change |
|------|--------|
| `components/Navbar.jsx` | Responsive hamburger menu for mobile |
| `components/CodeViewer.jsx` | UTF-8 fix, image preview support |
| `components/FullscreenWrapper.jsx` | Added `w-full` for proper stretching |
| `pages/Analyze.jsx` | Accordion, AI summaries, mobile dropdown sidebar, responsive layout |
| `pages/Home.jsx` | Responsive hero, buttons, feature grid |

### API Endpoints Added

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/analyze/commit-diff` | `{ owner, repo, sha }` | `{ files: [...] }` |
| `POST` | `/api/analyze/summarize-commit` | `{ message, files }` | `{ summary }` |

### Architecture Decisions

- **Client-side caching**: Diffs and AI summaries are cached in component state keyed by SHA. Cache clears when a new repo is analyzed.
- **Non-blocking AI**: Summary fetch is fire-and-forget (`.then()` chain) so it doesn't block the diff from appearing.
- **Full SHA strategy**: Backend sends full 40-char SHA for API calls, `shortSha` for display. GitHub API accepts both, but full SHA is unambiguous.
- **Responsive breakpoint**: `lg:` (1024px) for sidebar → dropdown transition. Navbar uses `md:` (768px).

---

## 2026-05-23 — Project Setup & Steering

### Configuration

- Created `.kiro/steering/coding-standards.md` — always-included rules for code style, naming, testing, and architecture patterns
- Established dark theme system: gray-900/950 backgrounds, emerald-400/500 accents, gray-700/800 borders

---

## Prior Work (Pre-Devlog)

Features that existed before this log was started:

- Repository analysis (stars, forks, language, license, commits, file tree)
- Bubble View (force-directed graph visualization)
- File Tree (collapsible nested directory)
- Code Viewer with syntax highlighting (highlight.js)
- AI file summaries via Groq
- Fullscreen mode for all panels
- MongoDB persistence of analyses
- GitHub API integration with token auth and rate limit handling
