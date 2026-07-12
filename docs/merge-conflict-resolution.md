# Resolving the current React migration PR conflicts

GitHub may report conflicts for this migration because the PR intentionally changes the app entry point and deployment files while `main` still contains the single-file prototype.

## Conflicting files shown in GitHub

The known conflicts are:

1. `index.html`
2. `package.json`
3. `public/sw.js` or `sw.js`

## Which side to accept

If the goal is to continue with the React + TypeScript migration, resolve them as follows:

| File | Action | Why |
| --- | --- | --- |
| `index.html` | Accept the PR / codex / current change | The React migration needs the Vite mount file with `<div id="root">` and `/src/main.tsx`. The old single-file prototype is preserved in `legacy/index.html`. |
| `package.json` | Accept the PR / codex / current change, then manually re-add any unrelated dependency changes from `main` if present | The React migration needs Vite, React, TypeScript, Zod and Vitest scripts/dependencies. |
| `public/sw.js` or `sw.js` | Accept the PR / codex / current change | The cache key was bumped to `nudgley-react-v2` so browsers stop serving the old prototype shell. |

## What not to do

- Do not choose "Accept both changes" for `index.html`; that creates two partial HTML documents and will break the app.
- Do not delete `legacy/index.html` during this conflict resolution; it is the rollback copy of the previous working prototype.
- Do not keep Netlify publishing the repository root. The React app must run `npm run build` and publish `dist`.

## After marking conflicts resolved

Run these checks in an environment with npm registry access:

```bash
npm install
npm test
npm run build
```

If the deployed site still shows the old prototype after merge:

1. Confirm Netlify used `npm run build`.
2. Confirm Netlify published `dist`.
3. Hard refresh or open a private window to bypass the old PWA service worker.
