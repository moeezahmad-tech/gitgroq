# Implementation Plan: Frontend Commit Analysis

## Overview

This plan implements the client-side commit analysis feature for DevTracks. It installs dependencies, creates a centralized API client and a markdown rendering component, then enhances the existing dashboard page with full state management, loading UX, error handling, success display, and accessibility attributes. Property-based tests validate correctness properties from the design document.

## Tasks

- [x] 1. Install dependencies and configure test environment
  - [x] 1.1 Install runtime dependencies
    - Run `npm install react-markdown remark-gfm` in the frontend directory
    - _Requirements: 4.1–4.6_
  - [x] 1.2 Install dev dependencies
    - Run `npm install -D fast-check vitest @testing-library/react @testing-library/jest-dom jsdom` in the frontend directory
    - _Requirements: Testing Strategy_
  - [x] 1.3 Configure Vitest
    - Add `"test": "vitest --run"` script to `package.json`
    - Create or update `vite.config.js` to include test configuration with `jsdom` environment and setup file for `@testing-library/jest-dom`
    - Create `frontend/src/test-setup.js` importing `@testing-library/jest-dom`
    - _Requirements: Testing Strategy_

- [x] 2. Create API client (`frontend/src/lib/api.js`)
  - [x] 2.1 Implement `submitCommitForReview` function
    - Create `frontend/src/lib/api.js`
    - Define `API_BASE_URL` from `import.meta.env.VITE_API_URL` or fallback to `http://localhost:5000`
    - Export async function `submitCommitForReview(commitUrl)` that POSTs to `/api/review`
    - On `success: true` response, return `data` object; set `cached` flag from response
    - On `success: false` response, throw Error with the backend `error` string
    - On network failure, throw Error with user-friendly connectivity message
    - On non-JSON response, throw Error with "Received an unexpected response from the server."
    - _Requirements: 2.1, 2.3, 2.4, 2.5_
  - [ ]* 2.2 Write property test for API client response mapping
    - **Property 2: API client response mapping**
    - Generate random AnalysisData objects and error strings with fast-check
    - Mock `fetch` to return success/error responses
    - Verify: success responses return exact data; error responses throw with exact message
    - **Validates: Requirements 2.3, 2.4**
  - [ ]* 2.3 Write unit tests for API client
    - Test correct request body shape (`{ commitUrl }`) and `Content-Type` header
    - Test network failure produces user-friendly error message
    - Test non-JSON response produces appropriate error
    - _Requirements: 2.1, 2.5_

- [x] 3. Create MarkdownRenderer component (`frontend/src/components/MarkdownRenderer.jsx`)
  - [x] 3.1 Implement MarkdownRenderer
    - Create `frontend/src/components/MarkdownRenderer.jsx`
    - Import `ReactMarkdown` from `react-markdown` and `remarkGfm` from `remark-gfm`
    - Return `null` when `content` prop is falsy
    - Define custom component overrides for h1–h6, p, code (inline vs block), ul, ol, a, strong, em, blockquote, table, th, td with dark-theme Tailwind classes per design spec
    - Wrap output in a container with `aria-label="Review content"`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.4_
  - [ ]* 3.2 Write property test for markdown element rendering
    - **Property 5: Markdown element rendering**
    - Generate random text strings with fast-check, wrap in markdown syntax (headings, code fences, inline code, lists, bold, italic, links)
    - Render with MarkdownRenderer and verify corresponding HTML elements are present
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6**
  - [ ]* 3.3 Write unit tests for MarkdownRenderer
    - Test null/undefined/empty content returns null
    - Test emoji passthrough (🔴🟡🟢)
    - Test GFM table rendering
    - _Requirements: 4.5, 4.7_

- [ ] 4. Checkpoint — Verify foundation
  - Ensure all tests pass, ask the user if questions arise.
  - API client and MarkdownRenderer should be independently functional before wiring into the page.

