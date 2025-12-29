import React from 'react';

export function PrivilegeToggle({ isPrivileged, setIsPrivileged, className = "", disabled = false }) {
  return (
    <div className={`flex items-center space-x-3 rounded-full px-4 py-2 shadow-sm border transition-all ${className} ${disabled ? 'opacity-60' : ''} ${isPrivileged ? 'bg-red-50 border-red-200' : 'bg-racing-green-light border-racing-green'}`}>
        <span className={`text-xs font-bold font-serif ${isPrivileged ? 'text-red-800' : 'text-racing-green'}`}>{isPrivileged ? 'FIDUCIARY (Privileged)' : 'BENEFICIARY (Safe)'}</span>
        <label className={`toggle-switch ${isPrivileged ? 'toggle-red' : ''}`}>
          <input type="checkbox" className="toggle-checkbox" checked={isPrivileged} disabled={disabled} onChange={() => { if (!disabled) setIsPrivileged(!isPrivileged); }} />
          <span className="toggle-slider"></span>
        </label>
    </div>
  );
}
