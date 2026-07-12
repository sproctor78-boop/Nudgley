import { useMemo } from 'react';
import { useAppState } from '../../app/providers/AppProviders';
import { toLocalDate } from '../../domain/dates/localDate';
import { BoardColumn } from './BoardColumn';
import { CompactGroup } from './CompactGroup';
import { StaleReviewBanner } from '../carry-over/StaleReviewBanner';

const secondaryBuckets = ['tomorrow', 'week', 'planned'] as const;

export function Board() {
  const { tasks, completed } = useAppState();
  const today = toLocalDate();
  const completedTodayCount = useMemo(() => completed.filter(task => task.completedAt.slice(0, 10) === today).length, [completed, today]);

  return <main className="board" aria-label="Task board">
    <StaleReviewBanner />
    <div className="board-grid">
      <div className="board-primary">
        <BoardColumn bucket="now" tasks={tasks.filter(task => task.bucket === 'now')} />
        <BoardColumn bucket="today" tasks={tasks.filter(task => task.bucket === 'today')} completedTodayCount={completedTodayCount} />
      </div>
      <div className="board-secondary">
        {secondaryBuckets.map(bucket => <CompactGroup key={bucket} bucket={bucket} tasks={tasks.filter(task => task.bucket === bucket)} />)}
      </div>
    </div>
  </main>;
}
