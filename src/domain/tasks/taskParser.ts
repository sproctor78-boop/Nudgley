import type { TaskBucket } from './taskTypes';

const temporalMarkers: Record<TaskBucket, string[]> = {
  now: ['immediate','urgent','asap','right now','critical','do now','do first'],
  today: ['today','this morning','this afternoon','tonight','by eod','by end of day'],
  tomorrow: ['tomorrow','next day','by tomorrow'],
  week: ['this week','by friday','by thursday','by wednesday','later this week','next few days'],
  planned: ['next week','next month','someday','eventually','to plan','later','backlog']
};

export interface DraftTask { id: string; title: string; bucket: TaskBucket; confidence: number; included: boolean; }

export function preprocessTaskInput(rawText: string): string {
  return rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export function detectTaskBoundaries(text: string): string[] {
  if (/\n/.test(text)) {
    const parts = text.split(/\n+/).map(s => s.trim()).filter(s => s.length > 3);
    if (parts.length > 1) return parts;
  }
  const verbalSep = /\s+(?:and then|after that|additionally|next up)\s+/gi;
  if (verbalSep.test(text)) {
    const parts = text.split(verbalSep).map(s => s.trim()).filter(s => s.length > 3);
    if (parts.length > 1) return parts;
  }
  return text ? [text] : [];
}

export function inferBucket(text: string): { bucket: TaskBucket; confidence: number } {
  const lower = text.toLowerCase();
  for (const [bucket, markers] of Object.entries(temporalMarkers) as Array<[TaskBucket, string[]]>) {
    if (markers.some(marker => lower.includes(marker))) return { bucket, confidence: 0.85 };
  }
  if (/\bweek\b/i.test(lower)) return { bucket: 'week', confidence: 0.8 };
  if (/\bplan\b/i.test(lower) && !/plan\s+my|plan\s+a/i.test(lower)) return { bucket: 'planned', confidence: 0.75 };
  return { bucket: 'today', confidence: lower.split(/\s+/).length <= 5 ? 0.7 : 0.6 };
}

export function extractDraftTasks(rawText: string): DraftTask[] {
  const cleaned = preprocessTaskInput(rawText);
  return detectTaskBoundaries(cleaned).map((raw, index) => {
    const title = raw.replace(/^(and|also|then|plus|i need to|i want to|i should|we need to|we should)\s+/i, '').replace(/^[-•*\d.]+\s*/, '').trim();
    const normalised = title.charAt(0).toUpperCase() + title.slice(1);
    const inferred = inferBucket(title);
    return { id: `draft_${Date.now()}_${index}`, title: normalised, bucket: inferred.bucket, confidence: inferred.confidence, included: true };
  }).filter(task => task.title.length > 2);
}
