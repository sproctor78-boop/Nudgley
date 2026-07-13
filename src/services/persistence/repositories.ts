import type { CompletedTask, Task } from '../../domain/tasks/taskTypes';
import type { TriagePreference } from '../../domain/recommendations/recommendTasks';
import type { ColumnDef } from '../../domain/columns/columnTypes';

export interface UserProfile { schemaVersion: number; name?: string; tone: 'direct' | 'balanced' | 'supportive'; friction?: string; energyPattern?: string; setupComplete: boolean; }
export interface CoachingMemory { schemaVersion: number; insights: Array<{ id: string; text: string; date: string; mode?: string }>; patterns: Array<{ id: string; text: string; count: number; date: string }>; lastUpdated?: string | null; }
export interface Settings { schemaVersion: number; triagePreference: TriagePreference; notifications: { enabled: boolean; frequency: 'off' | 'low' | 'medium' | 'high'; morning: string; eod: string; }; }
export interface AppMetadata { schemaVersion: number; lastRolloverDate?: string | null; lastRolloverWeek?: string | null; activeTaskId?: string | null; dismissedFocusDate?: string | null; customColumns?: ColumnDef[]; }

export interface TaskRepository { list(): Promise<Task[]>; save(tasks: Task[]): Promise<void>; }
export interface CompletedTaskRepository { list(): Promise<CompletedTask[]>; save(tasks: CompletedTask[]): Promise<void>; }
export interface UserProfileRepository { get(): Promise<UserProfile>; save(profile: UserProfile): Promise<void>; }
export interface CoachingMemoryRepository { get(): Promise<CoachingMemory>; save(memory: CoachingMemory): Promise<void>; clear(): Promise<void>; }
export interface SettingsRepository { get(): Promise<Settings>; save(settings: Settings): Promise<void>; }
export interface MetadataRepository { get(): Promise<AppMetadata>; save(metadata: AppMetadata): Promise<void>; }

export interface Repositories { tasks: TaskRepository; completed: CompletedTaskRepository; profile: UserProfileRepository; memory: CoachingMemoryRepository; settings: SettingsRepository; metadata: MetadataRepository; }
