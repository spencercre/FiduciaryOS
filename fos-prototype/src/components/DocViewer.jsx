import React from 'react';
import { FileText, X } from 'lucide-react';

export function DocViewer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50 rounded-t-lg"><div className="flex items-center space-x-2"><FileText size={20} className="text-racing-green"/><h3 className="font-serif font-bold text-lg">{doc.name}</h3></div><button onClick={onClose}><X size={24} className="text-stone-400 hover:text-stone-600"/></button></div>
        <div className="p-8 overflow-y-auto font-serif text-sm leading-loose whitespace-pre-wrap bg-[#fdfbf7] text-stone-800">{doc.content || "Document preview loaded from secure vault."}</div>
        <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-lg flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 font-bold text-sm">Close</button></div>
      </div>
    </div>
  );
}
