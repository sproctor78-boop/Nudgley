export interface NudgeScheduler { schedule(options: { enabled: boolean; frequency: string; morning: string; eod: string }, notify: (message: string) => void): () => void; }
export class ForegroundNudgeScheduler implements NudgeScheduler {
  schedule(options: { enabled: boolean; frequency: string; morning: string; eod: string }, notify: (message: string) => void): () => void {
    if (!options.enabled || options.frequency === 'off') return () => undefined;
    const timers: number[] = [];
    const scheduleAt = (time: string, message: string) => {
      const [h, m] = time.split(':').map(Number);
      const target = new Date(); target.setHours(h || 0, m || 0, 0, 0);
      const delay = target.getTime() - Date.now();
      if (delay > 0) timers.push(window.setTimeout(() => notify(message), delay));
    };
    if (['medium', 'high'].includes(options.frequency)) scheduleAt(options.morning, 'Morning check-in: your board is ready.');
    scheduleAt(options.eod, 'End-of-day nudge: acknowledge what moved today.');
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }
}
