import { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { recommendTask } from '../../domain/recommendations/recommendTasks';

export function FocusRibbon() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const recommendation = useMemo(() => recommendTask(state.tasks, state.settings.triagePreference), [state.tasks, state.settings.triagePreference]);
  const active = state.tasks.find(task => task.id === (state.metadata.activeTaskId ?? state.ui.activeTaskId));
  const task = active ?? recommendation?.task;
  if (!task) return <section className="focus-ribbon empty"><div><span className="eyebrow">START WITH</span><strong>Board is clear</strong><p>Capture what needs attention when you're ready.</p></div></section>;
  const isResume = task.status === 'in-progress';
  return <section className="focus-ribbon" aria-label={isResume ? 'Current focus task' : 'Recommended focus task'}>
    <div className="focus-copy">
      <span className="eyebrow">{isResume ? 'IN PROGRESS' : 'START WITH'}</span>
      <strong>{task.title}</strong>
      <p>{task.enhancement?.startHere ?? recommendation?.reason ?? 'Choose one clear next action.'}</p>
    </div>
    <div className="focus-actions">
      <button className="primary-action" onClick={() => dispatch({ type: isResume ? 'resumeTask' : 'startTask', taskId: task.id })}>{isResume ? 'Resume' : 'Start'}</button>
      <button className="secondary-action" onClick={() => dispatch({ type: 'toggleUi', key: 'changeSuggestionOpen' })}>Change suggestion</button>
      <button className="ghost-action" onClick={() => dispatch({ type: 'saveMetadata', metadata: { ...state.metadata, dismissedFocusDate: new Date().toDateString() } })}>Dismiss</button>
    </div>
    {state.ui.changeSuggestionOpen && <div className="suggestion-menu" role="dialog" aria-label="Change suggestion mode">
      {(['balanced','quickwins','frog'] as const).map(pref => <button key={pref} onClick={() => { dispatch({ type: 'saveSettings', settings: { ...state.settings, triagePreference: pref } }); dispatch({ type: 'toggleUi', key: 'changeSuggestionOpen', value: false }); }}>{pref === 'quickwins' ? 'Quick wins' : pref === 'frog' ? 'Eat the frog' : 'Balanced'}</button>)}
    </div>}
  </section>;
}
