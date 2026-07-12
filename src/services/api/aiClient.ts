import { z } from 'zod';
import type { Task } from '../../domain/tasks/taskTypes';
import type { DraftTask } from '../../domain/tasks/taskParser';

export type AiOperation = 'enhance-task' | 'parse-dictation' | 'recommend-task' | 'plan-day' | 'weekly-review' | 'coaching-session';

export const EnhancementResultSchema = z.object({ refined: z.string(), steps: z.array(z.string()).default([]), startHere: z.string(), effort: z.string().optional() });
export type EnhancementResult = z.infer<typeof EnhancementResultSchema>;

export interface AiClient { enhanceTask(title: string, notes?: string): Promise<EnhancementResult>; parseDictation(text: string): Promise<DraftTask[]>; }

export class HttpAiClient implements AiClient {
  constructor(private readonly endpoint = '/api/nudge') {}
  async enhanceTask(title: string, notes?: string): Promise<EnhancementResult> {
    const res = await fetch(this.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operation: 'enhance-task', input: { title, notes } }) });
    if (!res.ok) throw new Error('AI enhancement unavailable');
    const data: unknown = await res.json();
    return EnhancementResultSchema.parse(data);
  }
  async parseDictation(text: string): Promise<DraftTask[]> {
    const res = await fetch(this.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operation: 'parse-dictation', input: { text } }) });
    if (!res.ok) throw new Error('AI parsing unavailable');
    const data = await res.json() as { tasks?: DraftTask[] };
    return Array.isArray(data.tasks) ? data.tasks : [];
  }
}

export class FallbackAiClient implements AiClient {
  async enhanceTask(title: string): Promise<EnhancementResult> { return { refined: title.charAt(0).toUpperCase() + title.slice(1), steps: ['Open the relevant tool or document', 'Complete the core action', 'Review and save or send'], startHere: 'Open the relevant tool or document', effort: '30m' }; }
  async parseDictation(): Promise<DraftTask[]> { return []; }
}

export function selectTaskContext(tasks: Task[]): Array<Pick<Task, 'id' | 'title' | 'bucket' | 'status' | 'dueDate' | 'enhancement'>> {
  return tasks.map(({ id, title, bucket, status, dueDate, enhancement }) => ({ id, title, bucket, status, dueDate, enhancement }));
}
