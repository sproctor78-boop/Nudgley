import { useMemo, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { createTask } from '../../domain/tasks/taskFactory';
import { extractDraftTasks } from '../../domain/tasks/taskParser';
import type { TaskBucket } from '../../domain/tasks/taskTypes';
import { BrowserSpeechRecognitionService } from '../../services/speech/speechRecognition';

function defaultBucket(nowCount: number, todayCount: number): TaskBucket { return nowCount < 3 ? 'now' : todayCount < 7 ? 'today' : 'planned'; }

export function CaptureBar() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const [listeningText, setListeningText] = useState('');
  const [speech] = useState(() => new BrowserSpeechRecognitionService());
  const bucket = useMemo(() => defaultBucket(state.tasks.filter(t => t.bucket === 'now').length, state.tasks.filter(t => t.bucket === 'today').length), [state.tasks]);

  function addFromText(value: string) {
    const drafts = extractDraftTasks(value);
    const toAdd = drafts.length ? drafts : [{ title: value, bucket, id: 'manual', confidence: 1, included: true }];
    toAdd.forEach(draft => dispatch({ type: 'addTask', task: createTask({ title: draft.title, bucket: draft.bucket ?? bucket }) }));
    setText(''); setListeningText('');
  }

  async function dictate() {
    if (!speech.isSupported()) {
      const fallback = window.prompt('Voice is not available in this browser. Type your tasks naturally:');
      if (fallback) addFromText(fallback);
      return;
    }
    dispatch({ type: 'toggleUi', key: 'captureListening', value: true });
    try {
      const result = await speech.listen(setListeningText);
      if (result) addFromText(result);
    } finally {
      dispatch({ type: 'toggleUi', key: 'captureListening', value: false });
    }
  }

  return <form className="capture-bar" onSubmit={(event: any) => { event.preventDefault(); if (text.trim()) addFromText(text); }}>
    <label className="sr-only" htmlFor="capture-input">Add a task</label>
    <input id="capture-input" value={text} onChange={(event: any) => setText(event.target.value)} placeholder="Add a task…" />
    <button type="button" className={`mic-button ${state.ui.captureListening ? 'listening' : ''}`} onClick={state.ui.captureListening ? () => speech.stop() : dictate} aria-pressed={state.ui.captureListening}>{state.ui.captureListening ? 'Stop' : 'Mic'}</button>
    <button type="submit" className="primary-action">Add</button>
    {listeningText && <output className="speech-output" aria-live="polite">{listeningText}</output>}
  </form>;
}
