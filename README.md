# Nudgley

Voice-first ADHD task board with embedded coaching.

## Deploy to Netlify

1. Push this folder to a GitHub repo
2. Connect the repo to Netlify (netlify.com → New site from Git)
3. In Netlify → Site settings → Environment variables, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (from console.anthropic.com)
4. Deploy

That's it. Share the Netlify URL with anyone — no API key needed on their end.

## Local development

Open `index.html` directly in Chrome — it will run in demo mode (no real AI responses).
To test with live AI locally, you'll need the Netlify CLI:
```
npm install -g netlify-cli
ANTHROPIC_API_KEY=your-key netlify dev
```
