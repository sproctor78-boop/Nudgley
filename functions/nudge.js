// Typed Nudgley AI operation proxy. Keeps provider credentials server-side.

const MODEL = 'claude-sonnet-4-20250514';
const MAX_BODY_BYTES = 20_000;
const OPERATION_LIMITS = {
  'enhance-task': 450,
  'parse-dictation': 450,
  'coaching-session': 600,
  'recommend-task': 350,
  'plan-day': 500,
  'weekly-review': 600
};

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function buildPrompt(operation, input) {
  if (operation === 'enhance-task') {
    return `Break this ADHD task into a safe, concrete next action. Return ONLY JSON with keys refined, steps, startHere, effort. Task: ${String(input.title || '').slice(0, 500)} Notes: ${String(input.notes || '').slice(0, 500)}`;
  }
  if (operation === 'parse-dictation') {
    return `Extract tasks from this dictation. Return ONLY JSON: {"tasks":[{"title":"...","bucket":"now|today|tomorrow|week|planned","confidence":0.8,"included":true}]}. Text: ${String(input.text || '').slice(0, 3000)}`;
  }
  return `Nudgley operation ${operation}. Return concise JSON only. Input: ${JSON.stringify(input).slice(0, 3000)}`;
}

function normalise(operation, data) {
  const text = data?.content?.[0]?.text || '{}';
  const cleaned = text.replace(/```json|```/g, '').trim();
  let parsed;
  try { parsed = JSON.parse(cleaned); } catch { parsed = {}; }
  if (operation === 'enhance-task') {
    return {
      refined: String(parsed.refined || ''),
      steps: Array.isArray(parsed.steps) ? parsed.steps.map(String).slice(0, 5) : [],
      startHere: String(parsed.startHere || parsed.steps?.[0] || ''),
      effort: String(parsed.effort || '')
    };
  }
  if (operation === 'parse-dictation') {
    const buckets = new Set(['now','today','tomorrow','week','planned']);
    return { tasks: Array.isArray(parsed.tasks) ? parsed.tasks.map((task, index) => ({ id: `ai_${Date.now()}_${index}`, title: String(task.title || task.text || '').trim(), bucket: buckets.has(task.bucket) ? task.bucket : 'today', confidence: Number(task.confidence || 0.8), included: task.included !== false })).filter(task => task.title) : [] };
  }
  return parsed;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if ((event.body || '').length > MAX_BODY_BYTES) return json(413, { error: 'Request too large' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, { error: 'AI service is not configured' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }
  const operation = String(body.operation || '');
  if (!Object.prototype.hasOwnProperty.call(OPERATION_LIMITS, operation)) return json(400, { error: 'Unsupported operation' });
  const input = typeof body.input === 'object' && body.input ? body.input : {};

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: OPERATION_LIMITS[operation], system: 'You are Nudgley, a calm ADHD-aware task planning assistant. Do not ask for classified or prohibited information. Return only the requested JSON.', messages: [{ role: 'user', content: buildPrompt(operation, input) }] })
    });
    const data = await response.json();
    if (!response.ok) return json(response.status, { error: 'AI provider error' });
    return json(200, normalise(operation, data));
  } catch {
    return json(502, { error: 'AI service unavailable' });
  }
};
