import { useAppDispatch } from '../../app/providers/AppProviders';
import { bucketLabels, taskBuckets, type Task } from '../../domain/tasks/taskTypes';
import { presentationStatus } from '../../domain/tasks/taskRules';

export function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const status = presentationStatus(task);
  return <article className={`task-card bucket-${task.bucket}`}>
    <button className="complete-control" onClick={() => dispatch({ type: 'completeTask', taskId: task.id })} aria-label={`Complete ${task.title}`}>✓</button>
    <div className="task-main">
      <h3>{task.title}</h3>
      {task.enhancement?.startHere && <div className="next-action"><span>Next action</span><strong>{task.enhancement.startHere}</strong></div>}
      {status && <p className={`status-chip tone-${status.tone}`}>{status.label}</p>}
      {task.dueDate && <p className="meta">Due {task.dueDate}</p>}
    </div>
    <details className="task-admin">
      <summary aria-label={`Task options for ${task.title}`}>⋯</summary>
      <div className="task-menu">
        <button onClick={() => dispatch({ type: 'startTask', taskId: task.id })}>Start</button>
        <button onClick={() => dispatch({ type: 'resumeTask', taskId: task.id })}>Resume</button>
        {taskBuckets.filter(bucket => bucket !== task.bucket).map(bucket => <button key={bucket} onClick={() => dispatch({ type: 'moveTask', taskId: task.id, bucket })}>Move to {bucketLabels[bucket]}</button>)}
        <button className="danger" onClick={() => dispatch({ type: 'deleteTask', taskId: task.id })}>Delete</button>
      </div>
    </details>
  </article>;
}
