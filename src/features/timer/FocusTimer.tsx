import { useEffect, useState } from 'react';
import { useAppState } from '../../app/providers/AppProviders';

export function FocusTimer() {
  const { ui } = useAppState();
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const id = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000); return () => window.clearInterval(id); }, [running]);
  if (!ui.timerOpen) return null;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return <aside className="timer-panel" aria-label="Focus timer"><span>Focus block</span><strong>{mins}:{secs}</strong><button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</button><button onClick={() => { setRunning(false); setSeconds(25 * 60); }}>Reset</button></aside>;
}
