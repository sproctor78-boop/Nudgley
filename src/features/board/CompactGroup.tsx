import { useState } from 'react';
import { bucketLabels, type Task, type TaskBucket } from '../../domain/tasks/taskTypes';
import { TaskCard } from './TaskCard';
import { ChevronDownIcon, ChevronRightIcon } from '../../components/icons/Icons';

export function CompactGroup({ bucket, tasks }: { bucket: TaskBucket; tasks: Task[] }) {
  const [collapsed, setCollapsed] = useState(false);
  return <section className={`compact-group bucket-${bucket}`} aria-labelledby={`col-${bucket}`}>
    <button type="button" className="compact-group-header" onClick={() => setCollapsed(value => !value)} aria-expanded={!collapsed}>
      <span className="bucket-dot" aria-hidden="true" />
      <h2 id={`col-${bucket}`}>{bucketLabels[bucket]}</h2>
      <span className="count">{tasks.length}</span>
      {collapsed ? <ChevronRightIcon width={15} height={15} /> : <ChevronDownIcon width={15} height={15} />}
    </button>
    {!collapsed && <div className="task-list task-list--compact">
      {tasks.map(task => <TaskCard key={task.id} task={task} compact />)}
      {!tasks.length && <p className="empty-column empty-column--compact">Nothing planned.</p>}
    </div>}
  </section>;
}
