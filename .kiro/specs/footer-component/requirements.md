# Requirements Document

## Introduction

This feature adds a shared Footer component to the GitGroq frontend application. The Footer appears on all pages and provides branding attribution to techkreative.com. On the Contact page specifically, the Footer displays the project's GitHub repository link and a contact email address.

## Glossary

- **Footer**: A shared React component rendered at the bottom of every page in the application layout.
- **Contact_Page**: The page accessible at the `/contact` route that displays contact information and a message form.
- **App_Layout**: The root layout component (`App.jsx`) that wraps all pages with shared UI elements (Navbar, Footer).
- **GitHub_Link**: A hyperlink pointing to the project repository at `https://github.com/moeezahmad-tech/gitgroq`.
- **Contact_Email**: The project email address `gitgroq@techkreative.com`.
- **Branding_Attribution**: A text statement identifying GitGroq as a project of techkreative.com.

## Requirements

### Requirement 1: Footer Presence on All Pages

**User Story:** As a user, I want to see a footer on every page, so that I can access project information and branding regardless of which page I am viewing.

#### Acceptance Criteria

1. THE App_Layout SHALL render the Footer below the page content on every route, including the 404 (not found) route.
2. WHILE the page content does not fill the viewport, THE Footer SHALL remain pinned to the bottom of the viewport without overlapping page content.
3. THE Footer SHALL use the application's dark theme: a dark background (matching the app background tone), gray or white text for labels, and emerald accent color for interactive or highlighted elements.
4. THE Footer SHALL display the application name, a copyright notice, and at least one navigation link to an existing application route.
5. THE Footer SHALL be rendered as an HTML `footer` landmark element so that assistive technologies can identify it.

### Requirement 2: Branding Attribution

**User Story:** As a product owner, I want the footer to mention GitGroq as a project of techkreative.com, so that proper attribution is displayed to all visitors.

#### Acceptance Criteria

1. THE Footer SHALL be visible on every page and SHALL display text that contains both "GitGroq" and "techkreative.com" in an attribution statement.
2. THE Footer SHALL include a hyperlink on the text "techkreative.com" pointing to `https://techkreative.com` that opens in a new browser tab.
3. THE Footer hyperlink to techkreative.com SHALL have an accessible name that conveys the link destination to assistive technologies.

### Requirement 3: Contact Page Footer Content

**User Story:** As a user visiting the Contact page, I want to see the GitHub repository link and project email in the footer, so that I can quickly find ways to reach the project team.

#### Acceptance Criteria

1. WHILE the user is on the Contact_Page, THE Footer section at the bottom of the page SHALL display the GitHub_Link (`https://github.com/moeezahmad-tech/gitgroq`) as a visible, clickable hyperlink.
2. WHILE the user is on the Contact_Page, THE Footer section SHALL display the Contact_Email (`gitgroq@techkreative.com`) as a visible, clickable hyperlink.
3. WHEN the user clicks the GitHub_Link, THE Footer SHALL open the repository URL in a new browser tab and the link element SHALL include an accessible label indicating it opens in a new window.
4. WHEN the user clicks the Contact_Email, THE Footer SHALL open the user's default email client with the recipient field pre-filled with `gitgroq@techkreative.com`.
5. WHILE the user is on the Contact_Page, THE Footer section SHALL be rendered as a distinct landmark region positioned below the main page content, identifiable by assistive technologies as a footer.

### Requirement 4: Footer Accessibility

**User Story:** As a user relying on assistive technology, I want the footer to be accessible, so that I can navigate and understand its content using a screen reader.

#### Acceptance Criteria

1. THE Footer SHALL use a semantic `<footer>` HTML element with an implicit or explicit `contentinfo` landmark role.
2. THE Footer SHALL provide a descriptive accessible name for each hyperlink that conveys the link's destination or purpose, either through visible link text or an `aria-label` attribute, such that no two links share identical accessible names unless they navigate to the same destination.
3. THE Footer SHALL ensure a minimum color contrast ratio of 4.5:1 between text and background for normal text (below 18px regular or 14px bold), and a minimum ratio of 3:1 for large text (18px or above regular, 14px or above bold), per WCAG AA.
4. THE Footer SHALL ensure all interactive elements (links, buttons) are reachable and operable via keyboard Tab navigation in a logical reading order (left-to-right, top-to-bottom).

### Requirement 5: Footer Responsiveness

**User Story:** As a user on a mobile device, I want the footer to adapt to smaller screens, so that the content remains readable and usable.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768px, THE Footer SHALL stack its content sections vertically in a single column layout.
2. WHILE the viewport width is less than 768px, THE Footer SHALL render all text at a minimum size of 14px and all interactive elements (links, buttons) with a minimum tap target area of 44x44px.
3. WHILE the viewport width is less than 768px, THE Footer SHALL display all content without horizontal overflow or truncation, keeping all text and links fully visible within the viewport width.
