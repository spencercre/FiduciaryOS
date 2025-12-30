import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export function AuditLog() {
  const [events] = useState(() => {
    try {
      const raw = localStorage.getItem('auditEvents');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length) return parsed.slice(-500).reverse();

      const now = Date.now();
      const actor = localStorage.getItem('fos_demo_auth') === 'true' ? 'demo@fiduciary.os' : 'system';
      const seed = [
        { id: now - 7 * 60_000, timestamp: new Date(now - 7 * 60_000).toISOString(), actor, text: 'User session started' },
        { id: now - 6 * 60_000, timestamp: new Date(now - 6 * 60_000).toISOString(), actor, text: 'Demo mode enabled' },
        { id: now - 5 * 60_000, timestamp: new Date(now - 5 * 60_000).toISOString(), actor, text: 'Context Inbox triaged: privileged quarantine reviewed' },
        { id: now - 4 * 60_000, timestamp: new Date(now - 4 * 60_000).toISOString(), actor, text: 'Timer started' },
        { id: now - 3 * 60_000, timestamp: new Date(now - 3 * 60_000).toISOString(), actor, text: 'Timer stopped and entry recorded' },
        { id: now - 2 * 60_000, timestamp: new Date(now - 2 * 60_000).toISOString(), actor, text: 'Vault artifact indexed' },
        { id: now - 1 * 60_000, timestamp: new Date(now - 1 * 60_000).toISOString(), actor, text: 'Compliance roadmap updated' }
      ];
      localStorage.setItem('auditEvents', JSON.stringify(seed));
      return seed.slice(-500).reverse();
    } catch {
      return [];
    }
  });

  const formatTs = (ts) => {
    if (!ts) return '—';
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6">
        <div><h1 className="font-serif text-3xl font-bold text-stone-900">Audit Log</h1><p className="text-stone-500 font-serif italic">Immutable trail of recent system actions</p></div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => {
              try {
                const raw = localStorage.getItem('auditEvents');
                const parsed = raw ? JSON.parse(raw) : [];
                const rows = (Array.isArray(parsed) ? parsed : []).map(e => ({
                  timestamp: e.timestamp || '',
                  actor: e.actor || '',
                  text: e.text || ''
                }));
                const csv = ['timestamp,actor,action'].concat(rows.map(r => `"${r.timestamp}","${r.actor}","${r.text.replace(/"/g,'""')}"`)).join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'audit-log.csv';
                a.click();
                URL.revokeObjectURL(url);
              } catch (e) {
                void e;
              }
            }}
            className="px-4 py-2 bg-stone-800 text-white rounded font-bold text-sm shadow-md"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="walnut-card p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50">
          <div><h2 className="text-xl font-bold text-stone-900 font-serif">Recent Events</h2></div>
          <div className="text-xs text-stone-500 uppercase tracking-widest">Total {events.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-white">
                <th className="p-3 text-xs uppercase tracking-widest text-stone-500">Time</th>
                <th className="p-3 text-xs uppercase tracking-widest text-stone-500">Actor</th>
                <th className="p-3 text-xs uppercase tracking-widest text-stone-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-stone-400 font-serif text-center">No audit events found</td></tr>
              ) : events.map((e, i) => (
                <tr key={`${e.id || i}-${i}`} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-3 text-sm text-stone-600 font-serif">{formatTs(e.timestamp)}</td>
                  <td className="p-3 text-sm text-stone-600 font-serif">{e.actor || 'system'}</td>
                  <td className="p-3 text-sm text-stone-800 font-serif flex items-center"><Lock size={14} className="mr-2 text-stone-400"/>{e.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
