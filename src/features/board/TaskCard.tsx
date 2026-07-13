import { useRef, useState, type MouseEvent } from 'react';
import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { resolveColumnLabel, taskBuckets, type Task } from '../../domain/tasks/taskTypes';
import { presentationStatus, taskMeta } from '../../domain/tasks/taskRules';
import { CheckIcon, MoreIcon } from '../../components/icons/Icons';
import { useTaskDrag } from './dragAndDrop';
import { useClickOutside } from '../../hooks/useClickOutside';

function formatDue(dueDate: string): string {
  const [, m, d] = dueDate.split('-').map(Number);
  return new Date(2000, (m || 1) - 1, d || 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const status = presentationStatus(task);
  const meta = taskMeta(task);
  const { dragging, onDragStart, onDragEnd } = useTaskDrag(task.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const otherColumns = [
    ...taskBuckets.map(id => ({ id, label: resolveColumnLabel(id) })),
    ...(state.metadata.customColumns ?? [])
  ].filter(column => column.id !== task.bucket);

  function openEditor(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.complete-control, .task-admin')) return;
    dispatch({ type: 'toggleUi', key: 'editingTaskId', value: task.id });
  }

  return <article
    className={`task-card bucket-${task.bucket} ${compact ? 'task-card--compact' : ''} ${dragging ? 'is-dragging' : ''}`}
    draggable
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onDoubleClick={openEditor}
  >
    <button className="complete-control" onClick={() => dispatch({ type: 'completeTask', taskId: task.id })} aria-label={`Complete ${task.title}`}>
      <CheckIcon width={compact ? 13 : 15} height={compact ? 13 : 15} />
    </button>
    <div className="task-main">
      <h3>{task.title}</h3>
      {!compact && task.enhancement?.startHere && <div className="next-action"><span>Next action</span><strong>{task.enhancement.startHere}</strong></div>}
      <div className="task-tags">
        {status && <span className={`status-chip tone-${status.tone}`}>{status.label}</span>}
        {!status && task.dueDate && <span className="meta-chip">Due {formatDue(task.dueDate)}</span>}
        {!compact && meta && <span className="meta-chip">{meta}</span>}
      </div>
    </div>
    <div className="task-admin" ref={menuRef}>
      <button type="button" className="task-admin-trigger" aria-label={`Task options for ${task.title}`} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
        <MoreIcon width={compact ? 15 : 17} height={compact ? 15 : 17} />
      </button>
      {menuOpen && <div className="task-menu" role="menu">
        <button onClick={() => { dispatch({ type: 'startTask', taskId: task.id }); setMenuOpen(false); }}>Start</button>
        <button onClick={() => { dispatch({ type: 'resumeTask', taskId: task.id }); setMenuOpen(false); }}>Resume</button>
        <button onClick={() => { dispatch({ type: 'toggleUi', key: 'editingTaskId', value: task.id }); setMenuOpen(false); }}>Edit</button>
        {otherColumns.map(column => <button key={column.id} onClick={() => { dispatch({ type: 'moveTask', taskId: task.id, bucket: column.id }); setMenuOpen(false); }}>Move to {column.label}</button>)}
        <button className="danger" onClick={() => { dispatch({ type: 'deleteTask', taskId: task.id }); setMenuOpen(false); }}>Delete</button>
      </div>}
    </div>
  </article>;
}
