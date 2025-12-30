import React, { useMemo, useState } from 'react';
import { 
  Settings, Sparkles, Loader, CheckCircle, History, FileText, Shield, 
  BrainCircuit, Hourglass, Globe, Scale, Key, EyeOff, Eye, AlertTriangle, 
  CreditCard, Lock, Landmark, Phone, FileArchive 
} from 'lucide-react';

export function Admin() {
  const [currentTier, setCurrentTier] = useState('standard');
  const [selectedTier, setSelectedTier] = useState('standard');
  const [demoMode, setDemoMode] = useState(true);
  const [restoreStatus, setRestoreStatus] = useState(null);
  const [showSuccessorVault, setShowSuccessorVault] = useState(false);
  const [revealedFields, setRevealedFields] = useState({});
  const [editingField, setEditingField] = useState(null);
  
  // STEP 4 #10: Successor Trustee Handoff Vault Data
  const [vaultData, setVaultData] = useState({
    masterPassword: 'Tr0ub4dor&3',
    bankPin: '7429',
    safeCombo: '24-08-15',
    irsPin: '94521',
    brokerageAcct: '****4821',
    cryptoSeed: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    emergencyContact: '(555) 867-5309',
    safeDepositBox: 'Box #1847, First National Bank, Main St Branch',
    insurancePolicy: 'POL-2024-8847291',
    digitalVaultUrl: 'https://vault.lahrfiduciary.com/successor'
  });
  
  const toggleReveal = (field) => {
    setRevealedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const handleEditField = (field, value) => {
    setVaultData(prev => ({ ...prev, [field]: value }));
  };
  
  const maskValue = (value, field) => {
    if (revealedFields[field]) return value;
    if (field === 'cryptoSeed') return '•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••';
    if (field === 'masterPassword') return '••••••••••••';
    return value.replace(/./g, '•');
  };

  const maskPreviewValue = (value, field) => {
    if (field === 'cryptoSeed') return '•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••';
    if (field === 'digitalVaultUrl') return 'https://••••••••••••••••••••••••••••••••';
    if (field === 'safeDepositBox') return 'Box #••••, ••••••••• ••••, •••• •• ••••••';
    if (field === 'insurancePolicy') return 'POL-••••-••••••••';
    return String(value || '').replace(/./g, '•');
  };
  const tierRank = useMemo(() => ({ standard: 0, pro: 1, dynasty: 2 }), []);

  const tiers = useMemo(
    () => [
      { id: 'standard', name: 'Standard', price: 150, accent: 'border-stone-200' },
      { id: 'pro', name: 'Standard Pro', price: 250, accent: 'border-amber-200' },
      { id: 'dynasty', name: 'Dynasty', price: 450, accent: 'border-purple-200' }
    ],
    []
  );

  const tierNameById = useMemo(
    () =>
      tiers.reduce((acc, t) => {
        acc[t.id] = t.name;
        return acc;
      }, {}),
    [tiers]
  );

  const modules = useMemo(
    () => [
      { id: 'core', label: 'Core Ledger & Vault', tiers: ['standard', 'pro', 'dynasty'], icon: FileText },
      { id: 'privilege', label: 'Privilege Firewall', tiers: ['standard', 'pro', 'dynasty'], icon: Shield },
      { id: 'oracle', label: 'AI Fiduciary Mind', tiers: ['pro', 'dynasty'], icon: BrainCircuit },
      { id: 'audit', label: 'Court-Ready Audit Logs', tiers: ['pro', 'dynasty'], icon: History },
      { id: 'accounting', label: 'Court Accounting Engine', tiers: ['pro', 'dynasty'], icon: Scale },
      { id: 'legacy', label: 'Digital Successor Protocol', tiers: ['dynasty'], icon: Hourglass },
      { id: 'nexus', label: 'Multi-State Nexus Watchdog', tiers: ['dynasty'], icon: Globe }
    ],
    []
  );

  const featuresByTier = useMemo(
    () => ({
      standard: ['core', 'privilege'],
      pro: ['core', 'privilege', 'oracle', 'audit', 'accounting'],
      dynasty: ['core', 'privilege', 'oracle', 'audit', 'accounting', 'legacy', 'nexus']
    }),
    []
  );

  const included = featuresByTier[selectedTier] || [];

  const hasSuccessorVaultAccess = tierRank[currentTier] >= tierRank.dynasty;
  const successorVaultInSelected = tierRank[selectedTier] >= tierRank.dynasty;

  const minRequiredTier = (modTiers) => {
    return (modTiers || []).reduce((best, t) => {
      if (!best) return t;
      return tierRank[t] < tierRank[best] ? t : best;
    }, null);
  };

  const handleRestoreDemoData = () => {
    setRestoreStatus('restoring');
    setTimeout(() => {
      setRestoreStatus('success');
      setTimeout(() => setRestoreStatus(null), 3000);
    }, 1500);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Platform Administration</h1><p className="text-stone-500 font-serif italic">Manage Licensing & Active Modules</p></div><div className="px-4 py-2 bg-stone-800 rounded text-white text-sm font-serif flex items-center"><Settings size={16} className="mr-2"/> Administrator Mode</div></div>
       
       {/* Demo Mode Card */}
       <div className="walnut-card border-l-4 border-amber-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="flex items-center space-x-4">
             <div className="p-3 bg-amber-100 rounded-lg"><Sparkles size={24} className="text-amber-600" /></div>
             <div>
               <h3 className="font-serif font-bold text-lg text-stone-800">Demo Mode</h3>
               <p className="text-sm text-stone-500">Running with sample data for demonstration purposes</p>
             </div>
           </div>
           <div className="flex items-center space-x-4">
             <button 
               onClick={handleRestoreDemoData}
               disabled={restoreStatus === 'restoring'}
               className={`px-4 py-2 rounded font-bold text-sm flex items-center transition-all ${
                 restoreStatus === 'success' 
                   ? 'bg-green-100 text-green-700 border border-green-200' 
                   : restoreStatus === 'restoring'
                   ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-wait'
                   : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
               }`}
             >
               {restoreStatus === 'restoring' ? (
                 <><Loader size={16} className="mr-2 animate-spin"/> Restoring...</>
               ) : restoreStatus === 'success' ? (
                 <><CheckCircle size={16} className="mr-2"/> Data Restored!</>
               ) : (
                 <><History size={16} className="mr-2"/> Restore Demo Data</>
               )}
             </button>
             <label className="toggle-switch">
               <input type="checkbox" checked={demoMode} onChange={() => setDemoMode(!demoMode)} />
               <span className="toggle-slider"></span>
             </label>
           </div>
         </div>
       </div>
       
       <div className="walnut-card p-0 overflow-hidden">
         <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-start justify-between gap-6">
           <div>
             <h2 className="text-xl font-serif font-bold text-stone-900">Plans & Modules</h2>
             <p className="text-sm text-stone-500">Choose a plan to preview what you unlock.</p>
           </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">Current Plan</div>
            <div className="text-sm font-bold text-stone-800">{tierNameById[currentTier] || currentTier}</div>
          </div>
         </div>

         <div className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => {
              const isCurrent = tier.id === currentTier;
              const isSelected = tier.id === selectedTier;
              const isUpgrade = tierRank[tier.id] > tierRank[currentTier];
              const isDowngrade = tierRank[tier.id] < tierRank[currentTier];
              const ringClass = isSelected
                ? isUpgrade
                  ? 'ring-2 ring-[#FF5C35]'
                  : 'ring-2 ring-[#064e3b]'
                : isCurrent
                  ? 'ring-2 ring-racing-green/40'
                  : '';

              return (
                <button
                  key={tier.id}
                  onClick={() => handleTierSelect(tier.id)}
                  className={`text-left rounded-xl border p-5 transition-all bg-white ${tier.accent} ${ringClass} ${!ringClass ? 'hover:shadow-md' : ''} ${isDowngrade ? 'opacity-60' : ''}`}
                >
                   <div className="flex items-start justify-between gap-3">
                     <div>
                       <div className="font-serif font-bold text-lg text-stone-900">{tier.name}</div>
                       <div className="mt-2 flex items-end gap-2">
                         <div className="text-3xl font-bold text-racing-green">${tier.price}</div>
                         <div className="text-sm text-stone-500">/month</div>
                       </div>
                     </div>

                     {isCurrent ? (
                       <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-racing-green-light text-racing-green border border-racing-green/20">
                         Current
                       </div>
                     ) : isUpgrade ? (
                       <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">
                         Upgrade
                       </div>
                     ) : (
                       <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-600 border border-stone-200">
                         Preview
                       </div>
                     )}
                   </div>

                   <div className="mt-4 text-xs text-stone-500">
                     {tier.id === 'standard' && 'Ledger + Vault, Privilege Firewall.'}
                     {tier.id === 'pro' && 'Adds AI + court-ready audit + accounting engine.'}
                     {tier.id === 'dynasty' && 'Adds successor protocol + nexus watchdog.'}
                   </div>

                   {isSelected && (
                     <div className="mt-4">
                       {isCurrent ? (
                         <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">Selected</div>
                       ) : isUpgrade ? (
                         <div className="text-xs font-bold text-[#064e3b] uppercase tracking-widest">Previewing upgrade</div>
                       ) : (
                         <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">Previewing</div>
                       )}
                     </div>
                   )}
                 </button>
               );
             })}
           </div>

           <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-lg bg-stone-50 border border-stone-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400">Selected plan</div>
              <div className="text-sm font-bold text-stone-800">{tierNameById[selectedTier] || selectedTier}</div>
            </div>
             <div className="flex gap-2 w-full md:w-auto">
               <button
                 onClick={() => setSelectedTier(currentTier)}
                 className="flex-1 md:flex-none px-4 py-2 rounded font-bold text-sm bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
               >
                 Reset to current
               </button>
              <button
                onClick={() => {
                  if (tierRank[selectedTier] > tierRank[currentTier]) setCurrentTier(selectedTier);
                }}
                className={`flex-1 md:flex-none px-4 py-2 rounded font-bold text-sm ${tierRank[selectedTier] > tierRank[currentTier] ? 'bg-[#FF5C35] hover:bg-[#E54C28] text-white shadow-sm' : 'bg-stone-200 text-stone-500 cursor-not-allowed'}`}
                disabled={tierRank[selectedTier] <= tierRank[currentTier]}
              >
                {tierRank[selectedTier] > tierRank[currentTier]
                  ? `Upgrade to ${tierNameById[selectedTier] || selectedTier}`
                  : selectedTier === currentTier
                    ? 'Current plan'
                    : 'Upgrade unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>
       
       <div className="walnut-card">
         <h3 className="font-serif font-bold text-lg text-stone-800 mb-6 border-b border-stone-100 pb-2">Included Modules</h3>
         <div className="space-y-4">
          {modules.map((mod) => {
            const isIncluded = included.includes(mod.id);
            const requiredTier = minRequiredTier(mod.tiers);
            const requiredLabel = tierNameById[requiredTier] || requiredTier;

             return (
               <div key={mod.id} className={`flex items-center justify-between p-4 rounded border ${isIncluded ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-100'}`}>
                 <div className="flex items-center space-x-4">
                   <div className={`p-2 rounded ${isIncluded ? 'bg-racing-green-light text-racing-green' : 'bg-stone-200 text-stone-400'}`}>
                     <mod.icon size={20} />
                   </div>
                   <div>
                     <p className={`font-bold text-sm ${isIncluded ? 'text-stone-800' : 'text-stone-600'}`}>{mod.label}</p>
                     {!isIncluded && (
                       <p className="text-xs text-stone-400 font-serif italic">Upgrade to {requiredLabel} to unlock</p>
                     )}
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   {isIncluded ? (
                     <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100">Included</span>
                   ) : (
                     <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">Locked</span>
                   )}
                   <label className="toggle-switch">
                     <input type="checkbox" className="toggle-checkbox" checked={isIncluded} disabled readOnly />
                     <span className="toggle-slider"></span>
                   </label>
                 </div>
               </div>
             );
           })}
         </div>
       </div>
       
       {/* STEP 4 #10: Successor Trustee Handoff Vault */}
       <div className="walnut-card border-l-4 border-stone-800">
         <div className="flex justify-between items-center mb-6">
           <div className="flex items-center space-x-3">
             <div className="p-3 bg-stone-800 rounded-lg"><Key size={24} className="text-amber-500" /></div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-800">Successor Trustee Vault</h3>
              <p className="text-sm text-stone-500">Sensitive credentials for emergency handoff</p>
              {!hasSuccessorVaultAccess && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">Locked</span>
                  <span className="text-xs text-stone-500 font-serif italic">
                    {successorVaultInSelected ? 'Included with Dynasty after upgrade.' : 'Upgrade to Dynasty to unlock.'}
                  </span>
                </div>
              )}
            </div>
          </div>
           <button 
             onClick={() => setShowSuccessorVault(!showSuccessorVault)} 
             className="px-4 py-2 bg-stone-100 text-stone-700 rounded font-bold text-sm flex items-center hover:bg-stone-200 transition"
          >
            {showSuccessorVault ? <EyeOff size={16} className="mr-2"/> : <Eye size={16} className="mr-2"/>}
            {showSuccessorVault ? 'Hide Vault' : hasSuccessorVaultAccess ? 'Access Vault' : 'Preview Vault'}
          </button>
        </div>
         
        {showSuccessorVault && (
          <div className="space-y-3 animate-fadeIn">
            <div className={`${hasSuccessorVaultAccess ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded p-3 mb-4`}>
              <p className={`text-xs flex items-center ${hasSuccessorVaultAccess ? 'text-red-800' : 'text-amber-900'}`}>
                <AlertTriangle size={14} className="mr-2"/>
                {hasSuccessorVaultAccess
                  ? 'This information is encrypted and will only be transmitted to your designated Successor Trustee upon protocol activation.'
                  : 'Preview only. Upgrade to Dynasty to unlock vault access and editing.'}
              </p>
            </div>
             
             {[
               { key: 'masterPassword', label: 'Master Password', icon: Lock, sensitive: true },
               { key: 'bankPin', label: 'Bank PIN', icon: CreditCard, sensitive: true },
               { key: 'safeCombo', label: 'Safe Combination', icon: Lock, sensitive: true },
               { key: 'irsPin', label: 'IRS Identity PIN', icon: Shield, sensitive: true },
               { key: 'brokerageAcct', label: 'Brokerage Account', icon: Landmark, sensitive: true },
               { key: 'cryptoSeed', label: 'Crypto Seed Phrase', icon: Key, sensitive: true },
               { key: 'emergencyContact', label: 'Emergency Contact', icon: Phone, sensitive: false },
               { key: 'safeDepositBox', label: 'Safe Deposit Box', icon: FileArchive, sensitive: false },
               { key: 'insurancePolicy', label: 'Life Insurance Policy', icon: FileText, sensitive: false },
               { key: 'digitalVaultUrl', label: 'Digital Vault URL', icon: Globe, sensitive: false },
             ].map((item) => (
               <div key={item.key} className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200 hover:border-stone-300 transition">
                 <div className="flex items-center space-x-3 flex-1">
                   <item.icon size={16} className="text-stone-400" />
                   <div className="flex-1">
                     <p className="text-xs text-stone-500 uppercase font-bold">{item.label}</p>
                    {editingField === item.key && hasSuccessorVaultAccess ? (
                      <input 
                        type="text" 
                        value={vaultData[item.key]} 
                        onChange={(e) => handleEditField(item.key, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingField(null)}
                        autoFocus
                        className="w-full p-1 border border-racing-green rounded text-sm font-mono bg-white"
                      />
                    ) : (
                      <p className={`text-sm font-mono ${hasSuccessorVaultAccess ? (item.sensitive ? 'text-stone-600' : 'text-stone-800') : 'text-stone-500'}`}>
                        {hasSuccessorVaultAccess
                          ? item.sensitive
                            ? maskValue(vaultData[item.key], item.key)
                            : vaultData[item.key]
                          : maskPreviewValue(vaultData[item.key], item.key)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {item.sensitive && hasSuccessorVaultAccess && (
                    <button 
                      onClick={() => toggleReveal(item.key)} 
                      className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition"
                      title={revealedFields[item.key] ? 'Hide' : 'Reveal'}
                    >
                      {revealedFields[item.key] ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  )}
                  {hasSuccessorVaultAccess && (
                    <button 
                      onClick={() => setEditingField(item.key)} 
                      className="p-2 text-stone-400 hover:text-racing-green hover:bg-stone-100 rounded transition"
                      title="Edit"
                    >
                      <Settings size={14}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
             
            <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
              <p className="text-xs text-stone-400">Last updated: Today, 10:42 AM</p>
              <button className={`px-4 py-2 rounded font-bold text-sm transition flex items-center ${hasSuccessorVaultAccess ? 'bg-stone-800 text-white hover:bg-stone-900' : 'bg-stone-200 text-stone-500 cursor-not-allowed'}`} disabled={!hasSuccessorVaultAccess}>
                <CheckCircle size={14} className="mr-2"/> Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
