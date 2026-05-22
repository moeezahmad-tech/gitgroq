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

1. THE App_Layout SHALL render the Footer below the page content on every route.
2. THE Footer SHALL remain visible without requiring the user to scroll past the page content when the page content does not fill the viewport.
3. THE Footer SHALL be visually consistent with the existing application theme (dark background, gray/white text, emerald accent colors).

### Requirement 2: Branding Attribution

**User Story:** As a product owner, I want the footer to mention GitGroq as a project of techkreative.com, so that proper attribution is displayed to all visitors.

#### Acceptance Criteria

1. THE Footer SHALL display text identifying GitGroq as a project of techkreative.com.
2. THE Footer SHALL include a hyperlink to `https://techkreative.com` that opens in a new browser tab.

### Requirement 3: Contact Page Footer Content

**User Story:** As a user visiting the Contact page, I want to see the GitHub repository link and project email in the footer, so that I can quickly find ways to reach the project team.

#### Acceptance Criteria

1. WHILE the user is on the Contact_Page, THE Footer SHALL display the GitHub_Link (`https://github.com/moeezahmad-tech/gitgroq`).
2. WHILE the user is on the Contact_Page, THE Footer SHALL display the Contact_Email (`gitgroq@techkreative.com`).
3. WHEN the user clicks the GitHub_Link, THE Footer SHALL open the repository URL in a new browser tab.
4. WHEN the user clicks the Contact_Email, THE Footer SHALL open the user's default email client with the recipient pre-filled.

### Requirement 4: Footer Accessibility

**User Story:** As a user relying on assistive technology, I want the footer to be accessible, so that I can navigate and understand its content using a screen reader.

#### Acceptance Criteria

1. THE Footer SHALL use a semantic `<footer>` HTML element.
2. THE Footer SHALL provide accessible labels for all hyperlinks.
3. THE Footer SHALL ensure sufficient color contrast between text and background (minimum WCAG AA ratio of 4.5:1 for normal text).

### Requirement 5: Footer Responsiveness

**User Story:** As a user on a mobile device, I want the footer to adapt to smaller screens, so that the content remains readable and usable.

#### Acceptance Criteria

1. THE Footer SHALL adjust its layout to stack content vertically on viewports narrower than 768px.
2. THE Footer SHALL maintain readable text sizes and adequate tap targets (minimum 44x44px) on mobile devices.
