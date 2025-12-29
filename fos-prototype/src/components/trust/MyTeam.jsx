import React from 'react';
import { Users, Mail, Phone } from 'lucide-react';
import { SEED_VENDORS } from '../../data/mockData';

export function MyTeam({ trustId }) {
  // Get vendors engaged on this trust (using numeric ID matching)
  // Ensure trustId is treated as a number for comparison, and handle potential string/number mismatches in data
  const targetId = Number(trustId);
  const teamMembers = SEED_VENDORS.filter(v => {
    return v.engagedOn.some(id => Number(id) === targetId);
  });
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900">My Team</h2>
          <p className="text-stone-500 text-sm font-serif italic">Professionals engaged on this trust</p>
        </div>
        <span className="text-xs bg-racing-green-light text-racing-green px-3 py-1 rounded-full font-bold">{teamMembers.length} Members</span>
      </div>
      
      {teamMembers.length === 0 ? (
        <div className="walnut-card p-8 text-center">
          <Users size={40} className="mx-auto mb-3 text-stone-300" />
          <p className="text-stone-500 font-serif">No professionals assigned to this trust yet.</p>
          <button className="mt-4 px-4 py-2 bg-racing-green text-white rounded font-bold text-sm">Add Team Member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="walnut-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-racing-green-light flex items-center justify-center font-bold font-serif text-racing-green text-lg border-2 border-racing-green">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 font-serif">{member.name}</h3>
                    <p className="text-xs text-stone-500 font-serif italic">{member.firm}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{member.status}</span>
              </div>
              
              <div className="bg-stone-50 rounded p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-500 uppercase font-bold">Role</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    member.role.includes('Attorney') ? 'bg-red-100 text-red-800' :
                    member.role.includes('CPA') ? 'bg-blue-100 text-blue-800' :
                    member.role.includes('Appraiser') ? 'bg-purple-100 text-purple-800' :
                    'bg-stone-100 text-stone-700'
                  }`}>{member.role}</span>
                </div>
                {member.rates && member.rates[0] && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 uppercase font-bold">Rate</span>
                    <span className="text-sm font-mono font-bold text-stone-800">${member.rates[0].rate}/hr</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <a href={`mailto:${member.email}`} className="flex items-center text-racing-green hover:underline">
                  <Mail size={14} className="mr-1" /> Email
                </a>
                <a href={`tel:${member.phone}`} className="flex items-center text-racing-green hover:underline">
                  <Phone size={14} className="mr-1" /> Call
                </a>
              </div>
              
              {member.notes && (
                <p className="mt-3 text-xs text-stone-500 italic border-t border-stone-100 pt-3">
                  "{member.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
