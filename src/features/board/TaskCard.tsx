import { useAppDispatch } from '../../app/providers/AppProviders';
import { bucketLabels, taskBuckets, type Task } from '../../domain/tasks/taskTypes';
import { presentationStatus, taskMeta } from '../../domain/tasks/taskRules';
import { CheckIcon, MoreIcon } from '../../components/icons/Icons';

function formatDue(dueDate: string): string {
  const [, m, d] = dueDate.split('-').map(Number);
  return new Date(2000, (m || 1) - 1, d || 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  const dispatch = useAppDispatch();
  const status = presentationStatus(task);
  const meta = taskMeta(task);
  return <article className={`task-card bucket-${task.bucket} ${compact ? 'task-card--compact' : ''}`}>
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
    <details className="task-admin">
      <summary aria-label={`Task options for ${task.title}`}><MoreIcon width={compact ? 15 : 17} height={compact ? 15 : 17} /></summary>
      <div className="task-menu">
        <button onClick={() => dispatch({ type: 'startTask', taskId: task.id })}>Start</button>
        <button onClick={() => dispatch({ type: 'resumeTask', taskId: task.id })}>Resume</button>
        {taskBuckets.filter(bucket => bucket !== task.bucket).map(bucket => <button key={bucket} onClick={() => dispatch({ type: 'moveTask', taskId: task.id, bucket })}>Move to {bucketLabels[bucket]}</button>)}
        <button className="danger" onClick={() => dispatch({ type: 'deleteTask', taskId: task.id })}>Delete</button>
      </div>
    </details>
  </article>;
}
