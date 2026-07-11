import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { IconButton } from '../controls/IconButton';

export function AppHeader() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  return <header className="app-header">
    <button className={`coach-control ${state.ui.coachOpen ? 'is-active' : ''}`} onClick={() => dispatch({ type: 'toggleUi', key: 'coachOpen' })} aria-pressed={state.ui.coachOpen}>
      <span aria-hidden="true">🧠</span><span>Coach</span>
    </button>
    <div className="brand" aria-label="Nudgley">Nudgley</div>
    <nav className="header-actions" aria-label="Primary controls">
      <IconButton onClick={() => dispatch({ type: 'toggleUi', key: 'timerOpen' })} aria-pressed={state.ui.timerOpen} aria-label="Focus timer">⏱</IconButton>
      <IconButton onClick={() => dispatch({ type: 'toggleUi', key: 'settingsOpen' })} aria-label="Settings and menu">•••</IconButton>
    </nav>
  </header>;
}
