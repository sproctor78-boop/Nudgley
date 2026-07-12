import { compareLocalDates, startOfWeek, toLocalDate } from '../dates/localDate';
import type { Task } from '../tasks/taskTypes';
import { isTaskDueForTomorrowRollover } from '../tasks/taskRules';

export interface CarryOverItem { taskId: string; reason: 'unfinished-today' | 'unfinished-week'; }
export interface RolloverResult { tasks: Task[]; carryOver: CarryOverItem[]; metadata: { lastRolloverDate: string; lastRolloverWeek: string }; movedTomorrowCount: number; }
export interface RolloverMetadata { lastRolloverDate?: string | null; lastRolloverWeek?: string | null; }

export function runRollover(tasks: Task[], metadata: RolloverMetadata, now = new Date()): RolloverResult {
  const today = toLocalDate(now);
  const thisWeek = startOfWeek(today);
  const shouldRunDay = metadata.lastRolloverDate !== today;
  const shouldRunWeek = metadata.lastRolloverWeek !== thisWeek;
  const carryOver: CarryOverItem[] = [];
  let movedTomorrowCount = 0;

  const nextTasks = tasks.map(task => {
    if (shouldRunDay && isTaskDueForTomorrowRollover(task, today)) {
      movedTomorrowCount += 1;
      return { ...task, bucket: 'today' as const, scheduledDate: today, lastMovedAt: today, updatedAt: now.toISOString() };
    }
    if (shouldRunDay && task.bucket === 'today' && task.status !== 'completed') {
      carryOver.push({ taskId: task.id, reason: 'unfinished-today' });
    }
    if (shouldRunWeek && task.bucket === 'week' && task.status !== 'completed') {
      carryOver.push({ taskId: task.id, reason: 'unfinished-week' });
    }
    return task;
  });

  return { tasks: nextTasks, carryOver, movedTomorrowCount, metadata: { lastRolloverDate: today, lastRolloverWeek: thisWeek } };
}

export function hasDatePassed(date: string, today = toLocalDate()): boolean {
  return compareLocalDates(date, today) < 0;
}