- [ ] 5. Enhance page.js with state management and API integration
  - [ ] 5.1 Add state variables and handleSubmit logic
    - Add `error`, `reviewData`, `isCached` state variables to `page.js`
    - Import `submitCommitForReview` from `../lib/api`
    - Rewrite `handleSubmit` to: set loading state, clear error/reviewData, call API client, handle success (store data + cached flag), handle failure (store error message), always clear loading
    - Store last submitted URL for retry functionality
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2_
  - [ ]* 5.2 Write property test for state transition consistency
    - **Property 1: State transition consistency**
    - Generate random non-empty URL strings and random mock responses (success/failure)
    - Verify: immediately after submit, isLoading=true, error=null, reviewData=null; after success, isLoading=false, reviewData=data; after failure, isLoading=false, error=message
    - **Validates: Requirements 1.2, 1.3, 1.4**
  - [ ]* 5.3 Write property test for form-to-API delegation
    - **Property 4: Form-to-API delegation**
    - Generate random non-empty strings, submit form, verify `submitCommitForReview` called with exact string
    - **Validates: Requirements 2.2**

- [ ] 6. Implement loading skeleton
  - [ ] 6.1 Add loading skeleton UI
    - In the Review_Output section of `page.js`, render a pulsing skeleton placeholder when `isLoading` is true
    - Use `animate-pulse` Tailwind class on gray placeholder blocks approximating review card shape (header bar, multiple text lines, code block area)
    - Disable submit button and show "Analyzing..." text while loading
    - Add `aria-live="polite"` region with `role="status"` announcing loading state
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.2_

- [ ] 7. Implement error display
  - [ ] 7.1 Add error banner UI
    - In the Review_Output section, render error banner when `error` state is set
    - Use `AlertCircle` icon from lucide-react
    - Include Dismiss button (clears error) and Retry button (re-submits last URL)
    - Apply `role="alert"` and `aria-live="assertive"` for screen reader announcement
    - Style with red-tinted dark theme (border-red-800/50, bg-red-950/50)
    - _Requirements: 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 7.3_
  - [ ]* 7.2 Write property test for error message display passthrough
    - **Property 3: Error message display passthrough**
    - Generate random non-empty error strings with fast-check
    - Set error state and render, verify the exact string appears in the error container
    - **Validates: Requirements 1.5, 3.1**

- [ ] 8. Implement success display
  - [ ] 8.1 Add metadata header and markdown rendering
    - When `reviewData` is set, render a metadata header showing: repository name, truncated commit SHA (first 7 chars), author name
    - When `isCached` is true, show a subtle "Cached" badge
    - Pass `reviewData.aiAnalysis` to `MarkdownRenderer` component
    - Clear previous content when new analysis arrives (handled by state reset in handleSubmit)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 8.2 Write property test for metadata display completeness
    - **Property 6: Metadata display completeness**
    - Generate random repoName, commitSha (40 hex chars), and author strings with fast-check
    - Render success state and verify: full repoName present, first 7 chars of commitSha present, full author present
    - **Validates: Requirements 6.1, 6.2**

- [ ] 9. Add accessibility attributes
  - [ ] 9.1 Enhance form and output accessibility
    - Add `aria-label="GitHub commit URL"` to the URL input field
    - Ensure `aria-live` regions are in place for loading and error states (from tasks 6 and 7)
    - Verify keyboard navigation: Enter submits form, focus moves to output after state transition
    - Add focus management: after successful analysis or error, move focus to the result/error region
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Final checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify the complete flow: submit URL → loading skeleton → success/error display
  - Confirm accessibility attributes are in place and keyboard navigation works

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1"],
      "description": "Install dependencies and configure test environment"
    },
    {
      "wave": 2,
      "tasks": ["2", "3"],
      "description": "Create API client and MarkdownRenderer in parallel"
    },
    {
      "wave": 3,
      "tasks": ["4"],
      "description": "Checkpoint - verify foundation components"
    },
    {
      "wave": 4,
      "tasks": ["5"],
      "description": "Enhance page.js with state management and API integration"
    },
    {
      "wave": 5,
      "tasks": ["6", "7", "8"],
      "description": "Implement loading skeleton, error display, and success display in parallel"
    },
    {
      "wave": 6,
      "tasks": ["9"],
      "description": "Add accessibility attributes across all components"
    },
    {
      "wave": 7,
      "tasks": ["10"],
      "description": "Final checkpoint - full integration verification"
    }
  ]
}
```

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Tasks 2 and 3 can be implemented in parallel (both depend only on task 1)
- Tasks 5–9 depend on tasks 2 and 3 being complete
- Each property test runs a minimum of 100 iterations via fast-check
- The project uses Vite (not Next.js App Router in production) so environment variables use `import.meta.env.VITE_*` prefix
- All files follow the project convention: components in PascalCase, utilities in kebab-case
