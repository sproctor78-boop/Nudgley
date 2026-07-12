# Nudgley agent working rules

These instructions apply to the whole repository.

## Preventing avoidable merge conflicts

- Do not wholesale replace large root files such as `index.html`, `package.json`, service workers or deployment config unless the user explicitly asks for that scope.
- Prefer phased migrations with small, reviewable commits. If a root entry point must change, document the expected conflict-resolution choice in the PR body.
- Keep the legacy prototype in `legacy/index.html` as a rollback reference until the product owner confirms parity and explicitly approves removal.
- Do not make conflicting deployment changes without also updating `README.md` with the exact build/publish behaviour.

## Testing honesty

- Never claim `npm install`, `npm test`, `npm run build`, browser smoke tests, Netlify deploy checks or manual UI verification passed unless the command/test was actually run in this environment and succeeded.
- If npm registry access, browser launch, screenshots or Netlify verification are blocked, report that as an environment limitation using warning language.

## Product preservation

- Preserve the board-first product concept.
- Do not turn Nudgley into a chatbot-centred product.
- Preserve existing localStorage data and provide migrations before changing stored schemas.
- Do not remove working prototype functionality merely because the implementation is poor.
