import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

import { GlobalStyles } from './components/GlobalStyles';
import { GlobalTimerBar } from './components/GlobalTimerBar';
import { MainLayout } from './layouts/MainLayout';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import { Login } from './pages/Login';
import { GetStarted } from './pages/GetStarted';
import LandingPage from './pages/LandingPage';
import { CommandCenter } from './pages/CommandCenter';
import { Trusts } from './pages/Trusts';
import { TrustDetail } from './pages/TrustDetail';
import { ComplianceRoadmap } from './pages/ComplianceRoadmap';
import { TheVault } from './pages/TheVault';
import { InboxPage } from './pages/Inbox';
import { Oracle } from './pages/Oracle';
import { Rolodex } from './pages/Rolodex';
import { Admin } from './pages/Admin';
import { SuccessionProtocol } from './pages/SuccessionProtocol';
import { MeetMe } from './pages/MeetMe';
import { AuditLog } from './pages/AuditLog';

import { VENDORS_MOCK } from './data/mockData';

const AppShell = () => {
  const { user, isAuthenticated, isDemoMode, canAccessPrivileged, logout } = useAuth();
  const { 
    trusts, tasks, emails, loading, 
    timerState, startTimer, pauseTimer, resumeTimer, stopTimer, discardTimer,
    triageEmail
  } = useData();

  const [isPrivileged, setIsPrivileged] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [oraclePrompt, setOraclePrompt] = useState(null);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => { setIsMobile(window.innerWidth < 1024); if (window.innerWidth >= 1024) setIsOpen(false); };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Privilege Logic
  const effectiveIsPrivileged = canAccessPrivileged && isPrivileged;
  const untriagedCount = emails.filter((e) => (e.folder || 'quarantine') === 'quarantine').length;
  const privilegeLocked = canAccessPrivileged && untriagedCount > 0;

  const handleAnalyzeRisk = (riskType) => {
    if (riskType === 'greg') setOraclePrompt("Analyze Gregory Smith's recent emails for hostility.");
    if (riskType === 'tax') setOraclePrompt("Analyze tax cliff liability.");
    if (riskType === 'nexus') setOraclePrompt("Check Nexus liability for California trustee.");
  };

  if (loading && !isDemoMode) return <div className="h-screen flex items-center justify-center bg-stone-50 font-serif text-racing-green"><Loader className="animate-spin mr-2"/> Loading Fiduciary OS...</div>;

  return (
    <>
      <Routes>
        <Route element={
          <MainLayout 
            isPrivileged={effectiveIsPrivileged} 
            setIsPrivileged={setIsPrivileged} 
            canAccessPrivileged={canAccessPrivileged} 
            privilegeLocked={privilegeLocked} 
            untriagedCount={untriagedCount} 
            isMobile={isMobile} 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            currentUser={user}
            onLogout={logout}
            isAuthenticated={isAuthenticated}
          />
        }>
          <Route index element={<CommandCenter onAnalyzeRisk={handleAnalyzeRisk} />} />
          <Route path="inbox" element={<InboxPage emails={emails} trusts={trusts} canAccessPrivileged={canAccessPrivileged} onTriage={triageEmail} />} />
          <Route path="trusts" element={<Trusts trusts={trusts} />} />
          <Route path="trusts/:id" element={
            <TrustDetail 
              trusts={trusts} 
              isPrivileged={effectiveIsPrivileged} 
              setIsPrivileged={setIsPrivileged} 
              disablePrivilegeToggle={!canAccessPrivileged || privilegeLocked}
              initialOraclePrompt={oraclePrompt}
              // Timer Props (from Context now)
              globalTimerRunning={timerState.running}
              globalTimerPaused={timerState.paused}
              globalTimerSeconds={timerState.seconds}
              globalWipEntries={timerState.wipEntries}
              // setGlobalWipEntries - Not exposed directly, handled in stopTimer
              onTimerStart={startTimer}
              onTimerPause={pauseTimer}
              onTimerResume={resumeTimer}
              onTimerStop={stopTimer}
            />
          } />
          <Route path="oracle" element={<Oracle initialPrompt={oraclePrompt} />} />
          <Route path="meet-me" element={<MeetMe isPrivileged={effectiveIsPrivileged} />} />
          <Route path="rolodex" element={<Rolodex vendors={VENDORS_MOCK} trusts={trusts} />} />
          <Route path="compliance" element={<ComplianceRoadmap tasks={tasks} trusts={trusts} onMoveTask={()=>{}} />} />
          <Route path="vault" element={<TheVault />} />
          <Route path="succession" element={<SuccessionProtocol />} />
          <Route path="admin" element={<Admin />} />
          <Route path="audit-log" element={<AuditLog />} />
        </Route>
      </Routes>
      
      <GlobalTimerBar 
        isRunning={timerState.running}
        isPaused={timerState.paused}
        time={timerState.seconds}
        trustName={timerState.trustName}
        onPlay={resumeTimer}
        onPause={pauseTimer}
        onStop={stopTimer}
        onDiscard={discardTimer}
      />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <GlobalStyles />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/app/*" element={<AppShell />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
