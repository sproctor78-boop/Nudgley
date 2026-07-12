import { useAppState } from '../../app/providers/AppProviders';
import { taskBuckets } from '../../domain/tasks/taskTypes';
import { BoardColumn } from './BoardColumn';

export function Board() {
  const { tasks } = useAppState();
  return <main className="board" aria-label="Task board">
    {taskBuckets.map(bucket => <BoardColumn key={bucket} bucket={bucket} tasks={tasks.filter(task => task.bucket === bucket)} />)}
  </main>;
}
