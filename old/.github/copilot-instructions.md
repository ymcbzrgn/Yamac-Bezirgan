<!-- Short, actionable instructions for AI code assistants working in this repo -->
# Repository-specific Copilot instructions

This is a Vite + React single-page portfolio site. Keep guidance concise and actionable and reference the files below when giving code changes.

- Project entry: `index.html` -> `src/main.jsx` -> `src/App.jsx`.
- Build/dev: `npm install` then `npm run dev` (Vite). Production build: `npm run build` (outputs to `dist`). See `package.json`.

Key patterns and conventions
- The app is intentionally small and component-driven; many sections live directly in `src/App.jsx` as static data (`sections`, `contact`). Update there when changing displayed copy or sample projects.
- Components are plain React function components under `src/` (not a nested components/ folder). Examples: `Header.jsx`, `GithubProjects.jsx`, `Projects.jsx`.
- Styling is global CSS imported in `src/main.jsx` (`src/styles.css`) and a small theme system that toggles `data-theme` on `document.body` (see `App.jsx` and `theme-*.css`).

Github API & images
- `src/GithubProjects.jsx` fetches public repos from GitHub unauthenticated. It handles errors and fallbacks. When modifying behavior, preserve:
  - unauthenticated rate-limit considerations (fetch 100 repos, filter forks);
  - preferred repo ordering via `preferred` prop;
  - image discovery logic in `RepoCard`: tries `portfolioWebsiteImage{, .png, .jpg, .jpeg, .webp}` on the repo root, then `/public/projects/<repo>.png|jpg`, then `/LOGO.png`.

Local assets and public folder
- Static assets live in `public/`. When adding project preview images, place them in `public/projects/<repo>.png` to be automatically discovered.
- Downloadable resume is `public/YAMAÇ_BEZİRGAN.pdf` referenced from `App.jsx`.

What to edit vs. what to avoid
- Edit `src/*.jsx` for UI/behavior changes and `src/styles*.css` for styling tweaks.
- Avoid adding large runtime dependencies for small fixes. This repo targets a minimal Vite setup with React only.

Tests, build and debug notes
- There are no test scripts. Keep changes small and smoke-test locally with `npm run dev` and by visiting `http://localhost:5173`.
- Use `npm run build` and `npm run preview` to validate production assets.

Examples of code tasks and repo-specific guidance
- To add a new themed CSS file: add `theme-<name>.css`, import it in `src/styles.css` or reference via the theme switcher, and update `Header.jsx`/`ThemeSwitcher.jsx` if necessary.
- To add a new GitHub preferred project: update the `preferred` array in `src/App.jsx` where `GithubProjects` is used.
- To change GitHub fetch behavior (caching, auth): prefer adding a small wrapper in `src/GithubProjects.jsx` and keep the UI fallback behavior intact.

Files to reference when making changes
- `README.md` — project overview and deployment notes
- `package.json` — scripts and dependencies
- `index.html`, `src/main.jsx`, `src/App.jsx` — app entry and central data
- `src/GithubProjects.jsx` — GitHub API integration and image fallback logic
- `public/` — static assets (LOGO.png, ME.png, projects/)

If unsure, open an issue instead of pushing large invasive changes. Ask the repo owner about GitHub API tokens or deployments before adding secrets or CI configuration.

If this file is outdated or missing details (deploy hooks, CI, tokens), request owner input and include exact scripts or env names to add.
