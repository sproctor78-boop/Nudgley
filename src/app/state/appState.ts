import { completeTask as completeTaskRule, moveTask as moveTaskRule, resumeTask, startTask as startTaskRule } from '../../domain/tasks/taskRules';
import type { CompletedTask, Task } from '../../domain/tasks/taskTypes';
import type { AppMetadata, CoachingMemory, Settings, UserProfile } from '../../services/persistence/repositories';
import type { CarryOverItem } from '../../domain/scheduling/rollover';
import type { ColumnDef } from '../../domain/columns/columnTypes';

export interface AppState {
  tasks: Task[];
  completed: CompletedTask[];
  profile: UserProfile;
  memory: CoachingMemory;
  settings: Settings;
  metadata: AppMetadata;
  carryOver: CarryOverItem[];
  ui: { coachOpen: boolean; timerOpen: boolean; settingsOpen: boolean; changeSuggestionOpen: boolean; captureOpen: boolean; captureListening: boolean; announcement: string; activeTaskId: string | null; editingTaskId: string | null; };
}

export type AppAction =
  | { type: 'hydrate'; state: Omit<AppState, 'ui'> & { ui?: Partial<AppState['ui']> } }
  | { type: 'addTask'; task: Task }
  | { type: 'updateTask'; task: Task }
  | { type: 'moveTask'; taskId: string; bucket: string }
  | { type: 'startTask'; taskId: string }
  | { type: 'resumeTask'; taskId: string }
  | { type: 'completeTask'; taskId: string }
  | { type: 'deleteTask'; taskId: string }
  | { type: 'setTasks'; tasks: Task[] }
  | { type: 'setCarryOver'; carryOver: CarryOverItem[] }
  | { type: 'applyCarryOver'; taskId: string; action: 'keep-today' | 'move-week' | 'plan-later' | 'resume' | 'break-down' | 'drop' }
  | { type: 'saveSettings'; settings: Settings }
  | { type: 'saveProfile'; profile: UserProfile }
  | { type: 'saveMetadata'; metadata: AppMetadata }
  | { type: 'addColumn'; column: ColumnDef }
  | { type: 'removeColumn'; columnId: string }
  | { type: 'toggleUi'; key: keyof AppState['ui']; value?: boolean | string | null };

export const emptyUi: AppState['ui'] = { coachOpen: false, timerOpen: false, settingsOpen: false, changeSuggestionOpen: false, captureOpen: false, captureListening: false, announcement: '', activeTaskId: null, editingTaskId: null };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'hydrate': return { ...action.state, ui: { ...emptyUi, ...action.state.ui } };
    case 'addTask': return { ...state, tasks: [...state.tasks, action.task], ui: { ...state.ui, announcement: `Added ${action.task.title}` } };
    case 'updateTask': return { ...state, tasks: state.tasks.map(task => task.id === action.task.id ? action.task : task) };
    case 'moveTask': return { ...state, tasks: state.tasks.map(task => task.id === action.taskId ? moveTaskRule(task, action.bucket) : task), ui: { ...state.ui, announcement: 'Task moved' } };
    case 'startTask': return { ...state, tasks: state.tasks.map(task => task.id === action.taskId ? startTaskRule(task) : task), metadata: { ...state.metadata, activeTaskId: action.taskId }, ui: { ...state.ui, activeTaskId: action.taskId, announcement: 'Task started' } };
    case 'resumeTask': return { ...state, tasks: state.tasks.map(task => task.id === action.taskId ? resumeTask(task) : task), metadata: { ...state.metadata, activeTaskId: action.taskId }, ui: { ...state.ui, activeTaskId: action.taskId, announcement: 'Task resumed' } };
    case 'completeTask': {
      const task = state.tasks.find(item => item.id === action.taskId);
      if (!task) return state;
      const completed = completeTaskRule(task) as CompletedTask;
      return { ...state, tasks: state.tasks.filter(item => item.id !== action.taskId), completed: [completed, ...state.completed].slice(0, 250), metadata: { ...state.metadata, activeTaskId: state.metadata.activeTaskId === action.taskId ? null : state.metadata.activeTaskId }, ui: { ...state.ui, activeTaskId: state.ui.activeTaskId === action.taskId ? null : state.ui.activeTaskId, announcement: `Completed ${task.title}` } };
    }
    case 'deleteTask': return { ...state, tasks: state.tasks.filter(task => task.id !== action.taskId), ui: { ...state.ui, announcement: 'Task removed' } };
    case 'setTasks': return { ...state, tasks: action.tasks };
    case 'setCarryOver': return { ...state, carryOver: action.carryOver };
    case 'applyCarryOver': {
      const task = state.tasks.find(item => item.id === action.taskId);
      if (!task) return state;
      let updated: Task | null = { ...task, carryOverCount: task.carryOverCount + 1, updatedAt: new Date().toISOString() };
      if (action.action === 'move-week') updated = moveTaskRule(updated, 'week');
      if (action.action === 'plan-later') updated = moveTaskRule(updated, 'planned');
      if (action.action === 'resume') updated = resumeTask(updated);
      if (action.action === 'break-down') updated = { ...updated, notes: `${updated.notes ?? ''}\nNeeds breakdown.`.trim() };
      if (action.action === 'drop') updated = null;
      return { ...state, tasks: updated ? state.tasks.map(item => item.id === action.taskId ? updated : item) : state.tasks.filter(item => item.id !== action.taskId), carryOver: state.carryOver.filter(item => item.taskId !== action.taskId), ui: { ...state.ui, announcement: 'Carry-over updated' } };
    }
    case 'saveSettings': return { ...state, settings: action.settings };
    case 'saveProfile': return { ...state, profile: action.profile };
    case 'saveMetadata': return { ...state, metadata: action.metadata };
    case 'addColumn': return { ...state, metadata: { ...state.metadata, customColumns: [...(state.metadata.customColumns ?? []), action.column] }, ui: { ...state.ui, announcement: `Added column ${action.column.label}` } };
    case 'removeColumn': return {
      ...state,
      tasks: state.tasks.map(task => task.bucket === action.columnId ? moveTaskRule(task, 'planned') : task),
      metadata: { ...state.metadata, customColumns: (state.metadata.customColumns ?? []).filter(column => column.id !== action.columnId) },
      ui: { ...state.ui, announcement: 'Column removed' }
    };
    case 'toggleUi': return { ...state, ui: { ...state.ui, [action.key]: action.value ?? !state.ui[action.key] } } as AppState;
    default: return state;
  }
}
