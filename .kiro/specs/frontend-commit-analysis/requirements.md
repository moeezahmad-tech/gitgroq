# Requirements Document

## Introduction

This feature implements client-side state management, API integration, and markdown rendering for the DevTracks (GitGroq) commit analysis dashboard. The homepage (`frontend/src/app/page.js`) will be enhanced to submit commit URLs to the backend `POST /api/review` endpoint, manage loading/error/success states via React hooks, and render the AI-generated markdown review with proper styling for code blocks, headers, lists, and severity indicators within the existing dark-themed Tailwind canvas.

## Glossary

- **Dashboard**: The main homepage view (`page.js`) containing the URL form, review output section, and history sidebar
- **API_Client**: The centralized fetch utility located at `lib/api.js` responsible for all HTTP communication with the backend
- **Review_Output**: The main content section that displays the rendered AI analysis markdown
- **Markdown_Renderer**: A React component that converts raw markdown text into styled HTML elements
- **Analysis_Data**: The response object from the backend containing `_id`, `repoName`, `commitSha`, `author`, `aiAnalysis`, and `createdAt` fields
- **Loading_State**: A boolean flag indicating an in-progress API request
- **Error_State**: An object or string holding error information when an API request fails

## Requirements

### Requirement 1: State Management

**User Story:** As a developer, I want the dashboard to track loading, error, and result states, so that the UI always reflects the current status of a commit analysis request.

#### Acceptance Criteria

1. THE Dashboard SHALL maintain separate state variables for Loading_State, Error_State, and Analysis_Data using React `useState` hooks
2. WHEN a commit analysis request begins, THE Dashboard SHALL set Loading_State to true, clear Error_State, and clear previous Analysis_Data
3. WHEN a commit analysis request succeeds, THE Dashboard SHALL set Loading_State to false and store the returned Analysis_Data
4. WHEN a commit analysis request fails, THE Dashboard SHALL set Loading_State to false and store the error message in Error_State
5. WHEN Error_State contains a value, THE Dashboard SHALL display the error message in a visually distinct error container within the Review_Output section

### Requirement 2: API Integration

**User Story:** As a developer, I want the form submission to call the backend review endpoint through a centralized API client, so that network logic is decoupled from UI components.

#### Acceptance Criteria

1. THE API_Client SHALL export a function that sends a POST request to `/api/review` with a JSON body containing `{ commitUrl: string }`
2. WHEN the user submits the URL form with a non-empty value, THE Dashboard SHALL invoke the API_Client function with the entered URL
3. WHEN the API_Client receives a response with `success: true`, THE API_Client SHALL return the `data` object from the response
4. WHEN the API_Client receives a response with `success: false`, THE API_Client SHALL throw an error containing the `error` field from the response
5. WHEN a network error occurs, THE API_Client SHALL throw an error with a user-friendly message describing the connectivity failure

### Requirement 3: Error Handling and Display

**User Story:** As a developer, I want clear error messages displayed in the UI when something goes wrong, so that I understand what failed and can take corrective action.

#### Acceptance Criteria

1. WHEN the backend returns a validation error (invalid URL format), THE Dashboard SHALL display the specific error message from the backend response
2. WHEN the backend returns a 404 error (commit not found), THE Dashboard SHALL display a message indicating the commit was not found or the repository is not public
3. WHEN the backend returns a 502 error (AI service unavailable), THE Dashboard SHALL display a message indicating the AI service is temporarily unavailable
4. WHEN a network timeout or connection failure occurs, THE Dashboard SHALL display a message indicating a connection problem
5. WHEN an error is displayed, THE Dashboard SHALL provide a way for the user to dismiss the error or retry the request

### Requirement 4: Markdown Rendering

**User Story:** As a developer, I want the AI analysis markdown rendered with proper formatting, so that code blocks, headers, lists, and severity indicators are visually clear and readable.

#### Acceptance Criteria

1. THE Markdown_Renderer SHALL render markdown headings (h1–h6) with appropriate font sizes and spacing consistent with the dark theme
2. THE Markdown_Renderer SHALL render fenced code blocks with a monospace font, syntax-distinguishable background, and horizontal scroll for overflow
3. THE Markdown_Renderer SHALL render inline code with a distinct background and monospace font
4. THE Markdown_Renderer SHALL render ordered and unordered lists with proper indentation and bullet/number markers
5. THE Markdown_Renderer SHALL render severity emoji indicators (🔴🟡🟢) without modification, preserving their visual meaning
6. THE Markdown_Renderer SHALL render bold, italic, and link elements with appropriate styling
7. WHEN the aiAnalysis field is empty or undefined, THE Markdown_Renderer SHALL not render any content

### Requirement 5: Loading UX

**User Story:** As a developer, I want visual feedback while waiting for the AI analysis, so that I know the system is working and have not encountered a silent failure.

#### Acceptance Criteria

1. WHILE Loading_State is true, THE Dashboard SHALL display an animated loading indicator within the Review_Output section
2. WHILE Loading_State is true, THE Dashboard SHALL disable the submit button and show "Analyzing..." text on it
3. WHILE Loading_State is true, THE Dashboard SHALL display a pulsing skeleton placeholder approximating the shape of a review card
4. WHEN Loading_State transitions from true to false, THE Dashboard SHALL immediately replace the loading indicator with either the rendered review or an error message

### Requirement 6: Success Display

**User Story:** As a developer, I want the completed review displayed clearly in the output section, so that I can read and act on the AI analysis.

#### Acceptance Criteria

1. WHEN Analysis_Data is available, THE Dashboard SHALL render the `aiAnalysis` field using the Markdown_Renderer inside the Review_Output section
2. WHEN Analysis_Data is available, THE Dashboard SHALL display metadata including the repository name, commit SHA (truncated to 7 characters), and author name above the rendered markdown
3. WHEN the response includes `cached: true`, THE Dashboard SHALL display a subtle indicator that the review was loaded from cache
4. WHEN a new analysis replaces a previous one, THE Dashboard SHALL clear the previous content before rendering the new review

### Requirement 7: Accessibility

**User Story:** As a developer using assistive technology, I want the dashboard to be navigable and understandable via screen readers and keyboard, so that the tool is usable regardless of ability.

#### Acceptance Criteria

1. THE Dashboard form SHALL include an accessible label for the URL input field via `aria-label` or associated `<label>` element
2. WHILE Loading_State is true, THE Dashboard SHALL announce the loading status to screen readers using `aria-live` region or `role="status"`
3. WHEN an error is displayed, THE Dashboard SHALL announce the error to screen readers using `aria-live="assertive"` or `role="alert"`
4. THE Markdown_Renderer output container SHALL have an accessible label identifying it as the review content region
5. THE Dashboard SHALL support full keyboard navigation including form submission via Enter key and focus management after state transitions
