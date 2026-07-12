# Nudgley

Voice-first ADHD task board with embedded coaching.

## Current production app

The production app remains the working single-file prototype in `index.html`.
Do not replace this production entry until the React release builds, runs, passes tests and reaches functional parity.

## React release preview

A clean React + TypeScript release is being developed alongside the production prototype.
The preview entry is `react-index.html`; the application code lives under `src/`.

Local preview:

```bash
npm install
npm run dev
# open /react-index.html in the Vite dev server
```

Checks:

```bash
npm test
npm run build
```

## Deploy to Netlify

The current production deployment remains the static prototype:

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

Set `ANTHROPIC_API_KEY` in Netlify environment variables for live AI responses.

## Release rule

Only switch production from `index.html` to the React build after:

1. Existing localStorage data migrates safely.
2. Board, capture, task movement, completion, history, coaching, timer, settings and PWA behaviour have parity.
3. `npm test` passes.
4. `npm run build` passes.
5. Netlify preview deploy succeeds.
6. Manual desktop and mobile verification are complete.
