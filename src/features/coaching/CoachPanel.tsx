import { useRef, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { useClickOutside } from '../../hooks/useClickOutside';
import { BlockedIcon, ChatIcon, ChevronDownIcon, CompassIcon, MoonIcon, SunIcon, WrenchIcon } from '../../components/icons/Icons';

type CoachMode = 'morning' | 'breakdown' | 'stuck' | 'mood' | 'eod' | 'chat';

const modes: Array<{ id: CoachMode; label: string; description: string; icon: (props: { width: number; height: number }) => JSX.Element; opener: string }> = [
  { id: 'morning', label: 'Plan my day', description: 'Set intention, anchor task', icon: SunIcon, opener: 'Start with the ribbon recommendation, or tell me what has to move today.' },
  { id: 'breakdown', label: 'Break it down', description: 'Turn a task into first steps', icon: WrenchIcon, opener: 'Which task? Give me the title and I will help you find the first physical step.' },
  { id: 'stuck', label: "I'm stuck", description: 'Restart the loop, overthinking', icon: BlockedIcon, opener: "That's the restart loop — it feels like thinking, but it's avoidance. Pick one task in Now or Today. What is the next physical action?" },
  { id: 'mood', label: 'Mood check', description: 'Energy & headspace read', icon: CompassIcon, opener: 'How is your energy right now — low, steady, or wired? That changes what I would suggest next.' },
  { id: 'eod', label: 'End of day', description: 'Close off & reset', icon: MoonIcon, opener: 'Quick close-out: what got done, what is carrying over, and what is the one thing tomorrow should start with?' },
  { id: 'chat', label: 'Open chat', description: 'Think something through', icon: ChatIcon, opener: 'Practical problem or thinking out loud?' }
];

export function CoachPanel() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<CoachMode | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'coach' | 'user'; text: string }>>([]);
  const [text, setText] = useState('');
  const panelRef = useRef<HTMLElement>(null);

  function close() { dispatch({ type: 'toggleUi', key: 'coachOpen', value: false }); }
  useClickOutside(panelRef, close, state.ui.coachOpen);

  if (!state.ui.coachOpen) return null;

  function startMode(next: CoachMode) {
    const config = modes.find(item => item.id === next);
    setMode(next);
    setMessages(config ? [{ role: 'coach', text: config.opener }] : []);
  }

  function backToModes() { setMode(null); setMessages([]); }

  return <aside className="coach-panel" aria-label="Coach panel" ref={panelRef}>
    <header>
      {mode && <button type="button" className="coach-back" onClick={backToModes} aria-label="Back to coach options"><ChevronDownIcon width={15} height={15} style={{ transform: 'rotate(90deg)' }} /></button>}
      <h2>Coach</h2>
      <button onClick={close}>Close</button>
    </header>

    {!mode && <>
      <p className="coach-intro">Your coach can see your board, suggest priorities, break tasks down, and help you reset.</p>
      <div className="coach-mode-grid">
        {modes.map(item => <button key={item.id} className="coach-mode" onClick={() => startMode(item.id)}>
          <span className="coach-mode-icon"><item.icon width={17} height={17} /></span>
          <span className="coach-mode-copy"><strong>{item.label}</strong><span>{item.description}</span></span>
        </button>)}
      </div>
    </>}

    {mode && <>
      <div className="coach-messages">{messages.map((m, i) => <p key={i} className={m.role}>{m.text}</p>)}</div>
      <form onSubmit={(event: any) => {
        event.preventDefault();
        if (!text.trim()) return;
        const userText = text;
        setText('');
        setMessages(m => [...m, { role: 'user', text: userText }, { role: 'coach', text: 'Understood. Keep it concrete: what can you do in the next ten minutes?' }]);
      }}>
        <label className="sr-only" htmlFor="coach-input">Message coach</label>
        <textarea id="coach-input" value={text} onChange={(e: any) => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </>}
  </aside>;
}
