import { createContext, type Dispatch, type ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';
import { appReducer, emptyUi, type AppAction, type AppState } from '../state/appState';
import { LocalStorageClient } from '../../infrastructure/browser-storage/localStorageClient';
import { createBrowserRepositories } from '../../infrastructure/browser-storage/browserRepositories';
import type { Repositories } from '../../services/persistence/repositories';
import { runRollover } from '../../domain/scheduling/rollover';

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<AppAction> | null>(null);
const RepositoryContext = createContext<Repositories | null>(null);

const initialState: AppState = { tasks: [], completed: [], profile: { schemaVersion: 1, tone: 'balanced', setupComplete: false }, memory: { schemaVersion: 1, insights: [], patterns: [] }, settings: { schemaVersion: 1, triagePreference: 'balanced', notifications: { enabled: false, frequency: 'low', morning: '09:00', eod: '17:30' } }, metadata: { schemaVersion: 1 }, carryOver: [], ui: emptyUi };

export function AppProviders({ children }: { children: ReactNode }) {
  const repositories = useMemo(() => createBrowserRepositories(new LocalStorageClient()), []);
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const [tasks, completed, profile, memory, settings, metadata] = await Promise.all([repositories.tasks.list(), repositories.completed.list(), repositories.profile.get(), repositories.memory.get(), repositories.settings.get(), repositories.metadata.get()]);
      const rollover = runRollover(tasks, metadata);
      if (!cancelled) {
        dispatch({ type: 'hydrate', state: { tasks: rollover.tasks, completed, profile, memory, settings, metadata: { ...metadata, ...rollover.metadata }, carryOver: rollover.carryOver } });
      }
      await repositories.tasks.save(rollover.tasks);
      await repositories.metadata.save({ ...metadata, ...rollover.metadata });
    }
    hydrate().catch(console.error);
    return () => { cancelled = true; };
  }, [repositories]);

  useEffect(() => { repositories.tasks.save(state.tasks).catch(console.error); }, [repositories, state.tasks]);
  useEffect(() => { repositories.completed.save(state.completed).catch(console.error); }, [repositories, state.completed]);
  useEffect(() => { repositories.settings.save(state.settings).catch(console.error); }, [repositories, state.settings]);
  useEffect(() => { repositories.profile.save(state.profile).catch(console.error); }, [repositories, state.profile]);
  useEffect(() => { repositories.metadata.save({ ...state.metadata, activeTaskId: state.ui.activeTaskId ?? state.metadata.activeTaskId }).catch(console.error); }, [repositories, state.metadata, state.ui.activeTaskId]);

  return <RepositoryContext.Provider value={repositories}><AppStateContext.Provider value={state}><AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider></AppStateContext.Provider></RepositoryContext.Provider>;
}

export function useAppState(): AppState { const state = useContext(AppStateContext); if (!state) throw new Error('useAppState must be used inside AppProviders'); return state; }
export function useAppDispatch(): Dispatch<AppAction> { const dispatch = useContext(AppDispatchContext); if (!dispatch) throw new Error('useAppDispatch must be used inside AppProviders'); return dispatch; }
export function useRepositories(): Repositories { const repos = useContext(RepositoryContext); if (!repos) throw new Error('useRepositories must be used inside AppProviders'); return repos; }
