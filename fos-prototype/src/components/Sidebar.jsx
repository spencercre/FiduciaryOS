import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, Activity, Inbox, Briefcase, BrainCircuit, Users, 
  BookOpen, ClipboardList, FileText, Hourglass, Settings, X 
} from 'lucide-react';
import { PrivilegeToggle } from './PrivilegeToggle';

export function Sidebar({ 
  isPrivileged, 
  setIsPrivileged, 
  canAccessPrivileged, 
  privilegeLocked, 
  untriagedCount, 
  isMobile, 
  isOpen, 
  setIsOpen 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity, path: '/' },
    { id: 'inbox', label: 'Context Inbox', icon: Inbox, path: '/inbox' },
    { id: 'trusts', label: 'My Trusts', icon: Briefcase, path: '/trusts' },
    { id: 'oracle', label: 'Fiduciary Mind', icon: BrainCircuit, path: '/oracle' },
    { id: 'meet-me', label: 'Meet-Me Room', icon: Users, path: '/meet-me' },
    { id: 'rolodex', label: 'Rolodex', icon: BookOpen, path: '/rolodex' },
    { id: 'tasks', label: 'Task Command', icon: ClipboardList, path: '/tasks' },
    { id: 'documents', label: 'Vault', icon: FileText, path: '/documents' },
    { id: 'legacy', label: 'Digital Successor', icon: Hourglass, path: '/legacy' },
    { id: 'admin', label: 'Admin Console', icon: Settings, path: '/admin', spacer: true }
  ];

  return (
    <div className={isMobile ? `fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : "w-64 bg-stone-900 text-stone-200 flex-shrink-0 min-h-screen sticky top-0 hidden md:flex flex-col border-r border-stone-800"}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="text-racing-green h-8 w-8 fill-current" />
          <span className="font-serif text-xl font-bold tracking-wide text-stone-100">FOS</span>
        </div>
        {isMobile && <button onClick={() => setIsOpen(false)} className="text-stone-400"><X size={24} /></button>}
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.spacer && <div className="h-px bg-stone-800 my-4"></div>}
            <NavLink 
              to={item.path} 
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 sidebar-link ${isActive ? 'active bg-racing-green text-white shadow-md' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'}`}
            >
              <item.icon size={18} />
              <span className="font-medium font-serif tracking-wide">{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>
      
      {/* SIDEBAR TOGGLE */}
      <div className="p-4 border-t border-stone-800 bg-stone-950">
        {privilegeLocked && (
          <div className="mb-3 text-[11px] text-stone-300 font-serif">
            Privileged mode locked: triage {untriagedCount} quarantine item{untriagedCount === 1 ? '' : 's'}.
          </div>
        )}
        <PrivilegeToggle 
          isPrivileged={isPrivileged} 
          setIsPrivileged={setIsPrivileged} 
          disabled={!canAccessPrivileged} 
          className="w-full justify-between p-3 border-stone-700 bg-stone-900" 
        />
      </div>
    </div>
  );
}
