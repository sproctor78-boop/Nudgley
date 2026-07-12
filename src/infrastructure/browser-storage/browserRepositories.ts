import { STORAGE_KEYS } from './storageKeys';
import type { BrowserStorageClient } from './localStorageClient';
import type { AppMetadata, CoachingMemory, Repositories, Settings, UserProfile } from '../../services/persistence/repositories';
import type { CompletedTask, Task } from '../../domain/tasks/taskTypes';
import { migrateCoachingMemory, migrateLegacyCompleted, migrateLegacyTasks, migrateMetadata, migrateSettings, migrateUserProfile } from '../migrations/migrateLegacyData';

export function createBrowserRepositories(storage: BrowserStorageClient): Repositories {
  return {
    tasks: { async list() { return migrateLegacyTasks(storage.getJson(STORAGE_KEYS.tasks)); }, async save(tasks: Task[]) { storage.setJson(STORAGE_KEYS.tasks, tasks); } },
    completed: { async list() { return migrateLegacyCompleted(storage.getJson(STORAGE_KEYS.completed)); }, async save(tasks: CompletedTask[]) { storage.setJson(STORAGE_KEYS.completed, tasks.slice(0, 250)); } },
    profile: { async get() { return migrateUserProfile(storage.getJson(STORAGE_KEYS.userProfile)); }, async save(profile: UserProfile) { storage.setJson(STORAGE_KEYS.userProfile, profile); storage.setRaw(STORAGE_KEYS.onboarding, profile.setupComplete ? '1' : '0'); } },
    memory: { async get() { return migrateCoachingMemory(storage.getJson(STORAGE_KEYS.profile)); }, async save(memory: CoachingMemory) { storage.setJson(STORAGE_KEYS.profile, memory); }, async clear() { storage.remove(STORAGE_KEYS.profile); } },
    settings: { async get() { return migrateSettings(storage.getRaw(STORAGE_KEYS.triageMode), storage.getJson(STORAGE_KEYS.notifSettings)); }, async save(settings: Settings) { storage.setRaw(STORAGE_KEYS.triageMode, settings.triagePreference); storage.setJson(STORAGE_KEYS.notifSettings, settings.notifications); } },
    metadata: { async get() { return storage.getJson<AppMetadata>(STORAGE_KEYS.appMetadata) ?? migrateMetadata(storage.getRaw(STORAGE_KEYS.rollover), storage.getRaw(STORAGE_KEYS.reentryDismissed)); }, async save(metadata: AppMetadata) { storage.setJson(STORAGE_KEYS.appMetadata, metadata); if (metadata.lastRolloverDate) storage.setRaw(STORAGE_KEYS.rollover, metadata.lastRolloverDate); } }
  };
}
