import { useMemo, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { computeStaleTasks } from '../../domain/scheduling/staleReview';
import { moveTask as moveTaskRule } from '../../domain/tasks/taskRules';
import { AlertIcon, CloseIcon } from '../../components/icons/Icons';

export function StaleReviewBanner() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const staleTasks = useMemo(() => computeStaleTasks(state.tasks), [state.tasks]);
  if (!staleTasks.length) return null;

  function rescheduleToday(taskId: string) {
    const task = state.tasks.find(item => item.id === taskId);
    if (!task) return;
    dispatch({ type: 'updateTask', task: { ...moveTaskRule(task, 'today'), dueDate: null } });
  }
  function moveToPlan(taskId: string) {
    const task = state.tasks.find(item => item.id === taskId);
    if (!task) return;
    dispatch({ type: 'updateTask', task: { ...moveTaskRule(task, 'planned'), dueDate: null } });
  }
  function dismiss(taskId: string) {
    const task = state.tasks.find(item => item.id === taskId);
    if (!task) return;
    dispatch({ type: 'updateTask', task: { ...task, dueDate: null, updatedAt: new Date().toISOString() } });
  }

  return <>
    <button type="button" className="stale-banner" onClick={() => setOpen(true)}>
      <AlertIcon width={15} height={15} />
      <span>{staleTasks.length} {staleTasks.length === 1 ? 'task needs' : 'tasks need'} a decision</span>
      <span className="stale-banner-cta">Review</span>
    </button>
    {open && <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="stale-title" onClick={() => setOpen(false)}>
      <div className="sheet carry-sheet" onClick={(event: any) => event.stopPropagation()}>
        <header>
          <h2 id="stale-title">Stale task review</h2>
          <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close"><CloseIcon /></button>
        </header>
        <p>These have been overdue a while. Nothing has failed — pick a next step for each.</p>
        <div className="carry-list">
          {staleTasks.map(task => <article key={task.id} className="carry-item">
            <strong>{task.title}</strong>
            <p>Due date passed {task.dueDate}</p>
            <div>
              <button onClick={() => rescheduleToday(task.id)}>Reschedule to today</button>
              <button onClick={() => moveToPlan(task.id)}>Move to To Plan</button>
              <button onClick={() => dispatch({ type: 'completeTask', taskId: task.id })}>Complete</button>
              <button onClick={() => dismiss(task.id)}>Dismiss date</button>
            </div>
          </article>)}
        </div>
      </div>
    </section>}
  </>;
}
