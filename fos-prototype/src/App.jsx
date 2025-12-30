import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

import { GlobalStyles } from './components/GlobalStyles';
import { GlobalTimerBar } from './components/GlobalTimerBar';
import { MainLayout } from './layouts/MainLayout';

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

import { SEED_TASKS, INCOMING_EMAILS, BILLING_ENTRIES, SEED_TRUSTS, VENDORS_MOCK } from './data/mockData';

const AppShell = ({ user, isDemoMode, isAuthenticated, onLogout }) => {
  const [isPrivileged, setIsPrivileged] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [oraclePrompt, setOraclePrompt] = useState(null);
  const [emails, setEmails] = useState(() => INCOMING_EMAILS);

  const [trusts, setTrusts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = user || (isDemoMode ? { email: 'demo@fiduciary.os', uid: 'demo-user' } : null);

  const trustsForUi = trusts.length ? trusts : SEED_TRUSTS;
  
  const activeRole = useMemo(() => {
    const email = (currentUser?.email || "").toLowerCase();
    const baseRole =
      email.includes("jenkins") || email.includes("attorney") ? "attorney" :
      email.includes("vance") || email.includes("cpa") ? "cpa" :
      email.includes("greg") || email.includes("beneficiary") ? "beneficiary" :
      "fiduciary";

    return baseRole;
  }, [currentUser]);
  
  const canAccessPrivileged = activeRole === 'fiduciary' || activeRole === 'attorney';
  const untriagedCount = useMemo(
    () => emails.filter((e) => (e.folder || 'quarantine') === 'quarantine').length,
    [emails]
  );
  const privilegeLocked = canAccessPrivileged && untriagedCount > 0;
  const effectiveIsPrivileged = canAccessPrivileged && isPrivileged;

  const handleInboxTriage = (emailId, folder) => {
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, folder } : e)));
    try {
      const raw = localStorage.getItem('auditEvents');
      const list = raw ? JSON.parse(raw) : [];
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: currentUser?.email || 'system', text: `Email archived to ${folder}` }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch (e) {
      void e;
    }
  };
  
  // GLOBAL TIMER STATE
  const [globalTimerRunning, setGlobalTimerRunning] = useState(false);
  const [globalTimerPaused, setGlobalTimerPaused] = useState(false);
  const [globalTimerSeconds, setGlobalTimerSeconds] = useState(0);
  const [globalTimerTrustName, setGlobalTimerTrustName] = useState('');
  const [globalWipEntries, setGlobalWipEntries] = useState(BILLING_ENTRIES);
  const HOURLY_RATE = 250;
  
  useEffect(() => {
    let interval;
    if (globalTimerRunning && !globalTimerPaused) {
      interval = setInterval(() => setGlobalTimerSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [globalTimerRunning, globalTimerPaused]);
  
  const handleGlobalTimerStart = (_trustId, trustName) => {
    setGlobalTimerRunning(true);
    setGlobalTimerPaused(false);
    setGlobalTimerTrustName(trustName || '');
    try {
      const raw = localStorage.getItem('auditEvents');
      const list = raw ? JSON.parse(raw) : [];
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: currentUser?.email || 'system', text: 'Timer started' }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch (e) {
      void e;
    }
  };
  
  const handleGlobalTimerPause = () => setGlobalTimerPaused(true);
  const handleGlobalTimerResume = () => setGlobalTimerPaused(false);
  
  const handleGlobalTimerStop = () => {
    if (globalTimerSeconds > 0) {
      const hours = Math.round((globalTimerSeconds / 3600) * 100) / 100;
      const newEntry = {
        id: Date.now(),
        date: 'Today',
        desc: `Timer Session${globalTimerTrustName ? ` - ${globalTimerTrustName}` : ''} (edit description)`,
        hours: hours || 0.01,
        rate: HOURLY_RATE,
        total: (hours || 0.01) * HOURLY_RATE
      };
      setGlobalWipEntries(prev => [newEntry, ...prev]);
    }
    setGlobalTimerRunning(false);
    setGlobalTimerPaused(false);
    setGlobalTimerSeconds(0);
    setGlobalTimerTrustName('');
    try {
      const raw = localStorage.getItem('auditEvents');
      const list = raw ? JSON.parse(raw) : [];
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: currentUser?.email || 'system', text: 'Timer stopped and entry recorded' }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch (e) {
      void e;
    }
  };
  
  const handleGlobalTimerDiscard = () => {
    setGlobalTimerRunning(false);
    setGlobalTimerPaused(false);
    setGlobalTimerSeconds(0);
    setGlobalTimerTrustName('');
  };

  const handleAnalyzeRisk = (riskType) => {
    if (riskType === 'greg') setOraclePrompt("Analyze Gregory Smith's recent emails for hostility.");
    if (riskType === 'tax') setOraclePrompt("Analyze tax cliff liability.");
    if (riskType === 'nexus') setOraclePrompt("Check Nexus liability for California trustee.");
  };

  useEffect(() => {
    const init = async () => {
      const handleResize = () => { setIsMobile(window.innerWidth < 1024); if (window.innerWidth >= 1024) setIsOpen(false); };
      handleResize();
      window.addEventListener('resize', handleResize);
      setTasks(SEED_TASKS);
      setLoading(false);
      return () => window.removeEventListener('resize', handleResize);
    };
    init();

    const fetchTrustsData = async () => {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "trusts"));
            const loadedTrusts = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                loadedTrusts.push({
                    id: doc.id,
                    ...data
                });
            });
            setTrusts(loadedTrusts);
        } catch (error) {
            console.error("Error fetching trusts:", error);
        }
    };

    if (currentUser) {
        fetchTrustsData();
    }
  }, [currentUser]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-50 font-serif text-racing-green"><Loader className="animate-spin mr-2"/> Loading Fiduciary OS...</div>;

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
            currentUser={currentUser}
            onLogout={onLogout}
            isAuthenticated={isAuthenticated}
          />
        }>
          <Route index element={<CommandCenter onAnalyzeRisk={handleAnalyzeRisk} />} />
          <Route path="inbox" element={<InboxPage emails={emails} trusts={trustsForUi} canAccessPrivileged={canAccessPrivileged} onTriage={handleInboxTriage} />} />
          <Route path="trusts" element={<Trusts trusts={trustsForUi} />} />
          <Route path="trusts/:id" element={
            <TrustDetail 
              trusts={trustsForUi} 
              isPrivileged={effectiveIsPrivileged} 
              setIsPrivileged={setIsPrivileged} 
              disablePrivilegeToggle={!canAccessPrivileged || privilegeLocked}
              initialOraclePrompt={oraclePrompt}
              globalTimerRunning={globalTimerRunning}
              globalTimerPaused={globalTimerPaused}
              globalTimerSeconds={globalTimerSeconds}
              globalWipEntries={globalWipEntries}
              setGlobalWipEntries={setGlobalWipEntries}
              onTimerStart={handleGlobalTimerStart}
              onTimerPause={handleGlobalTimerPause}
              onTimerResume={handleGlobalTimerResume}
              onTimerStop={handleGlobalTimerStop}
            />
          } />
          <Route path="oracle" element={<Oracle initialPrompt={oraclePrompt} />} />
          <Route path="meet-me" element={<MeetMe isPrivileged={effectiveIsPrivileged} />} />
          <Route path="rolodex" element={<Rolodex vendors={VENDORS_MOCK} trusts={trustsForUi} />} />
          <Route path="compliance" element={<ComplianceRoadmap tasks={tasks} trusts={trustsForUi} onMoveTask={()=>{}} />} />
          <Route path="vault" element={<TheVault />} />
          <Route path="succession" element={effectiveIsPrivileged ? <SuccessionProtocol /> : <Navigate to="/app" replace />} />
          <Route path="admin" element={effectiveIsPrivileged ? <Admin /> : <Navigate to="/app" replace />} />
          <Route path="audit-log" element={<AuditLog />} />
        </Route>
      </Routes>
      
      <GlobalTimerBar 
        isRunning={globalTimerRunning}
        isPaused={globalTimerPaused}
        time={globalTimerSeconds}
        trustName={globalTimerTrustName}
        onPlay={handleGlobalTimerResume}
        onPause={handleGlobalTimerPause}
        onStop={handleGlobalTimerStop}
        onDiscard={handleGlobalTimerDiscard}
      />
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkDemoAuth = () => {
      const demoAuth = localStorage.getItem('fos_demo_auth');
      if (demoAuth === 'true') setIsDemoMode(true);
    };
    checkDemoAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const demoAuth = localStorage.getItem('fos_demo_auth');
      if (demoAuth === 'true' && !isDemoMode) setIsDemoMode(true);
      if (!demoAuth && isDemoMode) setIsDemoMode(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  if (authLoading && !isDemoMode) return <div className="h-screen flex items-center justify-center bg-stone-50 font-serif text-racing-green"><Loader className="animate-spin mr-2"/> Initializing...</div>;

  const isAuthenticated = !!user || isDemoMode;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('fos_demo_auth');
      setIsDemoMode(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/app/*" element={<AppShell user={user} isDemoMode={isDemoMode} isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
