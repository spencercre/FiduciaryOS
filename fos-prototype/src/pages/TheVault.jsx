import React, { useState } from 'react';
import { FileText, Shield, Lock } from 'lucide-react';
import { DOCUMENTS } from '../data/mockData';
import { DocViewer } from '../components/DocViewer';

export function TheVault() {
    const [viewDoc, setViewDoc] = useState(null);
    const publicDocs = DOCUMENTS.filter(d => d.type === 'public');
    const getIcon = (doc) => {
      if (doc.type === 'privileged' || doc.subtype === 'admin_work_product') return Lock;
      if (doc.type === 'public') return Shield;
      return FileText;
    };
    const getSeal = (doc) => {
      return doc.subtype === 'admin_work_product';
    };
    
    return (
      <>
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h1 className="font-serif text-3xl font-bold text-stone-900">The Vault</h1><p className="text-stone-500 font-serif italic">Finalized & Archived Records (Read-Only)</p></div></div>
          
          <div className="walnut-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicDocs.map((doc) => {
                const Icon = getIcon(doc);
                const showSeal = getSeal(doc);
                return (
                  <div key={doc.id} className="rounded border border-stone-200 shadow-sm hover:shadow-md transition overflow-hidden">
                    <div style={{height:'6px', backgroundImage:'linear-gradient(90deg, #e7e0c4, #b79e56)'}}></div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 rounded bg-stone-100 text-stone-700"><Icon size={16} /></div>
                          <p className="font-serif font-bold text-stone-800 truncate">{doc.name}</p>
                        </div>
                        {showSeal && (
                          <div className="w-6 h-6 rounded-full bg-red-600/80 border border-red-700 shadow-inner flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">SEAL</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">{doc.trustName || "Smith Family Trust"}</div>
                      <div className="text-xs text-stone-600 font-mono">{doc.date}</div>
                      <div className="mt-3 text-right">
                        <button onClick={() => setViewDoc(doc)} className="px-3 py-1 bg-stone-800 text-white rounded text-xs font-bold shadow-sm hover:bg-stone-900">Open Archive</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {viewDoc && <DocViewer doc={viewDoc} onClose={() => setViewDoc(null)} />}
      </>
    );
}
