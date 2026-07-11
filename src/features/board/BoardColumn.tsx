import { bucketLabels, type Task, type TaskBucket } from '../../domain/tasks/taskTypes';
import { TaskCard } from './TaskCard';

export function BoardColumn({ bucket, tasks }: { bucket: TaskBucket; tasks: Task[] }) {
  const softLimit = bucket === 'now' ? 3 : bucket === 'today' ? 7 : null;
  return <section className={`board-column bucket-${bucket}`} aria-labelledby={`col-${bucket}`}>
    <header><span className="bucket-dot" aria-hidden="true"/><h2 id={`col-${bucket}`}>{bucketLabels[bucket]}</h2><span className="count">{tasks.length}</span></header>
    {softLimit && tasks.length > softLimit && <p className="soft-limit">There are already {tasks.length} tasks in {bucketLabels[bucket]}. Consider moving one out before adding another.</p>}
    <div className="task-list">{tasks.map(task => <TaskCard key={task.id} task={task} />)}{!tasks.length && <div className="empty-drop">Drop or move tasks here</div>}</div>
  </section>;
}
