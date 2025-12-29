import React, { useState } from 'react';
import { Mail, Phone, AlertTriangle, AlertOctagon, CheckCircle, Activity, UserCheck, Key, Clock, History } from 'lucide-react';
import { SuccessorNotificationPreviewModal } from '../components/SuccessorNotificationPreviewModal';

export function SuccessionProtocol() {
    const [showConfig, setShowConfig] = useState(false);
    const [showNotificationPreview, setShowNotificationPreview] = useState(null); // '7day', '3day', 'dayof'
    
    // SMOKE_AND_MIRRORS: Simulated warning configuration (not persisted)
    const [warningConfig, setWarningConfig] = useState({
        inactivityDays: 30,
        successorEmail: 'sarah@jenkinslaw.com',
        successorPhone: '(555) 123-4567',
        enable7DayEmail: true,
        enable3DayEmail: true,
        enable3DaySMS: true,
        enableDayOfEmail: true,
        enableDayOfSMS: true,
        require2FA: true
    });
    
    // SMOKE_AND_MIRRORS: Simulated notification history (fake data)
    const notificationHistory = [
        { id: 1, date: 'Nov 15, 2025', type: 'Heartbeat Reset', channel: 'Login', status: 'success' },
        { id: 2, date: 'Oct 18, 2025', type: '7-Day Warning', channel: 'Email', status: 'sent' },
        { id: 3, date: 'Oct 15, 2025', type: 'Heartbeat Reset', channel: 'Login', status: 'success' },
    ];
    
    // Calculate days remaining (simulated - always shows ~28 days from "last login")
    const daysRemaining = 28;
    const progressPercent = ((30 - daysRemaining) / 30) * 100;
    
    // Determine current warning level for in-app banner
    const getWarningLevel = () => {
        if (daysRemaining <= 1) return 'critical';
        if (daysRemaining <= 3) return 'urgent';
        if (daysRemaining <= 7) return 'warning';
        return 'safe';
    };
    const warningLevel = getWarningLevel();
    
    // Mock Countdown Timer Effect for Iron Key
    const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, mins: 32 });

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.mins === 0) return { ...prev, mins: 59, hours: prev.hours - 1 };
                return { ...prev, mins: prev.mins - 1 };
            });
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn relative">
             {showNotificationPreview && <SuccessorNotificationPreviewModal kind={showNotificationPreview} onClose={() => setShowNotificationPreview(null)} />}
             {showConfig && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                         <div className="p-6 border-b border-stone-200 bg-stone-50">
                             <h2 className="text-2xl font-serif font-bold text-stone-900">Configure Iron Key Protocols</h2>
                             <p className="text-sm text-stone-500 mt-1">Define triggers and warning notifications</p>
                         </div>
                         <div className="p-6 space-y-6">
                             {/* Basic Settings */}
                             <div className="space-y-4">
                                 <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide border-b pb-2">Trigger Settings</h3>
                                 <div>
                                     <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Inactivity Trigger (Days)</label>
                                     <input type="number" value={warningConfig.inactivityDays} onChange={(e) => setWarningConfig({...warningConfig, inactivityDays: parseInt(e.target.value)})} className="w-full p-2 border border-stone-300 rounded font-serif" />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Successor Trustee Email</label>
                                     <input type="email" value={warningConfig.successorEmail} onChange={(e) => setWarningConfig({...warningConfig, successorEmail: e.target.value})} className="w-full p-2 border border-stone-300 rounded font-serif" />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Successor Trustee Phone (for SMS)</label>
                                     <input type="tel" value={warningConfig.successorPhone} onChange={(e) => setWarningConfig({...warningConfig, successorPhone: e.target.value})} className="w-full p-2 border border-stone-300 rounded font-serif" placeholder="(555) 123-4567" />
                                 </div>
                             </div>
                             
                             {/* Warning Notifications - SMOKE_AND_MIRRORS */}
                             <div className="space-y-4">
                                 <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide border-b pb-2">Warning Notifications</h3>
                                 <p className="text-xs text-stone-500 italic">Configure escalating warnings before protocol activation</p>
                                 
                                 {/* 7-Day Warning */}
                                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                     <div className="flex justify-between items-start mb-2">
                                         <div>
                                             <p className="font-bold text-blue-900">7 Days Before</p>
                                             <p className="text-xs text-blue-700">Gentle reminder to log in</p>
                                         </div>
                                         <button onClick={() => setShowNotificationPreview('7day')} className="text-xs text-blue-600 hover:underline">Preview →</button>
                                     </div>
                                     <div className="flex items-center space-x-4">
                                         <label className="flex items-center space-x-2 text-sm">
                                             <input type="checkbox" checked={warningConfig.enable7DayEmail} onChange={(e) => setWarningConfig({...warningConfig, enable7DayEmail: e.target.checked})} />
                                             <Mail size={14} className="text-blue-600"/><span>Email</span>
                                         </label>
                                     </div>
                                 </div>
                                 
                                 {/* 3-Day Warning */}
                                 <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                     <div className="flex justify-between items-start mb-2">
                                         <div>
                                             <p className="font-bold text-orange-900">3 Days Before</p>
                                             <p className="text-xs text-orange-700">Firm warning - increased urgency</p>
                                         </div>
                                         <button onClick={() => setShowNotificationPreview('3day')} className="text-xs text-orange-600 hover:underline">Preview →</button>
                                     </div>
                                     <div className="flex items-center space-x-4">
                                         <label className="flex items-center space-x-2 text-sm">
                                             <input type="checkbox" checked={warningConfig.enable3DayEmail} onChange={(e) => setWarningConfig({...warningConfig, enable3DayEmail: e.target.checked})} />
                                             <Mail size={14} className="text-orange-600"/><span>Email</span>
                                         </label>
                                         <label className="flex items-center space-x-2 text-sm">
                                             <input type="checkbox" checked={warningConfig.enable3DaySMS} onChange={(e) => setWarningConfig({...warningConfig, enable3DaySMS: e.target.checked})} />
                                             <Phone size={14} className="text-orange-600"/><span>SMS</span>
                                         </label>
                                     </div>
                                 </div>
                                 
                                 {/* Day-Of Warning */}
                                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                     <div className="flex justify-between items-start mb-2">
                                         <div>
                                             <p className="font-bold text-red-900">Day Of Activation</p>
                                             <p className="text-xs text-red-700">Critical - final warning before trigger</p>
                                         </div>
                                         <button onClick={() => setShowNotificationPreview('dayof')} className="text-xs text-red-600 hover:underline">Preview →</button>
                                     </div>
                                     <div className="flex items-center space-x-4">
                                         <label className="flex items-center space-x-2 text-sm">
                                             <input type="checkbox" checked={warningConfig.enableDayOfEmail} onChange={(e) => setWarningConfig({...warningConfig, enableDayOfEmail: e.target.checked})} />
                                             <Mail size={14} className="text-red-600"/><span>Email</span>
                                         </label>
                                         <label className="flex items-center space-x-2 text-sm">
                                             <input type="checkbox" checked={warningConfig.enableDayOfSMS} onChange={(e) => setWarningConfig({...warningConfig, enableDayOfSMS: e.target.checked})} />
                                             <Phone size={14} className="text-red-600"/><span>SMS</span>
                                         </label>
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Security */}
                             <div className="flex items-center space-x-2 pt-2">
                                 <input type="checkbox" checked={warningConfig.require2FA} onChange={(e) => setWarningConfig({...warningConfig, require2FA: e.target.checked})} />
                                 <span className="text-sm text-stone-700">Require 2-Factor Confirmation from Successor</span>
                             </div>
                         </div>
                         <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
                             <p className="text-xs text-amber-600 flex items-center"><AlertTriangle size={12} className="mr-1"/> DEMO: Settings not persisted</p>
                             <div className="flex space-x-2">
                                 <button onClick={() => setShowConfig(false)} className="px-4 py-2 text-stone-600 font-bold text-sm">Cancel</button>
                                 <button onClick={() => setShowConfig(false)} className="px-6 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded shadow-md">Save Protocols</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
             
             {/* IN-APP WARNING BANNER - Shows based on days remaining */}
             {warningLevel !== 'safe' && (
                 <div className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
                     warningLevel === 'critical' ? 'bg-red-100 border-red-600' :
                     warningLevel === 'urgent' ? 'bg-orange-100 border-orange-500' :
                     'bg-yellow-50 border-yellow-500'
                 }`}>
                     <div className="flex items-center space-x-3">
                         <AlertTriangle size={24} className={warningLevel === 'critical' ? 'text-red-600' : warningLevel === 'urgent' ? 'text-orange-600' : 'text-yellow-600'} />
                         <div>
                             <p className={`font-bold ${
                                 warningLevel === 'critical' ? 'text-red-900' :
                                 warningLevel === 'urgent' ? 'text-orange-900' :
                                 'text-yellow-900'
                             }`}>
                                 {warningLevel === 'critical' ? '🚨 CRITICAL: Protocol activates TODAY!' :
                                  warningLevel === 'urgent' ? 'URGENT: Protocol activates in ' + daysRemaining + ' days' :
                                  'Warning: Protocol activates in ' + daysRemaining + ' days'}
                             </p>
                             <p className={`text-sm ${
                                 warningLevel === 'critical' ? 'text-red-700' :
                                 warningLevel === 'urgent' ? 'text-orange-700' :
                                 'text-yellow-700'
                             }`}>Your login today has reset the countdown. This banner is for demonstration.</p>
                         </div>
                     </div>
                     <button className={`px-4 py-2 rounded font-bold text-sm ${
                         warningLevel === 'critical' ? 'bg-red-600 text-white' :
                         warningLevel === 'urgent' ? 'bg-orange-500 text-white' :
                         'bg-yellow-500 text-white'
                     }`}>Verify Now</button>
                 </div>
             )}
             
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Succession Protocol</h1><p className="text-stone-500 font-serif italic">"The Dead Man's Switch"</p></div><div className="px-4 py-2 bg-racing-green-light rounded-md border border-racing-green text-racing-green text-sm font-serif flex items-center"><CheckCircle size={16} className="mr-2"/><span className="font-bold">Status:</span>&nbsp;ARMED & MONITORING</div></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="walnut-card relative overflow-hidden"><div className="absolute top-0 left-0 w-1 h-full bg-racing-green"></div><div className="flex justify-between items-start mb-4"><h3 className="font-serif text-xl font-bold text-stone-800">Fiduciary Heartbeat</h3><Activity className="text-racing-green" size={24} /></div><div className="flex items-center space-x-4 mb-6"><div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-4 border-racing-green"><UserCheck size={32} className="text-racing-green" /></div><div><p className="text-sm text-stone-500 uppercase tracking-widest font-bold">Last Verification</p><p className="text-2xl font-serif font-bold text-stone-900">Today, 10:42 AM</p></div></div><div className="bg-stone-50 p-4 rounded border border-stone-200"><div className="flex justify-between text-sm mb-1"><span className="text-stone-600">Inactivity Trigger</span><span className="text-red-600 font-bold">{warningConfig.inactivityDays} Days</span></div><div className="w-full bg-stone-200 rounded-full h-2"><div className="bg-racing-green h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div></div><p className="text-xs text-stone-400 mt-2">If no login by <span className="font-bold">Jan 28, 2026</span>, protocol initiates.</p></div></div>
                <div className="bg-stone-900 p-6 rounded-lg shadow-lg text-stone-300">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-xl font-bold text-white">The Iron Key</h3>
                        <Key className="text-amber-500" size={24} />
                    </div>
                    
                    <div className="mb-6 text-center">
                         <p className="text-stone-500 text-xs uppercase tracking-widest mb-2">Automated Handover In</p>
                         <div className="font-mono text-3xl text-white font-bold tracking-widest">
                             {timeLeft.days}<span className="text-stone-600 mx-1">:</span>
                             {timeLeft.hours}<span className="text-stone-600 mx-1">:</span>
                             {timeLeft.mins.toString().padStart(2, '0')}
                         </div>
                         <div className="flex justify-center space-x-4 mt-1 text-[10px] text-stone-600 uppercase font-bold">
                             <span className="w-8">Days</span><span className="w-8">Hrs</span><span className="w-8">Mins</span>
                         </div>
                    </div>

                    <p className="text-sm mb-6 leading-relaxed">Upon confirmed incapacity, the <strong>Master Encryption Key</strong> will be securely transmitted.</p>
                    <div className="space-y-3">
                        <div className="flex items-center p-3 bg-stone-800 rounded border border-stone-700">
                            <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-white font-bold font-serif mr-3">1</div>
                            <div><p className="text-sm font-bold text-white">Primary Successor</p><p className="text-xs text-stone-400">Sarah Jenkins (Partner)</p></div>
                            <CheckCircle size={16} className="text-racing-green ml-auto" />
                        </div>
                        <div className="flex items-center p-3 bg-stone-800/50 rounded border border-stone-700/50">
                            <div className="w-8 h-8 rounded-full bg-stone-700/50 flex items-center justify-center text-stone-400 font-bold font-serif mr-3">2</div>
                            <div><p className="text-sm font-bold text-stone-400">Secondary Successor</p><p className="text-xs text-stone-500">U.S. Bank Corporate Trust · (800) 934-6802</p></div>
                            <Clock size={16} className="text-stone-500 ml-auto" />
                        </div>
                    </div>
                    <button onClick={() => setShowConfig(true)} className="w-full mt-6 py-3 border border-stone-600 rounded text-stone-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Configure Protocols</button>
                </div>
             </div>
             
             {/* Notification History */}
             <div className="walnut-card">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center"><History size={20} className="mr-2 text-stone-400"/> Notification History</h3>
                     <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">DEMO DATA</span>
                 </div>
                 <div className="space-y-2">
                     {notificationHistory.map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-100">
                             <div className="flex items-center space-x-3">
                                 <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-racing-green' : 'bg-blue-500'}`}></div>
                                 <div>
                                     <p className="text-sm font-bold text-stone-800">{item.type}</p>
                                     <p className="text-xs text-stone-500">{item.date} via {item.channel}</p>
                                 </div>
                             </div>
                             <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                 {item.status === 'success' ? 'Reset' : 'Sent'}
                             </span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
}
