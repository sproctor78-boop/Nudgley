import { useState } from 'react';
import { useAppDispatch } from '../../app/providers/AppProviders';
import type { Task } from '../../domain/tasks/taskTypes';
import { TaskCard } from './TaskCard';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from '../../components/icons/Icons';
import { useColumnDropTarget } from './dragAndDrop';

export function CompactGroup({ columnId, label, tasks, removable = false }: { columnId: string; label: string; tasks: Task[]; removable?: boolean }) {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { isOver, onDragOver, onDragLeave, onDrop } = useColumnDropTarget(columnId);

  function removeColumn() {
    if (tasks.length && !window.confirm(`Remove "${label}"? Its ${tasks.length} task${tasks.length === 1 ? '' : 's'} will move to To Plan.`)) return;
    dispatch({ type: 'removeColumn', columnId });
  }

  return <section className={`compact-group bucket-${columnId} ${isOver ? 'drag-over' : ''}`} aria-labelledby={`col-${columnId}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
    <div className="compact-group-header">
      <button type="button" className="compact-group-toggle" onClick={() => setCollapsed(value => !value)} aria-expanded={!collapsed}>
        <span className="bucket-dot" aria-hidden="true" />
        <h2 id={`col-${columnId}`}>{label}</h2>
        <span className="count">{tasks.length}</span>
        {collapsed ? <ChevronRightIcon width={15} height={15} /> : <ChevronDownIcon width={15} height={15} />}
      </button>
      {removable && <button type="button" className="compact-group-remove" onClick={removeColumn} aria-label={`Remove ${label} column`}>
        <CloseIcon width={13} height={13} />
      </button>}
    </div>
    {!collapsed && <div className="task-list task-list--compact">
      {tasks.map(task => <TaskCard key={task.id} task={task} compact />)}
      {!tasks.length && <p className="empty-column empty-column--compact">Nothing planned.</p>}
    </div>}
  </section>;
}
