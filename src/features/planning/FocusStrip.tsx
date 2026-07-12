import { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { recommendTask } from '../../domain/recommendations/recommendTasks';
import { taskMeta } from '../../domain/tasks/taskRules';
import { CloseIcon, SparkleIcon } from '../../components/icons/Icons';

export function FocusStrip() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const recommendation = useMemo(() => recommendTask(state.tasks, state.settings.triagePreference), [state.tasks, state.settings.triagePreference]);
  const active = state.tasks.find(task => task.id === (state.metadata.activeTaskId ?? state.ui.activeTaskId));
  const task = active ?? recommendation?.task;

  if (!task) {
    return <section className="focus-strip empty">
      <span className="focus-icon" aria-hidden="true"><SparkleIcon /></span>
      <p>Board is clear. Capture what needs attention when you're ready.</p>
    </section>;
  }

  const isResume = task.status === 'in-progress';
  const meta = taskMeta(task);
  const urgentReasons = ['Due date passed', 'Deadline coming up', 'Needs a decision'];
  const reason = !isResume && recommendation?.reason && urgentReasons.includes(recommendation.reason) ? recommendation.reason : null;
  const detail = isResume ? task.enhancement?.startHere ?? meta ?? 'Pick up where you left off.' : [reason, meta].filter(Boolean).join(' · ') || (task.enhancement?.startHere ?? 'Choose one clear next action.');

  return <section className="focus-strip" aria-label={isResume ? 'Current focus task' : 'Recommended focus task'}>
    <span className="focus-icon" aria-hidden="true"><SparkleIcon /></span>
    <div className="focus-main">
      <span className="focus-label">{isResume ? 'In progress' : 'Start with'}</span>
      <strong className="focus-title">{task.title}</strong>
      {detail && <span className="focus-meta">{detail}</span>}
    </div>
    <div className="focus-actions">
      <button className="focus-primary" onClick={() => dispatch({ type: isResume ? 'resumeTask' : 'startTask', taskId: task.id })}>{isResume ? 'Resume' : 'Start'}</button>
      <button className="focus-link" onClick={() => dispatch({ type: 'toggleUi', key: 'changeSuggestionOpen' })}>Choose another</button>
      <button className="icon-button focus-dismiss" onClick={() => dispatch({ type: 'saveMetadata', metadata: { ...state.metadata, dismissedFocusDate: new Date().toDateString() } })} aria-label="Dismiss suggestion">
        <CloseIcon />
      </button>
    </div>
    {state.ui.changeSuggestionOpen && <div className="suggestion-menu" role="dialog" aria-label="Change suggestion mode">
      {(['balanced', 'quickwins', 'frog'] as const).map(pref => <button key={pref} onClick={() => { dispatch({ type: 'saveSettings', settings: { ...state.settings, triagePreference: pref } }); dispatch({ type: 'toggleUi', key: 'changeSuggestionOpen', value: false }); }}>{pref === 'quickwins' ? 'Quick wins' : pref === 'frog' ? 'Eat the frog' : 'Balanced'}</button>)}
    </div>}
  </section>;
}
