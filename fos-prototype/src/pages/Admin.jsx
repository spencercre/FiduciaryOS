import React, { useState } from 'react';
import { 
  Settings, Sparkles, Loader, CheckCircle, History, FileText, Shield, 
  BrainCircuit, Hourglass, Globe, Scale, Key, EyeOff, Eye, AlertTriangle, 
  CreditCard, Lock, Landmark, Phone, FileArchive 
} from 'lucide-react';

export function Admin() {
  const [selectedTier, setSelectedTier] = useState('pro');
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
  const [modules, setModules] = useState([
    { id: 'core', label: 'Core Ledger & Vault', tiers: ['standard', 'pro', 'dynasty'], icon: FileText, enabled: true },
    { id: 'privilege', label: 'Privilege Firewall', tiers: ['standard', 'pro', 'dynasty'], icon: Shield, enabled: true }, 
    { id: 'oracle', label: 'AI Fiduciary Mind', tiers: ['pro', 'dynasty'], icon: BrainCircuit, enabled: true }, 
    { id: 'legacy', label: 'Digital Successor Protocol', tiers: ['dynasty'], icon: Hourglass, enabled: false }, 
    { id: 'audit', label: 'Court-Ready Audit Logs', tiers: ['pro', 'dynasty'], icon: History, enabled: true }, 
    { id: 'nexus', label: 'Multi-State Nexus Watchdog', tiers: ['dynasty'], icon: Globe, enabled: false }, 
    { id: 'accounting', label: 'Court Accounting Engine', tiers: ['pro', 'dynasty'], icon: Scale, enabled: true }
  ]);

  const toggleModule = (id) => {
      setModules(modules.map(m => m.id === id ? {...m, enabled: !m.enabled} : m));
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
    
    // Logic: Define feature sets for each tier
    const features = {
      standard: ['core'],
      pro: ['core', 'privilege', 'oracle', 'audit', 'accounting'],
      dynasty: ['core', 'privilege', 'oracle', 'legacy', 'audit', 'nexus', 'accounting']
    };

    const activeFeatures = features[tier] || [];

    setModules(prevModules => prevModules.map(mod => ({
      ...mod,
      enabled: activeFeatures.includes(mod.id)
    })));
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
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['standard', 'pro', 'dynasty'].map(tier => (<div key={tier} onClick={() => handleTierSelect(tier)} className={`walnut-card cursor-pointer transition-all ${selectedTier === tier ? 'border-yellow-500 ring-2 ring-yellow-500 bg-stone-50' : 'opacity-60 hover:opacity-100'}`}><h3 className="font-serif font-bold text-xl text-stone-800 capitalize">{tier}</h3><div className="text-2xl font-bold text-racing-green mb-1">${tier === 'standard' ? 150 : tier === 'pro' ? 250 : 450}<span className="text-sm text-stone-500 font-normal">/mo</span></div></div>))}</div>
       
       <div className="walnut-card"><h3 className="font-serif font-bold text-lg text-stone-800 mb-6 border-b border-stone-100 pb-2">Feature Flags</h3>
       <div className="space-y-4">
           {modules.map((mod) => (
               <div key={mod.id} className={`flex items-center justify-between p-4 rounded border ${mod.enabled ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
                   <div className="flex items-center space-x-4">
                       <div className={`p-2 rounded ${mod.enabled ? 'bg-racing-green-light text-racing-green' : 'bg-stone-200 text-stone-400'}`}><mod.icon size={20} /></div>
                       <div><p className={`font-bold text-sm ${mod.enabled ? 'text-stone-800' : 'text-stone-400'}`}>{mod.label}</p></div>
                   </div>
                   <div>
                       <label className="toggle-switch">
                           <input type="checkbox" className="toggle-checkbox" checked={mod.enabled} onChange={() => toggleModule(mod.id)} />
                           <span className="toggle-slider"></span>
                       </label>
                   </div>
               </div>
           ))}
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
             </div>
           </div>
           <button 
             onClick={() => setShowSuccessorVault(!showSuccessorVault)} 
             className="px-4 py-2 bg-stone-100 text-stone-700 rounded font-bold text-sm flex items-center hover:bg-stone-200 transition"
           >
             {showSuccessorVault ? <EyeOff size={16} className="mr-2"/> : <Eye size={16} className="mr-2"/>}
             {showSuccessorVault ? 'Hide Vault' : 'Access Vault'}
           </button>
         </div>
         
         {showSuccessorVault && (
           <div className="space-y-3 animate-fadeIn">
             <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
               <p className="text-xs text-red-800 flex items-center"><AlertTriangle size={14} className="mr-2"/> This information is encrypted and will only be transmitted to your designated Successor Trustee upon protocol activation.</p>
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
                     {editingField === item.key ? (
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
                       <p className={`text-sm font-mono ${item.sensitive ? 'text-stone-600' : 'text-stone-800'}`}>
                         {item.sensitive ? maskValue(vaultData[item.key], item.key) : vaultData[item.key]}
                       </p>
                     )}
                   </div>
                 </div>
                 <div className="flex items-center space-x-1">
                   {item.sensitive && (
                     <button 
                       onClick={() => toggleReveal(item.key)} 
                       className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition"
                       title={revealedFields[item.key] ? 'Hide' : 'Reveal'}
                     >
                       {revealedFields[item.key] ? <EyeOff size={14}/> : <Eye size={14}/>}
                     </button>
                   )}
                   <button 
                     onClick={() => setEditingField(item.key)} 
                     className="p-2 text-stone-400 hover:text-racing-green hover:bg-stone-100 rounded transition"
                     title="Edit"
                   >
                     <Settings size={14}/>
                   </button>
                 </div>
               </div>
             ))}
             
             <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
               <p className="text-xs text-stone-400">Last updated: Today, 10:42 AM</p>
               <button className="px-4 py-2 bg-stone-800 text-white rounded font-bold text-sm hover:bg-stone-900 transition flex items-center">
                 <CheckCircle size={14} className="mr-2"/> Save Changes
               </button>
             </div>
           </div>
         )}
       </div>
    </div>
  );
}
