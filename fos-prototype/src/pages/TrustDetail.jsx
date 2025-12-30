import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Scale, Tag, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { PrivilegeToggle } from '../components/PrivilegeToggle';
import { JurisdictionWatchdog } from '../components/trust/JurisdictionWatchdog';
import { AssetManager } from '../components/trust/AssetManager';
import { CourtAccounting } from '../components/trust/CourtAccounting';
import { BillingModule } from '../components/trust/BillingModule';
import { MyTeam } from '../components/trust/MyTeam';
import { Oracle } from './Oracle';
import { MeetMe } from './MeetMe';
import { TheVault as Vault } from './TheVault';
import { SEED_TRUSTS, WORKFLOW_STEPS, INVOICE_HISTORY } from '../data/mockData';

export function TrustDetail({ 
  trusts, 
  isPrivileged, 
  setIsPrivileged, 
  disablePrivilegeToggle,
  initialOraclePrompt,
  globalTimerRunning,
  globalTimerPaused,
  globalTimerSeconds,
  globalWipEntries,
  setGlobalWipEntries,
  onTimerStart,
  onTimerPause,
  onTimerResume,
  onTimerStop
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState(() => (initialOraclePrompt ? 'oracle' : 'roadmap'));
  
  const trustId = id;
  // FIXED: Primary lookup from SEED_TRUSTS first to ensure complete demo data (EIN, Date of Death, Situs)
  // Then fallback to Firestore trusts if not found in seed data 
  const trust = SEED_TRUSTS.find(t => t.id === parseInt(trustId) || String(t.id) === String(trustId)) || trusts.find(t => t.id === trustId || String(t.id) === String(trustId));
  
  if (!trust) return <div className="p-8 text-center text-stone-500 font-serif">Trust not found. <button onClick={() => navigate('/app/trusts')} className="text-racing-green underline">Go back</button></div>;
  
  const showNexusWarning = trust.situs !== 'California'; 

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4"><div className="flex items-center space-x-2 flex-1 min-w-0"><button onClick={() => navigate('/app/trusts')} className="text-stone-400 hover:text-stone-600 transition-colors"><ChevronLeft size={24} /></button><div className="flex items-center"><h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 truncate tracking-tight">{trust.name}</h1><ChevronRight size={24} className="text-stone-300 ml-2" /></div></div><PrivilegeToggle isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} disabled={disablePrivilegeToggle} /></div>
      {showNexusWarning && isPrivileged && (
        <JurisdictionWatchdog trust={trust} />
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Situs</p><div className="flex items-center text-stone-800 font-bold font-serif"><Scale size={16} className="mr-2 text-racing-green"/> {trust.situs}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">EIN</p><div className="flex items-center text-stone-800 font-bold font-serif"><Tag size={16} className="mr-2 text-racing-green"/> {isPrivileged ? trust.ein : '••-•••••••'}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Date of Death</p><div className="flex items-center text-stone-800 font-bold font-serif"><Calendar size={16} className="mr-2 text-racing-green"/> {trust.dateOfDeath}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Total Assets</p><div className="flex items-center text-stone-800 font-bold font-serif"><DollarSign size={16} className="mr-2 text-racing-green"/> ${(trust.assets / 1000000).toFixed(1)}M</div></div></div>
      <div className="flex bg-white rounded-md p-1 border border-stone-200 shadow-sm overflow-x-auto">
        {['roadmap', 'assets', 'accounting', 'billing', 'team', 'oracle', 'meet-me', 'vault'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setView(tab)} 
            className={`flex-1 px-4 py-2 rounded-sm text-sm font-bold font-serif capitalize transition-colors whitespace-nowrap ${
              view === tab 
                ? 'text-[#064e3b] border-b-2 border-[#064e3b] bg-transparent' // Active State: Dark Green Text, Border, Transparent BG
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {tab === 'team' ? 'My Team' : tab}
          </button>
        ))}
      </div>
      {view === 'roadmap' && (<div className="walnut-card p-6"><h2 className="font-bold text-stone-800 mb-4 font-serif text-xl">Administration Roadmap</h2><div className="space-y-4">{WORKFLOW_STEPS.map(step => (<div key={step.id} className={`p-4 rounded border ${step.status === 'active' ? 'border-racing-green bg-racing-green-light' : 'border-stone-200 bg-stone-50'}`}><div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-800 font-serif">{step.title}</h3>{step.status === 'active' && <span className="text-xs bg-racing-green text-white px-2 py-1 rounded font-serif tracking-wider">ACTIVE</span>}</div><div className="space-y-2 pl-2">{step.items.map((item, i) => (<div key={i} className="flex items-center text-sm font-serif"><CheckCircle size={14} className={`mr-2 ${item.completed ? 'text-racing-green' : 'text-stone-300'}`}/> <span className={item.completed ? 'text-stone-400 line-through' : 'text-stone-700'}>{item.label}</span></div>))}</div></div>))}</div></div>)}
      {view === 'assets' && <AssetManager isPrivileged={isPrivileged} />}
      {view === 'accounting' && <CourtAccounting trust={trust} />}
      {view === 'billing' && <BillingModule 
        invoices={INVOICE_HISTORY} 
        globalTimerRunning={globalTimerRunning}
        globalTimerPaused={globalTimerPaused}
        globalTimerSeconds={globalTimerSeconds}
        globalWipEntries={globalWipEntries}
        setGlobalWipEntries={setGlobalWipEntries}
        onTimerStart={onTimerStart}
        onTimerPause={onTimerPause}
        onTimerResume={onTimerResume}
        onTimerStop={onTimerStop}
        trustId={trustId}
        trustName={trust?.name}
      />}
      {view === 'team' && <MyTeam trustId={trust.id} />}
      {view === 'oracle' && <Oracle initialPrompt={initialOraclePrompt} contextTrust={trust} />}
      {view === 'meet-me' && <MeetMe isPrivileged={isPrivileged} />}
      {view === 'vault' && <Vault />}
    </div>
  );
}
