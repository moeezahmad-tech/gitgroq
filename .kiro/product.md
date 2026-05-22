# GitGroq — Product Context

## Product Name

**GitGroq** — The AI Commit Explainer

## Purpose

GitGroq helps developers understand code changes by providing AI-powered explanations of git commits. It bridges the gap between cryptic diffs and human-readable summaries, making code review, onboarding, and knowledge sharing faster.

## Target Users

- Developers reviewing unfamiliar code or repositories
- Team leads conducting code reviews
- New team members onboarding to a codebase
- Open-source contributors understanding project history

## Core Value Proposition

Paste a commit hash or diff, and GitGroq explains what changed, why it likely changed, and what impact it has — in plain language.

---

## Product Principles

1. **Clarity over cleverness** — Explanations should be accessible to developers of all levels.
2. **Speed matters** — Results should appear quickly. Prefer streaming responses where possible.
3. **Context is king** — The more context (repo, file history, PR description) the better the explanation.
4. **Privacy-aware** — Code is sensitive. Be transparent about what is sent to AI providers and offer self-hosted options.

---

### Core Features

- **Commit Explanation** — Analyze a single commit and produce a structured explanation (summary, file-by-file breakdown, impact assessment).
- **Diff Analysis** — Accept raw diffs (not just commit hashes) for repos not directly connected.
- **History View** — Browse previously analyzed commits with their explanations.

### Future Considerations

- Repository connection (GitHub/GitLab integration)
- Team workspaces and shared explanation history
- Custom AI model configuration (OpenAI, Anthropic, local models)
- IDE extensions (VS Code, JetBrains)

---

## UX Guidelines

- Keep the interface minimal and focused. One primary action per screen.
- Use clear loading states — AI responses take time, so show progress indicators.
- Dark mode as default (developers prefer it), with light mode available.
- Monospace font for code snippets and diffs. Sans-serif for explanations.
- Responsive design, but desktop-first (primary use case is at a workstation).

---

## Terminology

| Term | Meaning |
|------|---------|
| Explanation | The AI-generated breakdown of a commit or diff |
| Grok | To understand intuitively (from Heinlein, adopted by dev culture) |
| Commit | A git commit — the primary input unit |
| Diff | The textual representation of changes between two states |
| Impact | The assessed effect of a change on the broader codebase |
