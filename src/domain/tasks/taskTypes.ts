import { z } from 'zod';

export const taskBuckets = ['now', 'today', 'tomorrow', 'week', 'planned'] as const;
export type TaskBucket = (typeof taskBuckets)[number];
export type LegacyTaskBucket = TaskBucket | 'immediate';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export const TaskEnhancementSchema = z.object({
  refined: z.string().optional(),
  steps: z.array(z.string()).default([]),
  startHere: z.string().optional(),
  effort: z.string().optional(),
  storedAt: z.string().optional()
});
export type TaskEnhancement = z.infer<typeof TaskEnhancementSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  notes: z.string().optional(),
  bucket: z.enum(taskBuckets),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  createdAt: z.string(),
  updatedAt: z.string(),
  scheduledDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  lastWorkedAt: z.string().nullable().optional(),
  lastMovedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  moveCount: z.number().int().nonnegative(),
  carryOverCount: z.number().int().nonnegative(),
  enhancement: TaskEnhancementSchema.optional(),
  schemaVersion: z.number().int().positive()
});
export type Task = z.infer<typeof TaskSchema>;

export const CompletedTaskSchema = TaskSchema.extend({
  completedAt: z.string()
});
export type CompletedTask = z.infer<typeof CompletedTaskSchema>;

export const bucketLabels: Record<TaskBucket, string> = {
  now: 'Now',
  today: 'Today',
  tomorrow: 'Tomorrow',
  week: 'This Week',
  planned: 'To Plan'
};

export const bucketStorageAliases: Record<string, TaskBucket> = {
  immediate: 'now',
  now: 'now',
  today: 'today',
  tomorrow: 'tomorrow',
  week: 'week',
  planned: 'planned'
};

export function normaliseBucket(bucket: unknown): TaskBucket {
  return bucketStorageAliases[String(bucket ?? '').toLowerCase()] ?? 'today';
}
