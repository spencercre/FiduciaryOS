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
    } catch (e) {
      void e;
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
      } catch (e) {
        void e;
      }
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
  return (
    <div className="mt-2 p-3 border-t border-stone-800 bg-stone-950">
      <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Audit Log</div>
      <div className="space-y-1 overflow-hidden">
        {visible.map((e) => (
          <button key={e.key} onClick={() => navigate('/app/admin')} className="w-full flex items-center text-[12px] text-stone-300 hover:text-white transition">
            <Lock size={12} className="mr-2 text-stone-400" />
            <span className="truncate text-left">{e.text}</span>
          </button>
        ))}
      </div>
      <div className="mt-2">
        <button onClick={() => navigate('/app/audit-log')} className="text-[10px] text-stone-400 hover:text-stone-200 underline">View Full Audit Log →</button>
      </div>
    </div>
  );
}
