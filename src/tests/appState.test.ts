import { describe, expect, it } from 'vitest';
import { appReducer, emptyUi, type AppState } from '../app/state/appState';
import { createTask } from '../domain/tasks/taskFactory';

const baseState: AppState = { tasks: [], completed: [], profile: { schemaVersion: 1, tone: 'balanced', setupComplete: false }, memory: { schemaVersion: 1, insights: [], patterns: [] }, settings: { schemaVersion: 1, triagePreference: 'balanced', notifications: { enabled: false, frequency: 'low', morning: '09:00', eod: '17:30' } }, metadata: { schemaVersion: 1 }, carryOver: [], ui: emptyUi };

describe('app state actions', () => {
  it('starting a task sets active focus', () => {
    const task = createTask({ title: 'Focus task', bucket: 'now' });
    const state = appReducer({ ...baseState, tasks: [task] }, { type: 'startTask', taskId: task.id });
    expect(state.tasks[0].status).toBe('in-progress');
    expect(state.metadata.activeTaskId).toBe(task.id);
  });

  it('completion removes active focus and archives task', () => {
    const task = createTask({ title: 'Complete me', bucket: 'now' });
    const state = appReducer({ ...baseState, tasks: [task], metadata: { schemaVersion: 1, activeTaskId: task.id }, ui: { ...emptyUi, activeTaskId: task.id } }, { type: 'completeTask', taskId: task.id });
    expect(state.tasks).toHaveLength(0);
    expect(state.completed[0].title).toBe('Complete me');
    expect(state.metadata.activeTaskId).toBeNull();
  });
});
