import { daysBetween, toLocalDate } from '../dates/localDate';
import type { Task } from '../tasks/taskTypes';

export const STALE_THRESHOLD_DAYS = 3;

export function isStaleTask(task: Task, today = toLocalDate(), thresholdDays = STALE_THRESHOLD_DAYS): boolean {
  if (task.status === 'completed' || !task.dueDate) return false;
  return daysBetween(task.dueDate, today) >= thresholdDays;
}

export function computeStaleTasks(tasks: Task[], today = toLocalDate(), thresholdDays = STALE_THRESHOLD_DAYS): Task[] {
  return tasks.filter(task => isStaleTask(task, today, thresholdDays));
}
