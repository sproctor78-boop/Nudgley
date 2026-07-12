import { useAppDispatch, useAppState } from '../../app/providers/AppProviders';
import { IconButton } from '../controls/IconButton';
import { ClockIcon, MoreIcon, SparkleIcon } from '../icons/Icons';

export function AppHeader() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  return <header className="app-header">
    <button className={`coach-control ${state.ui.coachOpen ? 'is-active' : ''}`} onClick={() => dispatch({ type: 'toggleUi', key: 'coachOpen' })} aria-pressed={state.ui.coachOpen}>
      <SparkleIcon width={15} height={15} /><span>Coach</span>
    </button>
    <div className="brand" aria-label="Nudgley">Nudgley</div>
    <nav className="header-actions" aria-label="Primary controls">
      <IconButton onClick={() => dispatch({ type: 'toggleUi', key: 'timerOpen' })} aria-pressed={state.ui.timerOpen} aria-label="Focus timer"><ClockIcon width={17} height={17} /></IconButton>
      <IconButton onClick={() => dispatch({ type: 'toggleUi', key: 'settingsOpen' })} aria-label="Settings and menu"><MoreIcon width={17} height={17} /></IconButton>
    </nav>
  </header>;
}
