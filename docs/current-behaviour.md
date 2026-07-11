# Nudgley current behaviour baseline

This document records the current prototype behaviour before modular re-engineering. It is intentionally descriptive and should not be treated as a rewrite plan.

## Current repository shape

- `index.html` is the runnable browser application and contains the markup, CSS and JavaScript for the current product.
- `manifest.json` defines the PWA manifest.
- `sw.js` defines the service worker cache behaviour.
- `netlify.toml` publishes the repository root and rewrites `/api/nudge` to the Netlify function.
- `netlify/functions/nudge.js` is the Anthropic proxy used by Netlify.
- `functions/nudge.js` is a duplicate proxy file and is not referenced by `netlify.toml`.

## Board model to preserve

The board is the primary product surface. The current buckets are:

1. `immediate` — Immediate / Now
2. `today` — Today
3. `tomorrow` — Tomorrow
4. `week` — This Week / Week
5. `planned` — To Plan / Plan

The migration must preserve this board-first model unless the product owner explicitly changes it.

## Critical behaviour to protect with tests

- Voice or typed capture should create reviewable draft tasks rather than silently saving AI output.
- Task parsing should infer buckets from temporal words such as urgent, today, tomorrow, this week and later.
- Completing a task should remove it from the open board and add it to completion history/momentum tracking.
- Tomorrow rollover should move due Tomorrow tasks into Today once the stored day changes.
- Task status and age are derived from dates, due dates, move counts and buckets.
- Task enhancement is a separate layer on a task and must not silently overwrite the original task text.
- Re-entry guidance should recommend a starting task without replacing the board as the main interface.
- Coaching memory should remain inspectable and clearable by the user.

## Non-goals for the first migration PR

- Do not replace `index.html` with React yet.
- Do not change visible product behaviour.
- Do not remove existing features because their implementation is poor.
- Do not introduce billing, public-beta infrastructure or remote sync in this baseline step.
