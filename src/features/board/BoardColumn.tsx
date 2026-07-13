import { bucketLabels, type Task, type TaskBucket } from '../../domain/tasks/taskTypes';
import { TaskCard } from './TaskCard';
import { useColumnDropTarget } from './dragAndDrop';

export function BoardColumn({ bucket, tasks, completedTodayCount = 0 }: { bucket: TaskBucket; tasks: Task[]; completedTodayCount?: number }) {
  const softLimit = bucket === 'now' ? 3 : bucket === 'today' ? 7 : null;
  const carried = bucket === 'today' ? tasks.filter(task => task.carryOverCount > 0) : [];
  const fresh = bucket === 'today' ? tasks.filter(task => task.carryOverCount === 0) : tasks;
  const { isOver, onDragOver, onDragLeave, onDrop } = useColumnDropTarget(bucket);

  return <section className={`board-column bucket-${bucket} ${isOver ? 'drag-over' : ''}`} aria-labelledby={`col-${bucket}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
    <header>
      <span className="bucket-dot" aria-hidden="true" />
      <h2 id={`col-${bucket}`}>{bucketLabels[bucket]}</h2>
      <span className="count">{tasks.length}</span>
    </header>
    {softLimit && tasks.length > softLimit && <p className="soft-limit">Already {tasks.length} in {bucketLabels[bucket]} — consider moving one out before adding more.</p>}

    {carried.length > 0 && <div className="carried-over-group">
      <span className="carried-over-label">Carried over</span>
      <div className="task-list">{carried.map(task => <TaskCard key={task.id} task={task} />)}</div>
    </div>}

    <div className="task-list">
      {fresh.map(task => <TaskCard key={task.id} task={task} />)}
      {!tasks.length && <p className="empty-column">Nothing here yet. Drag a card here.</p>}
    </div>
    {bucket === 'today' && completedTodayCount > 0 && <p className="completed-note">{completedTodayCount} completed today</p>}
  </section>;
}
