# Election Assistant

Election Assistant is a polished, production-ready educational web app that explains the election process with a modern guided interface, a chatbot-style assistant, timeline visualization, and a voter readiness checker.

## Features

- Modern hero-driven interface with sticky navigation, soft shadows, responsive cards, and Google Fonts
- Interactive election guide with progress tracker and stage detail cards
- Chatbot UI with user and assistant bubbles, quick prompts, input sanitization, validation, and graceful file-mode fallback
- Chat layout separated cleanly: assistant thread on the left, quick prompts and suggested topics on the right
- Timeline viewer with visual markers for each election phase
- Voter readiness quiz with live scoring and localized guidance
- Fake news awareness section focused on source-check habits
- English and Hindi interface toggle
- Dark mode toggle with persistent preference
- Google Analytics support and Firebase configuration placeholder

## Tech stack

- Vanilla JavaScript modules
- Node.js HTTP server
- Shared logic modules for assistant matching, readiness scoring, sanitization, and validation
- Node built-in test runner with Jest-style `describe` and `it` cases

## Folder structure

- `public/components/`: lazily loaded UI sections
- `public/styles/`: application styles
- `public/scripts/`: app bootstrap, config, client services, and DOM utilities
- `src/`: shared data, utilities, and server-side logic
- `tests/`: sample behavior and integration tests

## Run locally

1. Open a terminal in `C:\Users\user\Documents\New project\election-assistant`
2. Start the server:

```powershell
node server.js
```

3. Open `http://127.0.0.1:4173`

## Direct file mode

You can also open [public/index.html](</C:/Users/user/Documents/New project/election-assistant/public/index.html>) directly in a browser for a styled offline preview. In file mode the assistant falls back to local guidance, while the full server mode adds API validation, rate limiting, and security headers.

## Tests

Run:

```powershell
node --test --test-isolation=none
```

## Google services

- Google Analytics: add your measurement ID to the `ga-measurement-id` meta tag in [public/index.html](</C:/Users/user/Documents/New project/election-assistant/public/index.html>).
- Firebase placeholder: update [firebase.js](</C:/Users/user/Documents/New project/election-assistant/public/scripts/config/firebase.js>) with your project keys before wiring Firebase SDK features.

## Security notes

- Questions are sanitized before display and validated on both client and server
- Assistant responses are rendered with safe DOM APIs instead of `innerHTML`
- The server includes rate limiting and a CSP that allows Google Fonts and Google integrations
- No secrets are committed to the frontend
