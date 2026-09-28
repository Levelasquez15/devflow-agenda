import React from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import WeeklyView from './components/WeeklyView';
import DailyFocusView from './components/DailyFocusView';
import MonthlyCalendarView from './components/MonthlyCalendarView';
import RoadmapExplorer from './components/RoadmapExplorer';
import StatsDashboard from './components/StatsDashboard';
import StudySessionModal from './components/StudySessionModal';
import RoadmapGeneratorModal from './components/RoadmapGeneratorModal';
import QuickAddTaskModal from './components/QuickAddTaskModal';
import SettingsModal from './components/SettingsModal';
import { useStudy } from './context/StudyContext';

export default function App() {
  const { activeView } = useStudy();

  const renderActiveView = () => {
    switch (activeView) {
      case 'weekly':
        return <WeeklyView />;
      case 'daily':
        return <DailyFocusView />;
      case 'monthly':
        return <MonthlyCalendarView />;
      case 'roadmaps':
        return <RoadmapExplorer />;
      case 'stats':
        return <StatsDashboard />;
      default:
        return <WeeklyView />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Top Application Title Bar */}
      <TitleBar />

      {/* Main Workspace Frame */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Central Content Area */}
        <main
          style={{
            flex: 1,
            background: 'var(--bg-canvas)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Focus Studios */}
      <StudySessionModal />
      <RoadmapGeneratorModal />
      <QuickAddTaskModal />
      <SettingsModal />
    </div>
  );
}
