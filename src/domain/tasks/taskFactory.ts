import { toLocalDate } from '../dates/localDate';
import type { Task, TaskBucket, TaskEnhancement } from './taskTypes';

export interface CreateTaskInput {
  title: string;
  notes?: string;
  bucket?: TaskBucket;
  dueDate?: string | null;
  scheduledDate?: string | null;
  estimateMinutes?: number | null;
  effort?: 'low' | 'medium' | 'high' | null;
  enhancement?: TaskEnhancement;
}

export function createTask(input: CreateTaskInput, now = new Date()): Task {
  const localDate = toLocalDate(now);
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}${Math.random().toString(36).slice(2)}`,
    title: input.title.trim(),
    notes: input.notes?.trim() || '',
    bucket: input.bucket ?? 'today',
    status: 'not-started',
    createdAt: localDate,
    updatedAt: now.toISOString(),
    scheduledDate: input.scheduledDate ?? null,
    dueDate: input.dueDate ?? null,
    startedAt: null,
    lastWorkedAt: null,
    lastMovedAt: localDate,
    completedAt: null,
    moveCount: 0,
    carryOverCount: 0,
    estimateMinutes: input.estimateMinutes ?? null,
    effort: input.effort ?? null,
    enhancement: input.enhancement,
    schemaVersion: 1
  };
}
