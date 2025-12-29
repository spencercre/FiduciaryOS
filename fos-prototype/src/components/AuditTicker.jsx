import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function AuditTicker() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem('auditEvents');
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : [
        { id: 1, text: 'User session active' },
        { id: 2, text: 'Context inbox triaged' },
        { id: 3, text: 'Timer entry recorded' }
      ];
    } catch {
      return [
        { id: 1, text: 'User session active' },
        { id: 2, text: 'Context inbox triaged' },
        { id: 3, text: 'Timer entry recorded' }
      ];
    }
  });
  const [start, setStart] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setStart(s => (s + 1) % Math.max(events.length, 1));
    }, 2500);
    return () => clearInterval(i);
  }, [events.length]);

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('auditEvents');
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed) && parsed.length) setEvents(parsed.slice(-10));
      } catch {}
    };
    window.addEventListener('storage', handler);
    const t = setInterval(handler, 2000);
    return () => { window.removeEventListener('storage', handler); clearInterval(t); };
  }, []);

  const visible = (() => {
    if (!events.length) return [];
    if (events.length < 3) return events.map((e, idx) => ({ ...e, key: `${e.id}-${idx}` }));
    return [0,1,2].map((i) => {
      const e = events[(start + i) % events.length];
      return { ...e, key: `${e.id}-${start}-${i}` };
    });
  })();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mt-2 p-3 border-t border-stone-800 bg-stone-950">
      <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Audit Log</div>
      <div className="space-y-1 overflow-hidden">
        {visible.map((e) => (
          <button key={e.key} onClick={() => navigate('/admin')} className="w-full flex items-center text-[12px] text-stone-300 hover:text-white transition">
            <Lock size={12} className="mr-2 text-stone-400" />
            <span className="truncate text-left">{e.text}</span>
          </button>
        ))}
      </div>
      <div className="mt-2">
        <button onClick={() => navigate('/audit-log')} className="text-[10px] text-stone-400 hover:text-stone-200 underline">View Full Audit Log →</button>
      </div>
      {false && showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 border-b bg-stone-100 text-stone-800 flex justify-between items-center">
              <span className="font-serif font-bold text-sm">Recent Audit Events</span>
              <button onClick={() => setShowModal(false)} className="text-stone-500 hover:text-stone-800 text-sm">Close</button>
            </div>
            <div className="p-3 overflow-y-auto max-h-[60vh] space-y-2">
              {(events.length ? events.slice(-20).reverse() : [{ id: 0, text: 'No recent events' }]).map((e, i) => (
                <div key={`${e.id}-${i}`} className="flex items-center text-sm">
                  <Lock size={14} className="mr-2 text-stone-500" />
                  <span className="text-stone-800">{e.text}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t bg-stone-50 flex justify-end">
              <button onClick={() => navigate('/admin')} className="px-3 py-2 bg-stone-800 text-white rounded text-xs font-bold">Open Admin Console</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
