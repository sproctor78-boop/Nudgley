# Nudgley

Voice-first ADHD task board with embedded coaching.

## Current app architecture

The production app is now a React + TypeScript + Vite application under `src/`.
The original single-file prototype is retained at `legacy/index.html` as a rollback reference only.

## Deploy to Netlify

Netlify must build the Vite app and publish the generated `dist` directory.

Expected settings are in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

Set `ANTHROPIC_API_KEY` in Netlify environment variables for live AI operations.

## Local development

```bash
npm install
npm run dev
```

Build and checks:

```bash
npm run build
npm test
```

## If deployed changes are not visible

1. Confirm Netlify ran `npm run build` successfully.
2. Confirm Netlify is publishing `dist`, not the repository root.
3. Hard refresh the site or open it in a private window to bypass the previous PWA service-worker cache.
4. If the page says "Nudgley is loading…" permanently, the Vite bundle was not built/deployed.

The service-worker cache name was changed for the React migration so browsers are prompted to replace the old prototype shell.
