import { AppHeader } from '../components/layout/AppHeader';
import { LiveRegion } from '../components/feedback/LiveRegion';
import { Board } from '../features/board/Board';
import { CaptureBar } from '../features/capture/CaptureBar';
import { CoachPanel } from '../features/coaching/CoachPanel';
import { CarryOverReview } from '../features/carry-over/CarryOverReview';
import { FocusRibbon } from '../features/planning/FocusRibbon';
import { FocusTimer } from '../features/timer/FocusTimer';
import { SettingsPanel } from '../features/settings/SettingsPanel';
import { useAppState } from './providers/AppProviders';

export function App() {
  const state = useAppState();
  return <>
    <AppHeader />
    <div className="app-shell">
      <FocusRibbon />
      <CaptureBar />
      <Board />
    </div>
    <CoachPanel />
    <FocusTimer />
    <CarryOverReview />
    <SettingsPanel />
    <LiveRegion message={state.ui.announcement} />
  </>;
}
