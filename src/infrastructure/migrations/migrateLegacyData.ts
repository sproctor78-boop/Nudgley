import { z } from 'zod';
import { toLocalDate } from '../../domain/dates/localDate';
import { type CompletedTask, type Task, TaskEnhancementSchema, TaskSchema, normaliseBucket } from '../../domain/tasks/taskTypes';
import type { AppMetadata, CoachingMemory, Settings, UserProfile } from '../../services/persistence/repositories';

const LegacyTaskSchema = z.object({
  id: z.coerce.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
  bucket: z.unknown().optional(),
  createdAt: z.unknown().optional(),
  dueDate: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  lastMovedAt: z.unknown().optional(),
  moveCount: z.number().optional(),
  status: z.string().optional(),
  completedAt: z.unknown().optional(),
  enhancement: TaskEnhancementSchema.optional()
}).passthrough();

function normaliseDateOnly(value: unknown, fallback: string): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) return toLocalDate(value);
  return fallback;
}

export function migrateLegacyTask(raw: unknown, now = new Date()): Task | null {
  const parsed = LegacyTaskSchema.safeParse(raw);
  if (!parsed.success) return null;
  const legacy = parsed.data;
  const today = toLocalDate(now);
  const title = (legacy.title ?? legacy.text ?? '').trim();
  if (!title) return null;
  const completedAt = typeof legacy.completedAt === 'string' ? legacy.completedAt : null;
  const status = completedAt ? 'completed' : legacy.status === 'in-progress' ? 'in-progress' : 'not-started';
  const task: Task = {
    id: legacy.id ?? `${Date.now()}${Math.random().toString(36).slice(2)}`,
    title,
    notes: legacy.notes ?? '',
    bucket: normaliseBucket(legacy.bucket),
    status,
    createdAt: normaliseDateOnly(legacy.createdAt, today),
    updatedAt: now.toISOString(),
    scheduledDate: legacy.scheduledDate ?? null,
    dueDate: legacy.dueDate ?? null,
    startedAt: null,
    lastWorkedAt: null,
    lastMovedAt: normaliseDateOnly(legacy.lastMovedAt, today),
    completedAt,
    moveCount: Math.max(0, legacy.moveCount ?? 0),
    carryOverCount: 0,
    enhancement: legacy.enhancement,
    schemaVersion: 1
  };
  return TaskSchema.safeParse(task).success ? task : null;
}

export function migrateLegacyTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(item => migrateLegacyTask(item)).filter((item): item is Task => Boolean(item));
}

export function migrateLegacyCompleted(raw: unknown): CompletedTask[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(item => migrateLegacyTask(item)).filter((item): item is Task => Boolean(item?.completedAt)).map(item => ({ ...item, status: 'completed', completedAt: item.completedAt ?? new Date().toISOString() }));
}

export function migrateUserProfile(raw: unknown): UserProfile {
  const obj = z.object({ name: z.string().optional(), tone: z.enum(['direct','balanced','supportive']).optional(), friction: z.string().optional(), energyPattern: z.string().optional(), setupComplete: z.boolean().optional() }).passthrough().safeParse(raw);
  return { schemaVersion: 1, name: obj.success ? obj.data.name : undefined, tone: obj.success ? obj.data.tone ?? 'balanced' : 'balanced', friction: obj.success ? obj.data.friction : undefined, energyPattern: obj.success ? obj.data.energyPattern : undefined, setupComplete: obj.success ? obj.data.setupComplete ?? false : false };
}

export function migrateCoachingMemory(raw: unknown): CoachingMemory {
  const obj = z.object({ insights: z.array(z.object({ text: z.string(), date: z.string().optional(), mode: z.string().optional() })).optional(), patterns: z.array(z.object({ text: z.string(), count: z.number().optional(), date: z.string().optional() })).optional(), lastUpdated: z.string().nullable().optional() }).passthrough().safeParse(raw);
  return { schemaVersion: 1, insights: obj.success ? (obj.data.insights ?? []).map((i: any, n: number) => ({ id: `insight_${n}_${i.date ?? Date.now()}`, text: i.text, date: i.date ?? new Date().toISOString(), mode: i.mode })) : [], patterns: obj.success ? (obj.data.patterns ?? []).map((p: any, n: number) => ({ id: `pattern_${n}_${p.date ?? Date.now()}`, text: p.text, count: p.count ?? 1, date: p.date ?? new Date().toISOString() })) : [], lastUpdated: obj.success ? obj.data.lastUpdated ?? null : null };
}

export function migrateSettings(triageMode: string | null, notifRaw: unknown): Settings {
  const notif = z.object({ frequency: z.enum(['off','low','medium','high']).optional(), morning: z.string().optional(), eod: z.string().optional(), enabled: z.boolean().optional() }).safeParse(notifRaw);
  return { schemaVersion: 1, triagePreference: triageMode === 'quickwins' || triageMode === 'frog' ? triageMode : 'balanced', notifications: { enabled: notif.success ? notif.data.enabled ?? false : false, frequency: notif.success ? notif.data.frequency ?? 'low' : 'low', morning: notif.success ? notif.data.morning ?? '09:00' : '09:00', eod: notif.success ? notif.data.eod ?? '17:30' : '17:30' } };
}

export function migrateMetadata(lastRollover: string | null, dismissedFocusDate: string | null): AppMetadata {
  return { schemaVersion: 1, lastRolloverDate: lastRollover, lastRolloverWeek: null, activeTaskId: null, dismissedFocusDate };
}
