import { describe, expect, it } from 'vitest';
import { migrateLegacyCompleted, migrateLegacyTasks } from '../infrastructure/migrations/migrateLegacyData';

describe('legacy data migration', () => {
  it('migrates existing stored tasks and immediate bucket values', () => {
    const [task] = migrateLegacyTasks([{ id: '1', text: 'Legacy task', bucket: 'immediate', createdAt: '2026-07-10', enhancement: { startHere: 'Open workspace', steps: ['Open workspace'] } }]);
    expect(task.bucket).toBe('now');
    expect(task.title).toBe('Legacy task');
    expect(task.enhancement?.startHere).toBe('Open workspace');
  });

  it('keeps completion history intact', () => {
    const [task] = migrateLegacyCompleted([{ id: '2', text: 'Finished', bucket: 'today', completedAt: '2026-07-11T12:00:00Z' }]);
    expect(task.status).toBe('completed');
    expect(task.completedAt).toBe('2026-07-11T12:00:00Z');
  });

  it('drops corrupt tasks safely', () => {
    expect(migrateLegacyTasks([{ bucket: 'today' }, null, 'bad'])).toEqual([]);
  });
});
