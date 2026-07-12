import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { createTask } from '../../domain/tasks/taskFactory';
import { extractDraftTasks } from '../../domain/tasks/taskParser';
import type { TaskBucket } from '../../domain/tasks/taskTypes';
import { BrowserSpeechRecognitionService } from '../../services/speech/speechRecognition';
import { CloseIcon, MicIcon, PlusIcon } from '../../components/icons/Icons';

function defaultBucket(nowCount: number, todayCount: number): TaskBucket { return nowCount < 3 ? 'now' : todayCount < 7 ? 'today' : 'planned'; }

export function TaskCapture() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const [listeningText, setListeningText] = useState('');
  const [speech] = useState(() => new BrowserSpeechRecognitionService());
  const inputRef = useRef<HTMLInputElement>(null);
  const bucket = useMemo(() => defaultBucket(state.tasks.filter(t => t.bucket === 'now').length, state.tasks.filter(t => t.bucket === 'today').length), [state.tasks]);
  const open = state.ui.captureOpen;

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  function close() {
    speech.stop();
    dispatch({ type: 'toggleUi', key: 'captureOpen', value: false });
    dispatch({ type: 'toggleUi', key: 'captureListening', value: false });
    setText(''); setListeningText('');
  }

  function addFromText(value: string) {
    const drafts = extractDraftTasks(value);
    const toAdd = drafts.length ? drafts : [{ title: value, bucket, id: 'manual', confidence: 1, included: true }];
    toAdd.forEach(draft => dispatch({ type: 'addTask', task: createTask({ title: draft.title, bucket: draft.bucket ?? bucket }) }));
    close();
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

  return <>
    <button type="button" className="capture-pill" onClick={() => dispatch({ type: 'toggleUi', key: 'captureOpen', value: true })}>
      <PlusIcon /><span>Add task</span>
    </button>
    {open && <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="capture-title" onClick={close}>
      <div className="sheet capture-sheet" onClick={(event: any) => event.stopPropagation()}>
        <header>
          <h2 id="capture-title">Add task</h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close">
            <CloseIcon />
          </button>
        </header>
        <form onSubmit={(event: any) => { event.preventDefault(); if (text.trim()) addFromText(text); }}>
          <div className="capture-input-row">
            <label className="sr-only" htmlFor="capture-input">Task description</label>
            <input id="capture-input" ref={inputRef} value={text} onChange={(event: any) => setText(event.target.value)} placeholder="Type a task, or use the mic to dictate…" autoComplete="off" />
            <button
              type="button"
              className={`mic-toggle ${state.ui.captureListening ? 'listening' : ''}`}
              onClick={state.ui.captureListening ? () => speech.stop() : dictate}
              aria-pressed={state.ui.captureListening}
              aria-label={state.ui.captureListening ? 'Stop dictating' : 'Dictate a task'}
            >
              <MicIcon />
            </button>
          </div>
          {state.ui.captureListening && <p className="listening-status" aria-live="polite">{listeningText || 'Listening…'}</p>}
          <button type="submit" className="primary-action capture-submit" disabled={!text.trim()}>Add task</button>
        </form>
      </div>
    </section>}
  </>;
}
