import React, { useState } from 'react';
import { Inbox, CheckCircle, ArrowRight, FileArchive, Shield } from 'lucide-react';

export function InboxPage({ emails, trusts, canAccessPrivileged, onTriage }) {
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const visibleFolders = canAccessPrivileged ? ['quarantine', 'public', 'privileged'] : ['public'];
  const streamFolder = canAccessPrivileged ? 'quarantine' : 'public';

  const visibleEmails = emails.filter((e) => visibleFolders.includes(e.folder || 'quarantine'));
  const streamEmails = visibleEmails.filter((e) => (e.folder || 'quarantine') === streamFolder);
  const selectedEmail = streamEmails.find((e) => e.id === selectedEmailId) || null;

  const getTrustName = (id) => trusts.find((t) => t.id === id || String(t.id) === String(id))?.name || "Unknown Trust";

  const handleTriage = (emailId, folder) => {
    if (onTriage) onTriage(emailId, folder);
    setSelectedEmailId(null);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fadeIn">
      <div className="md:w-1/3 flex flex-col bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden min-h-0">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <h2 className="font-bold text-stone-700 flex items-center font-serif">
            <Inbox size={18} className="mr-2" /> {canAccessPrivileged ? 'Quarantine Stream' : 'Public Inbox'}
          </h2>
          <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full font-serif">{streamEmails.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {streamEmails.length === 0 ? (
            <div className="p-8 text-center text-stone-400">
              <CheckCircle size={40} className="mx-auto mb-2 text-racing-green opacity-50" />
              <p className="font-serif">All caught up!</p>
            </div>
          ) : (
            streamEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${selectedEmailId === email.id ? 'bg-racing-green-light border-l-4 border-racing-green' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-stone-800 truncate w-2/3 font-serif">{email.sender}</span>
                  <span className="text-xs text-stone-400 font-serif">{email.date}</span>
                </div>
                <p className="text-sm font-medium text-stone-600 truncate mb-1 font-serif">{email.subject}</p>
                <p className="text-xs text-stone-400 font-serif italic">{getTrustName(email.trustId)}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="md:w-2/3 flex flex-col bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden relative min-h-0">
        {!selectedEmail ? (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-300 p-8 text-center">
            <ArrowRight size={48} className="mb-4 text-stone-200" />
            <h3 className="text-lg font-medium text-stone-400 font-serif">{canAccessPrivileged ? 'Select an item to classify' : 'Select an item to view'}</h3>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-stone-900 font-serif mb-4">{selectedEmail.subject}</h2>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold font-serif">{selectedEmail.sender[0].toUpperCase()}</div>
                <div>
                  <p className="font-bold text-stone-800 font-serif">{selectedEmail.sender}</p>
                  <p className="text-stone-400 font-serif italic">{getTrustName(selectedEmail.trustId)}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto text-stone-600 font-serif text-sm">{selectedEmail.body}</div>
            {canAccessPrivileged && (
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex space-x-3">
                <button onClick={() => handleTriage(selectedEmail.id, 'public')} className="flex-1 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold py-3 rounded shadow-sm font-serif flex items-center justify-center">
                  <FileArchive size={18} className="mr-2" /> File to Public Record
                </button>
                <button onClick={() => handleTriage(selectedEmail.id, 'privileged')} className="flex-1 bg-red-50 border border-red-200 hover:bg-red-100 text-red-900 font-bold py-3 rounded shadow-sm font-serif flex items-center justify-center">
                  <Shield size={18} className="mr-2" /> File to Privileged Zone
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
