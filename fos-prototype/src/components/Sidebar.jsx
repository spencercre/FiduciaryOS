import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Shield, Activity, Inbox, Briefcase, BrainCircuit, Users, 
  BookOpen, ClipboardList, FileText, Hourglass, Settings, X, LogOut 
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
  setIsOpen,
  onLogout,
  isAuthenticated
}) {
  const menuItems = [
    { id: 'command-center', label: 'Command Center', icon: Activity, path: '/app', end: true },
    { id: 'inbox', label: 'Context Inbox', icon: Inbox, path: '/app/inbox' },
    { id: 'trusts', label: 'My Trusts', icon: Briefcase, path: '/app/trusts' },
    { id: 'oracle', label: 'Fiduciary Mind', icon: BrainCircuit, path: '/app/oracle' },
    { id: 'meet-me', label: 'Meet-Me Room', icon: Users, path: '/app/meet-me' },
    { id: 'rolodex', label: 'Rolodex', icon: BookOpen, path: '/app/rolodex' },
    { id: 'compliance-roadmap', label: 'Compliance Roadmap', icon: ClipboardList, path: '/app/compliance' },
    { id: 'the-vault', label: 'The Vault', icon: FileText, path: '/app/vault' },
    { id: 'succession-protocol', label: 'Succession Protocol', icon: Hourglass, path: '/app/succession' },
    { id: 'admin', label: 'Admin Console', icon: Settings, path: '/app/admin', spacer: true }
  ];

  return (
    <div className={isMobile ? `fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : "w-64 bg-stone-900 text-stone-200 flex-shrink-0 h-screen sticky top-0 hidden md:flex flex-col border-r border-stone-800 overflow-y-auto"}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="text-racing-green h-8 w-8 fill-current" />
          <span className="font-serif text-xl font-bold tracking-wide text-stone-100">FOS</span>
        </div>
        {isMobile && <button onClick={() => setIsOpen(false)} className="text-stone-400"><X size={24} /></button>}
      </div>
      
      <nav className="px-4 space-y-2 mt-4 mb-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.spacer && <div className="h-px bg-stone-800 my-4"></div>}
            <NavLink 
              to={item.path} 
              end={!!item.end}
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
        
        <div className="mt-3 text-center">
          <Link to="/app/audit-log" className="text-[10px] text-stone-500 hover:text-stone-300 underline font-serif">View Full Audit Log</Link>
        </div>

        {isAuthenticated && (
          <div className="mt-4 pt-4 border-t border-stone-800">
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-stone-500 hover:text-red-400 hover:bg-stone-900 rounded transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="font-serif font-bold">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
