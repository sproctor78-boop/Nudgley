export interface BrowserStorageClient { getJson<T>(key: string): T | null; setJson<T>(key: string, value: T): void; getRaw(key: string): string | null; setRaw(key: string, value: string): void; remove(key: string): void; }

export class LocalStorageClient implements BrowserStorageClient {
  constructor(private readonly storage: Storage = window.localStorage) {}
  getJson<T>(key: string): T | null { try { const raw = this.storage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; } }
  setJson<T>(key: string, value: T): void { this.storage.setItem(key, JSON.stringify(value)); }
  getRaw(key: string): string | null { try { return this.storage.getItem(key); } catch { return null; } }
  setRaw(key: string, value: string): void { this.storage.setItem(key, value); }
  remove(key: string): void { this.storage.removeItem(key); }
}
