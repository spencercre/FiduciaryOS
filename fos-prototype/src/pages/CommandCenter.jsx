import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gauge, CheckCircle, ChevronRight, AlertCircle, Clock, Shield, Key } from 'lucide-react';
import { MorningBriefing } from '../components/MorningBriefing';
import { SEED_TRUSTS, SEED_TASKS, INCOMING_EMAILS } from '../data/mockData';

export function CommandCenter({ onAnalyzeRisk }) {
    const navigate = useNavigate();
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    const displayTrusts = SEED_TRUSTS;
    
    // --- RISK RADAR LOGIC ---
    
    // 1. Compliance Watchdog (Overdue & Upcoming)
    const upcomingTasks = SEED_TASKS.filter(t => t.status !== 'done').slice(0, 4); // Just take top 4 for demo
    
    // 2. Beneficiary Sentiment (Mock Logic)
    const sentimentScore = 42; // Hostile (< 50)
    const sentimentStatus = sentimentScore < 50 ? 'Hostile' : sentimentScore < 80 ? 'Neutral' : 'Positive';
    // Secondary insights: last-7-days hostility sparkline + trigger sources
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
    });
    const hostilityByDay = last7Days.map(day =>
        INCOMING_EMAILS.filter(e => (e.date || '').includes(day) || day === new Date().toISOString().slice(0,10))
            .filter(e => String(e.sender).toLowerCase().includes('greg') || e.classification === 'needs_review')
            .length
    );
    const triggerCounts = INCOMING_EMAILS
        .filter(e => String(e.sender).toLowerCase().includes('greg') || e.classification === 'needs_review')
        .reduce((acc, e) => { const k = (e.sender || 'Unknown'); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
    const topTriggers = Object.entries(triggerCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);
    
    // 3. The Iron Key (Countdown)
    const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, mins: 32 });
    
    // Mock Countdown Timer Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.mins === 0) return { ...prev, mins: 59, hours: prev.hours - 1 };
                return { ...prev, mins: prev.mins - 1 };
            });
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const handleTrustClick = (id) => {
        navigate(`/trusts/${id}`);
    };

    return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* === RISK RADAR (3-COLUMN LAYOUT) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* COL 1: COMPLIANCE WATCHDOG */}
            <div className="walnut-card p-0 overflow-hidden flex flex-col h-auto border-t-4 border-racing-green">
                <div className="p-3 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-base text-stone-800 flex items-center">
                        <Shield size={18} className="mr-2 text-racing-green"/> Compliance Watchdog
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Next 30 Days</span>
                </div>
                <div className="p-3 space-y-2">
                    {upcomingTasks.map(task => {
                        const isOverdue = task.due === "Yesterday" || task.due.includes("Overdue");
                        const isUrgent = task.priority === "High";
                        
                        return (
                            <div key={task.id} role="button" onClick={() => navigate(`/compliance?highlight=${task.id}`)} className="flex items-center justify-between p-2 rounded-lg border border-stone-100 hover:bg-stone-50 hover:border-stone-200 cursor-pointer transition-colors group">
                                <div className="flex items-start space-x-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${isOverdue ? 'bg-red-600 animate-pulse' : isUrgent ? 'bg-orange-500' : 'bg-stone-300'}`}></div>
                                    <div>
                                        <p className={`text-sm font-bold ${isOverdue ? 'text-red-700' : 'text-stone-700 group-hover:text-racing-green'}`}>{task.title}</p>
                                        <p className="text-xs text-stone-400 font-serif">Trust #{task.trustId}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                    isOverdue 
                                        ? 'bg-red-50 text-red-700 border-red-100' 
                                        : task.due === 'Today' 
                                        ? 'bg-orange-50 text-orange-700 border-orange-100' 
                                        : 'bg-stone-100 text-stone-500 border-stone-200'
                                }`}>
                                    {isOverdue ? 'OVERDUE' : task.due}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="p-2 bg-stone-50 border-t border-stone-100 text-center">
                    <button onClick={() => navigate('/compliance')} className="text-xs font-bold text-stone-500 hover:text-racing-green uppercase tracking-wider flex items-center justify-center w-full">
                        View All Deadlines <ChevronRight size={12} className="ml-1"/>
                    </button>
                </div>
            </div>

            {/* COL 2: BENEFICIARY SENTIMENT RADAR */}
            <div className="walnut-card p-0 overflow-hidden flex flex-col h-auto border-t-4 border-amber-500">
                <div className="p-3 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-base text-stone-800 flex items-center">
                        <Gauge size={18} className="mr-2 text-amber-600"/> Sentiment Radar
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Live Analysis</span>
                </div>
                <div className="p-3 flex flex-col items-center justify-center text-center relative">
                    {/* Gauge Visual */}
                    <div className="relative w-40 h-20 overflow-hidden mb-3">
                        <div className="absolute top-0 left-0 w-full h-full bg-stone-200 rounded-t-full"></div>
                        <div 
                            className={`absolute top-0 left-0 w-full h-full rounded-t-full origin-bottom transition-transform duration-1000 ${
                                sentimentStatus === 'Hostile' ? 'bg-red-500' : sentimentStatus === 'Neutral' ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ transform: `rotate(${(sentimentScore / 100) * 180 - 180}deg)` }}
                        ></div>
                    </div>
                    
                    <div className="mb-3">
                        <div className="text-3xl font-serif font-bold text-stone-800">{sentimentScore}%</div>
                        <div className={`text-sm font-bold uppercase tracking-widest ${
                            sentimentStatus === 'Hostile' ? 'text-red-600' : 'text-stone-500'
                        }`}>
                            {sentimentStatus} Environment
                        </div>
                    </div>

                    {sentimentStatus === 'Hostile' && (
                        <button onClick={() => navigate('/inbox?highlight=hostile')} className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-full font-bold text-xs hover:bg-red-200 transition-colors animate-pulse">
                            <AlertCircle size={14} className="mr-2"/> Review Hostile Correspondence
                        </button>
                    )}
                    
                    {/* Mosaic removed per instruction; keep primary gauge only */}
                </div>
            </div>

            {/* COL 3: THE IRON KEY (DARK MODE) */}
            <div className="walnut-card p-0 overflow-hidden flex flex-col h-auto bg-stone-900 border-t-4 border-yellow-500 shadow-xl">
                <div className="p-3 border-b border-stone-800 bg-stone-950 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-base text-yellow-500 flex items-center">
                        <Key size={18} className="mr-2"/> The Iron Key
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Protocol Active</span>
                </div>
                <div className="p-3 flex flex-col justify-center items-center text-center">
                    <div className="mb-3">
                        <p className="text-stone-400 text-xs uppercase tracking-widest mb-2">Automated Handover In</p>
                        <div className="inline-block bg-stone-100 text-black px-3 py-1 rounded font-mono text-3xl font-bold tracking-widest">
                            {timeLeft.days}<span className="text-stone-600 mx-1">:</span>
                            {timeLeft.hours.toString().padStart(2, '0')}<span className="text-stone-600 mx-1">:</span>
                            {timeLeft.mins.toString().padStart(2, '0')}
                        </div>
                        <div className="flex justify-center space-x-4 mt-1 text-[10px] text-stone-600 uppercase font-bold">
                            <span className="w-8">Days</span><span className="w-8">Hrs</span><span className="w-8">Mins</span>
                        </div>
                    </div>
                    
                    {/* Secondary: Heartbeat Timeline mini-strip */}
                    <div className="w-full mb-3">
                        <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Heartbeat Timeline</div>
                        <div className="flex space-x-1">
                            {Array.from({length:7}).map((_,i)=>(
                                <div key={i} className={`h-2 w-6 rounded ${i%2===0 ? 'bg-emerald-500' : 'bg-stone-600'}`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full bg-stone-800 rounded p-3 border border-stone-700">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-stone-400">Heartbeat Status</span>
                            <span className="text-emerald-400 font-bold flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Verified</span>
                        </div>
                        {/* Warning Ladder */}
                        {(() => {
                            const target = new Date(); target.setDate(target.getDate()+30);
                            const fmt = (d) => d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
                            const d7 = new Date(target); d7.setDate(target.getDate()-7);
                            const d3 = new Date(target); d3.setDate(target.getDate()-3);
                            return (
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    <div className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200 rounded px-2 py-1 font-bold">7-Day {fmt(d7)}</div>
                                    <div className="text-[10px] bg-orange-100 text-orange-800 border border-orange-200 rounded px-2 py-1 font-bold">3-Day {fmt(d3)}</div>
                                    <div className="text-[10px] bg-red-100 text-red-800 border border-red-200 rounded px-2 py-1 font-bold">Day-Of {fmt(target)}</div>
                                </div>
                            );
                        })()}
                        <button onClick={() => navigate('/succession')} className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-stone-900 font-bold rounded uppercase tracking-wider text-xs transition-colors">
                            Manage Protocols
                        </button>
                    </div>
                </div>
            </div>
        
        </div>

        <MorningBriefing onAnalyzeRisk={onAnalyzeRisk} />

        <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Active Engagements</h2>
        <div className="grid gap-4">
            {displayTrusts.map((trust) => (
            <div key={trust.id} onClick={() => handleTrustClick(trust.id)} className="walnut-card cursor-pointer hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h3 className="font-bold text-stone-800 text-lg font-serif">{trust.name}</h3>
                        <ChevronRight size={20} className="text-racing-green ml-2"/>
                    </div>
                    <span className="text-sm text-stone-500 font-serif">{trust.situs}</span>
                </div>
            </div>
            ))}
        </div>
    </div>
    );
}
