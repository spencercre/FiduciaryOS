import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { DOCUMENTS } from '../data/mockData';
import { DocViewer } from '../components/DocViewer';

export function Documents() {
    const [viewDoc, setViewDoc] = useState(null);
    const publicDocs = DOCUMENTS.filter(d => d.type === 'public');
    
    return (
      <>
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Permanent Vault</h1><p className="text-stone-500 font-serif italic">Finalized & Archived Records (Read-Only)</p></div></div>
          <div className="walnut-card rounded-lg overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-wider font-serif"><div className="col-span-4">Document Name</div><div className="col-span-3">Trust Context</div><div className="col-span-2">Date</div><div className="col-span-3 text-right">Action</div></div>
            <div className="divide-y divide-stone-100">{publicDocs.map((doc) => (<div key={doc.id} className="p-4 flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-stone-50 transition-colors"><div className="flex items-center space-x-3 lg:col-span-4 w-full min-w-0"><div className="flex-shrink-0 p-2 rounded-md bg-stone-100 text-stone-600"><FileText size={18} /></div><div className="min-w-0 flex-1"><p className="text-sm font-serif truncate text-stone-800 font-medium">{doc.name}</p></div></div><div className="lg:col-span-3 text-xs font-bold text-stone-500 uppercase tracking-wide">{doc.trustName || "Smith Family Trust"}</div><div className="hidden lg:block lg:col-span-2 text-sm text-stone-600 font-serif">{doc.date}</div><div className="lg:col-span-3 text-right mt-1 lg:mt-0"><button onClick={() => setViewDoc(doc)} className="text-stone-400 hover:text-stone-800 transition-colors font-serif text-sm w-full lg:w-auto text-left lg:text-right">View Archive</button></div></div>))}</div>
          </div>
        </div>
        {viewDoc && <DocViewer doc={viewDoc} onClose={() => setViewDoc(null)} />}
      </>
    );
}
