import React from 'react';
import { Lightbulb, AlertTriangle, AlertOctagon, Globe } from 'lucide-react';

function getGreeting() { 
  const h = new Date().getHours(); 
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening"; 
}

export function MorningBriefing({ onAnalyzeRisk, userName = "Larry" }) {
  const greeting = getGreeting();
  const daysUntil2026 = Math.ceil((new Date('2026-01-01') - new Date()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="walnut-card mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center"><Lightbulb className="mr-2 text-racing-green" size={24} />{greeting}, {userName}.</h2>
          <p className="text-stone-500 text-sm font-serif italic mt-1">Here is your practice briefing for today.</p>
        </div>
        <div className="mt-2 md:mt-0 px-3 py-1 bg-racing-green text-white text-xs font-bold rounded-full font-serif">3 Items Need Attention</div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-600 rounded-r-md">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={18} className="text-red-600" />
            <div>
              <p className="text-sm font-bold text-red-800 font-serif">Gregory Smith - Hostile Sentiment</p>
              <p className="text-xs text-red-600">Beneficiary correspondence requires review</p>
            </div>
          </div>
          <button onClick={() => onAnalyzeRisk('greg')} className="text-xs font-bold text-red-800 hover:underline">Review →</button>
        </div>
        <div className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md">
          <div className="flex items-center space-x-3">
            <AlertOctagon size={18} className="text-yellow-600" />
            <div>
              <p className="text-sm font-bold text-yellow-800 font-serif">2026 Tax Cliff - {daysUntil2026} Days</p>
              <p className="text-xs text-yellow-600">Estate tax exemption sunset approaching</p>
            </div>
          </div>
          <button onClick={() => onAnalyzeRisk('tax')} className="text-xs font-bold text-yellow-800 hover:underline">Analyze →</button>
        </div>
        <div className="flex items-center justify-between p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-md">
          <div className="flex items-center space-x-3">
            <Globe size={18} className="text-orange-600" />
            <div>
              <p className="text-sm font-bold text-orange-800 font-serif">Multi-State Nexus Alert</p>
              <p className="text-xs text-orange-600">Jenkins Estate (NV) administered from CA</p>
            </div>
          </div>
          <button onClick={() => onAnalyzeRisk('nexus')} className="text-xs font-bold text-orange-800 hover:underline">Check →</button>
        </div>
      </div>
    </div>
  );
}
