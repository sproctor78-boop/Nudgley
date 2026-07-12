import { daysBetween, toLocalDate } from '../dates/localDate';
import type { Task } from '../tasks/taskTypes';
import { deadlineState } from '../tasks/taskRules';

export type TriagePreference = 'balanced' | 'quickwins' | 'frog';
export interface Recommendation { task: Task; reason: string; nextAction?: string; }

export function recommendTask(tasks: Task[], preference: TriagePreference = 'balanced', today = toLocalDate()): Recommendation | null {
  const open = tasks.filter(task => task.status !== 'completed');
  if (!open.length) return null;
  const inProgress = open.find(task => task.status === 'in-progress');
  if (inProgress) return { task: inProgress, reason: 'Ready to resume', nextAction: inProgress.enhancement?.startHere };
  const overdue = open.find(task => deadlineState(task, today) === 'overdue');
  if (overdue) return { task: overdue, reason: 'Due date passed', nextAction: overdue.enhancement?.startHere };
  const dueSoon = open.find(task => ['due-today', 'due-soon'].includes(deadlineState(task, today)));
  if (dueSoon) return { task: dueSoon, reason: 'Deadline coming up', nextAction: dueSoon.enhancement?.startHere };
  const candidates = open.filter(task => ['now', 'today'].includes(task.bucket));
  const pool = candidates.length ? candidates : open.filter(task => task.bucket === 'week');
  if (!pool.length) return null;
  if (preference === 'quickwins') {
    const quick = [...pool].sort((a, b) => a.title.length - b.title.length)[0];
    return { task: quick, reason: 'Smallest clear next step', nextAction: quick.enhancement?.startHere };
  }
  if (preference === 'frog') {
    const needsDecision = [...pool].sort((a, b) => b.carryOverCount - a.carryOverCount || daysBetween(b.createdAt, today) - daysBetween(a.createdAt, today))[0];
    return { task: needsDecision, reason: needsDecision.carryOverCount ? 'Needs a decision' : 'Meaningful work item', nextAction: needsDecision.enhancement?.startHere };
  }
  const nowTask = pool.find(task => task.bucket === 'now');
  if (nowTask) return { task: nowTask, reason: 'In Now', nextAction: nowTask.enhancement?.startHere };
  return { task: pool[0], reason: pool[0].enhancement?.startHere ? 'Clear next action' : 'Planned for today', nextAction: pool[0].enhancement?.startHere };
}
