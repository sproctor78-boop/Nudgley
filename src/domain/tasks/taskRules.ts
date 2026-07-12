import { compareLocalDates, daysBetween, toLocalDate } from '../dates/localDate';
import type { Task, TaskBucket } from './taskTypes';

export type DeadlineState = 'overdue' | 'due-today' | 'due-soon' | 'none';
export interface PresentationStatus { label: string; tone: 'danger' | 'warning' | 'neutral' | 'success'; reason: DeadlineState | 'needs-decision' | 'resume' | 'breakdown' | 'waiting' | 'none'; }

export function deadlineState(task: Task, today = toLocalDate()): DeadlineState {
  if (!task.dueDate) return 'none';
  const diff = daysBetween(today, task.dueDate);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'due-today';
  if (diff <= 2) return 'due-soon';
  return 'none';
}

export function presentationStatus(task: Task, today = toLocalDate()): PresentationStatus | null {
  const deadline = deadlineState(task, today);
  if (deadline === 'overdue') return { label: 'Due date passed', tone: 'danger', reason: 'overdue' };
  if (deadline === 'due-today') return { label: 'Due today', tone: 'warning', reason: 'due-today' };
  if (deadline === 'due-soon') return { label: 'Due soon', tone: 'warning', reason: 'due-soon' };
  if (task.status === 'in-progress') return { label: 'Ready to resume', tone: 'success', reason: 'resume' };
  if (task.carryOverCount > 0 && ['today', 'week'].includes(task.bucket)) return { label: 'Needs a decision', tone: 'neutral', reason: 'needs-decision' };
  if (task.enhancement?.startHere) return { label: 'Next action available', tone: 'neutral', reason: 'none' };
  return null;
}

export function moveTask(task: Task, bucket: TaskBucket, now = new Date()): Task {
  return { ...task, bucket, moveCount: task.moveCount + 1, lastMovedAt: toLocalDate(now), updatedAt: now.toISOString() };
}

export function startTask(task: Task, now = new Date()): Task {
  const iso = now.toISOString();
  return { ...task, status: 'in-progress', startedAt: task.startedAt ?? iso, lastWorkedAt: iso, updatedAt: iso };
}

export function resumeTask(task: Task, now = new Date()): Task {
  const iso = now.toISOString();
  return { ...task, status: 'in-progress', startedAt: task.startedAt ?? iso, lastWorkedAt: iso, updatedAt: iso };
}

export function completeTask(task: Task, now = new Date()): Task {
  const iso = now.toISOString();
  return { ...task, status: 'completed', completedAt: iso, updatedAt: iso };
}

export function isTaskDueForTomorrowRollover(task: Task, today = toLocalDate()): boolean {
  return task.bucket === 'tomorrow' && (!task.scheduledDate || compareLocalDates(task.scheduledDate, today) <= 0);
}
