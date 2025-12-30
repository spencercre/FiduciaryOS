import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Lock, Unlock, Shield } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

export function MainLayout({ 
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
  const navigate = useNavigate();

  return (
    <div className="bg-[#f5f5f0] font-sans text-stone-800 flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar 
          isPrivileged={isPrivileged} 
          setIsPrivileged={setIsPrivileged} 
          canAccessPrivileged={canAccessPrivileged} 
          privilegeLocked={privilegeLocked} 
          untriagedCount={untriagedCount} 
          isMobile={isMobile} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          onLogout={onLogout}
          isAuthenticated={isAuthenticated}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="hidden md:flex bg-white border-b border-stone-200 px-6 h-16 items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app')}>
              <div className="w-9 h-9 bg-[#183B56] rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="text-[#F5C26B] h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-[#183B56] leading-none">Fiduciary OS</span>
                <span className="text-[0.65rem] text-stone-500 uppercase tracking-widest font-semibold mt-0.5">Operating System</span>
              </div>
            </div>
          </div>

          <div className="md:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30">
            <button onClick={() => setIsOpen(true)} className="text-stone-600 font-bold"><Menu/></button>
            <span className="font-serif text-lg font-bold text-stone-900">FOS</span>
            <div className="w-6 text-xl">{isPrivileged ? <Lock size={18}/> : <Unlock size={18}/>}</div>
          </div>
          
          <main className="p-4 md:p-8 w-full pb-20">
            <div className="max-w-6xl mx-auto">
               <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
