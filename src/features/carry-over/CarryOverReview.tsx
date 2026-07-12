import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';

const actions = [
  ['keep-today', 'Keep today'], ['move-week', 'Move to this week'], ['plan-later', 'Plan later'], ['resume', 'Resume'], ['break-down', 'Break down'], ['drop', 'Drop']
] as const;

export function CarryOverReview() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const items = state.carryOver.map(item => ({ item, task: state.tasks.find(task => task.id === item.taskId) })).filter(entry => entry.task);
  if (!items.length) return null;
  return <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="carry-title">
    <div className="sheet carry-sheet">
      <h2 id="carry-title">Morning carry-over review</h2>
      <p>Unfinished planned work needs a calm decision. Nothing has failed.</p>
      <button className="primary-action" onClick={() => items.forEach(({ item }) => dispatch({ type: 'applyCarryOver', taskId: item.taskId, action: 'keep-today' }))}>Keep all in Today</button>
      <div className="carry-list">{items.map(({ item, task }) => task && <article key={item.taskId} className="carry-item"><strong>{task.title}</strong><p>{task.status === 'in-progress' ? 'Ready to resume' : item.reason === 'unfinished-week' ? 'This week needs review' : 'Today needs review'}</p><div>{actions.map(([value, label]) => <button key={value} onClick={() => dispatch({ type: 'applyCarryOver', taskId: item.taskId, action: value })}>{label}</button>)}</div></article>)}</div>
    </div>
  </section>;
}
