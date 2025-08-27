# Portfolio Website - Yamaç Bezirgan

A professional portfolio website showcasing software development expertise and project achievements.

## Overview

Modern React-based single-page application built with Vite, featuring responsive design and dynamic content integration via GitHub API.

## Technical Stack

- **Framework:** React 18.2
- **Build Tool:** Vite 7.1
- **Styling:** Custom CSS with theme system
- **API Integration:** GitHub REST API

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Access the development server at `http://localhost:5173`

## Build

```bash
npm run build
```

Production-ready files will be generated in the `dist` directory.

## Deployment

### GitHub Pages

1. Install deployment package:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Configure repository settings:
   - Navigate to Settings > Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

4. Deploy:
```bash
npm run deploy
```

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages

2. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
   - **Node.js version:** 18.x or higher

3. Environment variables: None required

4. Deploy via Git push or manual trigger in Cloudflare dashboard

## Project Structure

```
├── dist/              # Production build output
├── public/            # Static assets
│   ├── LOGO.png
│   ├── ME.png
│   └── YAMAÇ_BEZİRGAN.pdf
├── src/               # Source code
│   ├── components/    # React components
│   ├── data/          # Project data
│   └── styles/        # CSS modules
└── index.html         # Entry point
```

## Features

- Responsive design for all devices
- Dynamic GitHub repository integration
- Downloadable resume (PDF)
- Multi-theme support
- Optimized performance with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved. This is proprietary software.

## Contact

For inquiries, please contact via the portfolio website.