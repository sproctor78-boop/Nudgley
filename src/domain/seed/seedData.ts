import { addDays, toLocalDate } from '../dates/localDate';
import { createTask } from '../tasks/taskFactory';
import type { CompletedTask, Task } from '../tasks/taskTypes';

export function buildSeedTasks(now = new Date()): Task[] {
  const today = toLocalDate(now);
  const tomorrow = addDays(today, 1);
  const inThreeDays = addDays(today, 3);

  return [
    createTask({
      title: 'Reply to Sarah about the delivery plan',
      bucket: 'now',
      dueDate: today,
      estimateMinutes: 15,
      effort: 'low',
      enhancement: { startHere: 'Open the email thread and reply with the revised dates.', steps: [] }
    }, now),
    createTask({
      title: 'Book car air-conditioning regas',
      bucket: 'now',
      estimateMinutes: 15,
      effort: 'low'
    }, now),
    createTask({
      title: 'Review the implementation schedule',
      bucket: 'today',
      estimateMinutes: 45,
      effort: 'medium',
      enhancement: { startHere: 'Open the schedule and check this week’s milestones first.', steps: [] }
    }, now),
    (() => {
      const task = createTask({ title: 'Send updated RAID actions', bucket: 'today', estimateMinutes: 20, effort: 'low' }, now);
      return { ...task, carryOverCount: 1 };
    })(),
    createTask({
      title: 'Call nursery about September fees',
      bucket: 'today',
      dueDate: today,
      estimateMinutes: 10,
      effort: 'low'
    }, now),
    createTask({
      title: 'Prepare notes for the solution workshop with the infrastructure and data teams',
      bucket: 'tomorrow',
      scheduledDate: tomorrow,
      estimateMinutes: 40,
      effort: 'medium'
    }, now),
    createTask({
      title: 'Review the medical obsolescence proposal',
      bucket: 'tomorrow',
      scheduledDate: tomorrow,
      dueDate: tomorrow,
      estimateMinutes: 60,
      effort: 'high'
    }, now),
    createTask({
      title: 'Update the ChPP evidence log',
      bucket: 'week',
      estimateMinutes: 90,
      effort: 'high'
    }, now),
    createTask({
      title: 'Draft the operating model section',
      bucket: 'week',
      scheduledDate: inThreeDays,
      estimateMinutes: 120,
      effort: 'high'
    }, now),
    createTask({
      title: 'Review the Power BI dashboard',
      bucket: 'week',
      estimateMinutes: 30,
      effort: 'medium'
    }, now),
    createTask({
      title: 'Organise holiday documents',
      bucket: 'planned',
      estimateMinutes: 30,
      effort: 'low'
    }, now),
    createTask({
      title: 'Research training options',
      bucket: 'planned'
    }, now),
    createTask({
      title: 'Replace the printer setup',
      bucket: 'planned',
      dueDate: addDays(today, -6),
      estimateMinutes: 20,
      effort: 'low'
    }, now)
  ];
}

export function buildSeedCompleted(now = new Date()): CompletedTask[] {
  const task = createTask({ title: 'Confirmed venue for the team offsite', bucket: 'today', estimateMinutes: 20, effort: 'low' }, now);
  return [{ ...task, status: 'completed', completedAt: now.toISOString() }];
}
