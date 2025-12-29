import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader, Shield } from 'lucide-react';
import { auth, db } from './services/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

// Components
import { GlobalStyles } from './components/GlobalStyles';
import { GlobalTimerBar } from './components/GlobalTimerBar';
import { MainLayout } from './layouts/MainLayout';

// Pages
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

// Data
import { SEED_TASKS, INCOMING_EMAILS, BILLING_ENTRIES, SEED_TRUSTS, VENDORS_MOCK } from './data/mockData';

// Login Screen
const LoginScreen = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="walnut-card max-w-md w-full p-8 text-center shadow-xl border-t-4 border-racing-green">
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-racing-green rounded-full flex items-center justify-center">
                 <Shield className="text-white h-8 w-8" />
              </div>
           </div>
           <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Fiduciary OS</h1>
           <p className="text-stone-500 font-serif italic mb-8">Secure Trust Administration System</p>
           
           <button 
             onClick={handleLogin}
             className="w-full py-3 px-4 bg-white border border-stone-300 rounded shadow-sm text-stone-700 font-bold font-sans hover:bg-stone-50 transition-all flex items-center justify-center"
           >
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
             Sign in with Google
           </button>
           
           <p className="mt-6 text-xs text-stone-400">Restricted Access. Authorized Fiduciaries Only.</p>
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [isPrivileged, setIsPrivileged] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [oraclePrompt, setOraclePrompt] = useState(null);
  const [emails, setEmails] = useState(() => INCOMING_EMAILS);

  const [trusts, setTrusts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const trustsForUi = trusts.length ? trusts : SEED_TRUSTS;
  
  const activeRole = useMemo(() => {
    const email = (user?.email || "").toLowerCase();
    const baseRole =
      email.includes("jenkins") || email.includes("attorney") ? "attorney" :
      email.includes("vance") || email.includes("cpa") ? "cpa" :
      email.includes("greg") || email.includes("beneficiary") ? "beneficiary" :
      "fiduciary";

    return baseRole;
  }, [user]);
  
  const canAccessPrivileged = activeRole === 'fiduciary' || activeRole === 'attorney';
  const untriagedCount = useMemo(
    () => emails.filter((e) => (e.folder || 'quarantine') === 'quarantine').length,
    [emails]
  );
  const privilegeLocked = canAccessPrivileged && untriagedCount > 0;
  // FIXED: Removed !privilegeLocked constraint to allow full navigation during demo
  const effectiveIsPrivileged = canAccessPrivileged && isPrivileged;

  const handleInboxTriage = (emailId, folder) => {
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, folder } : e)));
    try {
      const raw = localStorage.getItem('auditEvents');
      const list = raw ? JSON.parse(raw) : [];
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: user?.email || 'system', text: `Email archived to ${folder}` }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch {}
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
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: user?.email || 'system', text: 'Timer started' }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch {}
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
      const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: user?.email || 'system', text: 'Timer stopped and entry recorded' }];
      localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
    } catch {}
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
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        try {
          const raw = localStorage.getItem('auditEvents');
          const list = raw ? JSON.parse(raw) : [];
          const next = [...list, { id: Date.now(), timestamp: new Date().toISOString(), actor: currentUser.email || 'user', text: 'User logged in' }];
          localStorage.setItem('auditEvents', JSON.stringify(next.slice(-20)));
        } catch {}
      }
    });

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
                    name: data.name || "Unnamed Trust",
                    situs: data.situs || "Unknown",
                    assets: Number(data.assets || 0),
                    fiduciaryUid: data.fiduciary_uid || "",
                    beneficiaryUids: data.beneficiary_uids || [],
                    attorneyUids: data.attorney_uids || [],
                    cpaUids: data.cpa_uids || [],
                    type: data.type || "Trust",
                    status: data.status || "active",
                    progress: 0,
                    nextTask: "Review",
                    ein: data.ein || "",
                    dateOfDeath: data.date_of_death || "N/A"
                });
            });
            setTrusts(loadedTrusts);
        } catch (error) {
            console.error("Error fetching trusts:", error);
        }
    };

    if (user) {
        fetchTrustsData();
    }

    return () => unsubscribeAuth();
  }, [user]);

  if (authLoading || loading) return <div className="h-screen flex items-center justify-center bg-stone-50 font-serif text-racing-green"><Loader className="animate-spin mr-2"/> Loading Fiduciary OS...</div>;

  if (!user) return <LoginScreen />;

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={
          <MainLayout 
            isPrivileged={effectiveIsPrivileged} 
            setIsPrivileged={setIsPrivileged} 
            canAccessPrivileged={canAccessPrivileged} 
            privilegeLocked={privilegeLocked} 
            untriagedCount={untriagedCount} 
            isMobile={isMobile} 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
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
          <Route path="succession" element={effectiveIsPrivileged ? <SuccessionProtocol /> : <Navigate to="/" replace />} />
          <Route path="admin" element={effectiveIsPrivileged ? <Admin /> : <Navigate to="/" replace />} />
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
    </Router>
  );
};

export default App;
