import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gauge, CheckCircle, ChevronRight } from 'lucide-react';
import { MorningBriefing } from '../components/MorningBriefing';
import { SEED_TRUSTS } from '../data/mockData';

export function Dashboard({ onAnalyzeRisk }) {
    const navigate = useNavigate();
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    const displayTrusts = SEED_TRUSTS;
    const displayAUM = SEED_TRUSTS.reduce((sum, t) => sum + (t.assets || 0), 0);

    const handleTrustClick = (id) => {
        navigate(`/trusts/${id}`);
    };

    return (
    <div className="space-y-6 animate-fadeIn">
        {/* CEO STATS WITH FIDUCIARY SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
            <div className="walnut-card p-4 flex flex-col justify-between">
                 <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Total AUM</p>
                 <p className="text-2xl font-serif font-bold text-stone-900">{formatCurrency(displayAUM)}</p>
                 <div className="w-full bg-stone-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-racing-green h-full w-[70%]"></div></div>
            </div>
            <div className="walnut-card p-4 flex flex-col justify-between">
                 <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">YTD Fees</p>
                 <p className="text-2xl font-serif font-bold text-stone-900">$142,500</p>
                 <div className="w-full bg-stone-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-racing-green h-full w-[45%]"></div></div>
            </div>
            {/* LINKED PENDING ACTIONS CARD */}
            <div onClick={() => navigate('/tasks')} className="walnut-card p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all border-l-4 border-orange-400">
                 <div className="flex justify-between"><p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Pending Actions</p><ArrowRight size={14} className="text-stone-300"/></div>
                 <p className="text-2xl font-serif font-bold text-stone-900">8</p>
                 <p className="text-[10px] text-red-500 font-bold mt-1">2 High Priority</p>
            </div>
            {/* #3: FIDUCIARY SCORE CARD */}
            <div className="walnut-card p-4 flex flex-col justify-between border-t-4 border-racing-green">
                 <div className="flex justify-between items-start"><p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Fiduciary Score</p><Gauge size={14} className="text-racing-green"/></div>
                 <div className="flex items-baseline space-x-1"><span className="text-3xl font-serif font-bold text-racing-green">87</span><span className="text-stone-400 text-sm">/100</span></div>
                 <div className="w-full bg-stone-100 h-2 mt-1 rounded-full overflow-hidden"><div className="bg-racing-green h-full rounded-full" style={{width: '87%'}}></div></div>
                 <p className="text-[10px] text-racing-green font-bold mt-1">Excellent Standing</p>
            </div>
            {/* FIDUCIARY STATUS CARD */}
            <div className="walnut-card p-4 flex flex-col justify-between border-none" style={{ backgroundColor: '#004225', color: 'white' }}>
                 <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#e5f0eb' }}>Fiduciary Status</p>
                 <div className="flex items-center"><CheckCircle size={20} className="mr-2 text-white"/><span className="text-xl font-bold">Active</span></div>
                 <p className="text-[10px] mt-1" style={{ color: '#e5f0eb' }}>Next check-in: 28 days</p>
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
