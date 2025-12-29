import React, { useState } from 'react';
import { Globe, ChevronDown, AlertTriangle, AlertOctagon } from 'lucide-react';

export function JurisdictionWatchdog({ trust }) {
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 shadow-sm mb-4 rounded-r">
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <Globe className="text-orange-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="text-orange-900 font-bold text-sm font-serif">Jurisdiction Watchdog: Tax Nexus Alert</h3>
                        <p className="text-orange-800 text-sm mt-1 font-serif">
                            You are administering a <strong>{trust.situs}</strong> trust from <strong>California</strong>. 
                            This may trigger CA state income tax.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="text-orange-600 hover:text-orange-800 text-xs font-bold flex items-center ml-4 flex-shrink-0"
                >
                    {expanded ? 'Less' : 'Learn More'}
                    <ChevronDown size={14} className={`ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}/>
                </button>
            </div>
            
            {expanded && (
                <div className="mt-4 pt-4 border-t border-orange-200 animate-fadeIn">
                    <div className="bg-white rounded p-4 border border-orange-100">
                        <h4 className="font-bold text-orange-900 text-sm mb-3 flex items-center">
                            <AlertTriangle size={14} className="mr-2"/>
                            Understanding Tax Nexus: It's About Activities, Not Location
                        </h4>
                        <p className="text-xs text-orange-700 mb-3">
                            California may tax a trust's income if "sufficient nexus" exists. Nexus is determined by 
                            the <strong>activities performed</strong> in California, not simply where the trustee resides.
                        </p>
                        
                        <div className="space-y-2 text-xs">
                            <div className="p-2 bg-green-50 border border-green-200 rounded flex items-start">
                                <span className="text-green-700 font-bold mr-2 flex-shrink-0">✅ Safe in CA:</span>
                                <span className="text-green-600">Routine correspondence, reviewing statements, beneficiary communication</span>
                            </div>
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start">
                                <span className="text-yellow-700 font-bold mr-2 flex-shrink-0">⚠️ Caution:</span>
                                <span className="text-yellow-600">Investment decisions, distribution approvals, tax elections</span>
                            </div>
                            <div className="p-2 bg-red-50 border border-red-200 rounded flex items-start">
                                <span className="text-red-700 font-bold mr-2 flex-shrink-0">🚫 Delegate to NV:</span>
                                <span className="text-red-600">Signing trust documents, real estate transactions, court appearances</span>
                            </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800 flex items-start">
                            <AlertOctagon size={12} className="mr-2 mt-0.5 flex-shrink-0"/>
                            <span>
                                <strong>Disclaimer:</strong> This is educational guidance only and has not been reviewed by tax counsel. 
                                Consult with a qualified tax attorney for advice specific to your situation.
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-orange-500 italic">Track activity types in Billing → Quick Entry</span>
                        <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-bold">DEMO ONLY</span>
                    </div>
                </div>
            )}
        </div>
    );
}
