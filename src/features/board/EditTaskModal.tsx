import { useEffect, useState } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { resolveColumnLabel, taskBuckets } from '../../domain/tasks/taskTypes';
import { CloseIcon } from '../../components/icons/Icons';

export function EditTaskModal() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const task = state.tasks.find(item => item.id === state.ui.editingTaskId) ?? null;

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [bucket, setBucket] = useState('today');
  const [dueDate, setDueDate] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState('');
  const [effort, setEffort] = useState('');

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setNotes(task.notes ?? '');
    setBucket(task.bucket);
    setDueDate(task.dueDate ?? '');
    setEstimateMinutes(task.estimateMinutes ? String(task.estimateMinutes) : '');
    setEffort(task.effort ?? '');
  }, [task?.id]);

  if (!task) return null;

  const columns = [...taskBuckets.map(id => ({ id, label: resolveColumnLabel(id) })), ...(state.metadata.customColumns ?? [])];

  function close() { dispatch({ type: 'toggleUi', key: 'editingTaskId', value: null }); }

  function save() {
    if (!task || !title.trim()) return;
    dispatch({
      type: 'updateTask',
      task: {
        ...task,
        title: title.trim(),
        notes: notes.trim(),
        bucket,
        dueDate: dueDate || null,
        estimateMinutes: estimateMinutes ? Math.max(1, parseInt(estimateMinutes, 10)) : null,
        effort: (effort || null) as typeof task.effort,
        updatedAt: new Date().toISOString()
      }
    });
    close();
  }

  return <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-task-title" onClick={close}>
    <div className="sheet edit-sheet" onClick={(event: any) => event.stopPropagation()}>
      <header>
        <h2 id="edit-task-title">Edit task</h2>
        <button type="button" className="icon-button" onClick={close} aria-label="Close"><CloseIcon /></button>
      </header>
      <form onSubmit={(event: any) => { event.preventDefault(); save(); }}>
        <label>Title
          <input value={title} onChange={(event: any) => setTitle(event.target.value)} autoFocus />
        </label>
        <label>Notes
          <textarea value={notes} onChange={(event: any) => setNotes(event.target.value)} rows={3} />
        </label>
        <div className="edit-row">
          <label>Column
            <select value={bucket} onChange={(event: any) => setBucket(event.target.value)}>
              {columns.map(column => <option key={column.id} value={column.id}>{column.label}</option>)}
            </select>
          </label>
          <label>Due date
            <input type="date" value={dueDate} onChange={(event: any) => setDueDate(event.target.value)} />
          </label>
        </div>
        <div className="edit-row">
          <label>Estimate (minutes)
            <input type="number" min={1} value={estimateMinutes} onChange={(event: any) => setEstimateMinutes(event.target.value)} placeholder="e.g. 20" />
          </label>
          <label>Effort
            <select value={effort} onChange={(event: any) => setEffort(event.target.value)}>
              <option value="">Not set</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div className="edit-actions">
          <button type="button" className="danger" onClick={() => { dispatch({ type: 'deleteTask', taskId: task.id }); close(); }}>Delete task</button>
          <button type="submit" className="primary-action" disabled={!title.trim()}>Save</button>
        </div>
      </form>
    </div>
  </section>;
}
