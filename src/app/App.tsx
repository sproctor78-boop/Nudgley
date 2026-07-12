import { AppHeader } from '../components/layout/AppHeader';
import { LiveRegion } from '../components/feedback/LiveRegion';
import { Board } from '../features/board/Board';
import { TaskCapture } from '../features/capture/TaskCapture';
import { CoachPanel } from '../features/coaching/CoachPanel';
import { CarryOverReview } from '../features/carry-over/CarryOverReview';
import { FocusStrip } from '../features/planning/FocusStrip';
import { FocusTimer } from '../features/timer/FocusTimer';
import { SettingsPanel } from '../features/settings/SettingsPanel';
import { useAppState } from './providers/AppProviders';

export function App() {
  const state = useAppState();
  return <>
    <AppHeader />
    <div className="app-shell">
      <FocusStrip />
      <Board />
    </div>
    <TaskCapture />
    <CoachPanel />
    <FocusTimer />
    <CarryOverReview />
    <SettingsPanel />
    <LiveRegion message={state.ui.announcement} />
  </>;
}
