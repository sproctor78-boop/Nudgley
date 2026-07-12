import { useMemo, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { FallbackAiClient } from '../../services/api/aiClient';

export function CoachPanel() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Array<{ role: 'coach' | 'user'; text: string }>>([{ role: 'coach', text: 'I can help plan, break down or resume a task. The board stays in charge.' }]);
  const [text, setText] = useState('');
  const ai = useMemo(() => new FallbackAiClient(), []);
  if (!state.ui.coachOpen) return null;
  return <aside className="coach-panel" aria-label="Coach panel">
    <header><h2>Coach</h2><button onClick={() => dispatch({ type: 'toggleUi', key: 'coachOpen', value: false })}>Close</button></header>
    <div className="coach-actions"><button onClick={() => setMessages(m => [...m, { role: 'coach', text: 'Pick one task in Now or Today. What is the next physical action?' }])}>I'm stuck</button><button onClick={() => setMessages(m => [...m, { role: 'coach', text: 'Start with the ribbon recommendation, or capture what is missing.' }])}>Plan my day</button></div>
    <div className="coach-messages">{messages.map((m, i) => <p key={i} className={m.role}>{m.text}</p>)}</div>
    <form onSubmit={async (event: any) => { event.preventDefault(); if (!text.trim()) return; const userText = text; setText(''); setMessages(m => [...m, { role: 'user', text: userText }, { role: 'coach', text: 'Understood. Keep it concrete: what can you do in the next ten minutes?' }]); }}><label className="sr-only" htmlFor="coach-input">Message coach</label><textarea id="coach-input" value={text} onChange={(e: any) => setText(e.target.value)} /><button>Send</button></form>
  </aside>;
}
