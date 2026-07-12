import { describe, expect, it } from 'vitest';
import { createTask } from '../domain/tasks/taskFactory';
import { completeTask, deadlineState, resumeTask, startTask } from '../domain/tasks/taskRules';
import { runRollover } from '../domain/scheduling/rollover';
import { recommendTask } from '../domain/recommendations/recommendTasks';
import { computeStaleTasks } from '../domain/scheduling/staleReview';

const now = new Date('2026-07-11T09:00:00');

describe('time and status rules', () => {
  it('does not make Today tasks overdue without a passed due date', () => {
    const task = createTask({ title: 'Write update', bucket: 'today' }, now);
    expect(deadlineState(task, '2026-07-12')).toBe('none');
  });

  it('marks tasks overdue only when real due date passed', () => {
    const task = createTask({ title: 'Submit return', bucket: 'today', dueDate: '2026-07-10' }, now);
    expect(deadlineState(task, '2026-07-11')).toBe('overdue');
  });

  it('rolls Tomorrow tasks into Today on the local date boundary', () => {
    const task = createTask({ title: 'Prepare agenda', bucket: 'tomorrow', scheduledDate: '2026-07-12' }, now);
    const result = runRollover([task], { lastRolloverDate: '2026-07-11', lastRolloverWeek: '2026-07-06' }, new Date('2026-07-12T08:00:00'));
    expect(result.tasks[0].bucket).toBe('today');
    expect(result.movedTomorrowCount).toBe(1);
  });

  it('puts unfinished Today tasks into carry-over review', () => {
    const task = createTask({ title: 'Review draft', bucket: 'today' }, now);
    const result = runRollover([task], { lastRolloverDate: '2026-07-10', lastRolloverWeek: '2026-07-06' }, now);
    expect(result.carryOver).toEqual([{ taskId: task.id, reason: 'unfinished-today' }]);
  });

  it('leaves To Plan unchanged during rollover', () => {
    const task = createTask({ title: 'Someday research', bucket: 'planned' }, now);
    const result = runRollover([task], { lastRolloverDate: '2026-07-10', lastRolloverWeek: '2026-07-06' }, now);
    expect(result.tasks[0].bucket).toBe('planned');
  });

  it('preserves startedAt when resuming', () => {
    const started = startTask(createTask({ title: 'Build model', bucket: 'now' }, now), now);
    const resumed = resumeTask(started, new Date('2026-07-11T11:00:00'));
    expect(resumed.startedAt).toBe(started.startedAt);
    expect(resumed.lastWorkedAt).not.toBe(started.lastWorkedAt);
  });

  it('does not recommend completed tasks', () => {
    const task = completeTask(createTask({ title: 'Done thing', bucket: 'now' }, now), now);
    expect(recommendTask([task])).toBeNull();
  });

  it('moves a This Week task into Today once its scheduled date arrives', () => {
    const task = createTask({ title: 'Draft section', bucket: 'week', scheduledDate: '2026-07-11' }, now);
    const result = runRollover([task], { lastRolloverDate: '2026-07-10', lastRolloverWeek: '2026-07-06' }, now);
    expect(result.tasks[0].bucket).toBe('today');
  });

  it('moves a This Week task into Tomorrow the day before it is scheduled', () => {
    const task = createTask({ title: 'Draft section', bucket: 'week', scheduledDate: '2026-07-12' }, now);
    const result = runRollover([task], { lastRolloverDate: '2026-07-10', lastRolloverWeek: '2026-07-06' }, now);
    expect(result.tasks[0].bucket).toBe('tomorrow');
  });

  it('flags a task as stale once its due date is several days past, but not a task overdue by one day', () => {
    const fresh = createTask({ title: 'Just missed it', bucket: 'planned', dueDate: '2026-07-10' }, now);
    const stale = createTask({ title: 'Forgotten task', bucket: 'planned', dueDate: '2026-07-05' }, now);
    const results = computeStaleTasks([fresh, stale], '2026-07-11');
    expect(results.map(task => task.id)).toEqual([stale.id]);
  });
});
