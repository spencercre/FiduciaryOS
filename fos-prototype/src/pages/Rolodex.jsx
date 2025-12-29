import React, { useState } from 'react';
import { Filter, Plus, Settings, Briefcase as BriefcaseIcon, Mail, Phone, ChevronUp, ChevronDown, Map, AlignLeft, BadgeCheck } from 'lucide-react';
import { SEED_TRUSTS } from '../data/mockData';
import { VendorModal } from '../components/VendorModal';

export function Rolodex({ vendors, trusts = [] }) {
  const getTrustNames = (ids) => {
    return ids.map(id => {
      const seedTrust = SEED_TRUSTS.find(t => t.id === id);
      if (seedTrust) return seedTrust.name;
      const firestoreTrust = trusts.find(t => String(t.id) === String(id));
      return firestoreTrust?.name;
    }).filter(Boolean);
  };
  
  const [expandedId, setExpandedId] = useState(null);
  const [localVendors, setLocalVendors] = useState(vendors);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [isNewVendor, setIsNewVendor] = useState(false);
  
  const emptyVendor = { id: null, name: '', firm: '', role: 'Attorney', phone: '', email: '', address: '', notes: '', status: 'Active', engagedOn: [], rates: [{ type: 'Standard', rate: 250 }] };
  
  const handleEditClick = (vendor) => { setEditingVendor({ ...vendor, rates: vendor.rates ? [...vendor.rates] : [{ type: 'Standard', rate: vendor.rate || 250 }] }); setIsNewVendor(false); setShowModal(true); };
  const handleAddClick = () => { setEditingVendor({ ...emptyVendor, id: Date.now() }); setIsNewVendor(true); setShowModal(true); };
  const handleSave = () => {
    if (isNewVendor) { setLocalVendors(prev => [...prev, editingVendor]); }
    else { setLocalVendors(prev => prev.map(v => v.id === editingVendor.id ? editingVendor : v)); }
    setShowModal(false); setEditingVendor(null);
  };
  const handleFieldChange = (field, value) => { setEditingVendor(prev => ({ ...prev, [field]: value })); };
  const handleRateChange = (index, field, value) => {
    setEditingVendor(prev => {
      const newRates = [...prev.rates];
      newRates[index] = { ...newRates[index], [field]: field === 'rate' ? Number(value) : value };
      return { ...prev, rates: newRates };
    });
  };
  const addRate = () => { setEditingVendor(prev => ({ ...prev, rates: [...prev.rates, { type: '', rate: 0 }] })); };
  const removeRate = (index) => { setEditingVendor(prev => ({ ...prev, rates: prev.rates.filter((_, i) => i !== index) })); };

  return (
    <div className="space-y-6 animate-fadeIn">
        {showModal && editingVendor && (
          <VendorModal
            isNewVendor={isNewVendor}
            editingVendor={editingVendor}
            onClose={() => { setShowModal(false); setEditingVendor(null); }}
            onSave={handleSave}
            onFieldChange={handleFieldChange}
            onRateChange={handleRateChange}
            onAddRate={addRate}
            onRemoveRate={removeRate}
          />
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6">
            <div><h1 className="font-serif text-3xl font-bold text-stone-900">Professional Directory</h1><p className="text-stone-500 font-serif italic">Your Ecosystem of Experts</p></div>
            <div className="flex space-x-2"><button className="flex items-center px-4 py-2 bg-white border border-stone-300 rounded text-stone-600 font-bold text-sm hover:bg-stone-50 transition"><Filter size={16} className="mr-2"/> Filter</button><button onClick={handleAddClick} className="flex items-center px-4 py-2 bg-racing-green text-white rounded font-bold text-sm hover:bg-stone-800 transition shadow-md"><Plus size={16} className="mr-2"/> Add Professional</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localVendors.map((vendor) => (
                <div key={vendor.id} className="walnut-card p-6 hover:shadow-md transition-shadow group relative">
                    {/* Edit button - appears on hover */}
                    <button onClick={() => handleEditClick(vendor)} className="absolute top-4 right-4 p-2 bg-white border border-stone-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-50 hover:border-racing-green" title="Edit Professional"><Settings size={14} className="text-stone-400 hover:text-racing-green" /></button>
                    <div className="flex justify-between items-start mb-4 pr-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center font-bold font-serif text-stone-600 text-lg border border-stone-200">{vendor.name.charAt(0)}</div>
                            <div>
                                <h3 className="font-bold text-stone-900 font-serif text-lg">{vendor.name}</h3>
                                <div className="flex items-center text-xs text-stone-500 font-serif italic"><BriefcaseIcon size={12} className="mr-1"/> {vendor.firm}</div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${vendor.role.includes('Attorney') ? 'bg-red-50 text-red-800 border-red-100' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>{vendor.role}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-stone-600"><Mail size={14} className="mr-2 text-racing-green"/> {vendor.email}</div>
                        <div className="flex items-center text-sm text-stone-600"><Phone size={14} className="mr-2 text-racing-green"/> {vendor.phone}</div>
                        <div className="pt-2">
                             <button onClick={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)} className="w-full py-1 text-center text-xs font-bold text-stone-400 bg-stone-50 rounded hover:bg-stone-100 hover:text-racing-green flex items-center justify-center transition-colors">
                                {expandedId === vendor.id ? "Show Less" : "Additional Info"} {expandedId === vendor.id ? <ChevronUp size={12} className="ml-1"/> : <ChevronDown size={12} className="ml-1"/>}
                             </button>
                        </div>
                    </div>
                    
                    {expandedId === vendor.id && (
                        <div className="bg-stone-50 p-4 rounded-md border border-stone-100 text-xs mb-4 animate-fadeIn">
                             {vendor.address && <div className="mb-3 flex items-start"><Map size={12} className="mr-2 mt-0.5 text-stone-400"/> <span className="text-stone-600">{vendor.address}</span></div>}
                             {vendor.notes && <div className="mb-3 flex items-start"><AlignLeft size={12} className="mr-2 mt-0.5 text-stone-400"/> <span className="text-stone-600 italic">"{vendor.notes}"</span></div>}
                             <div className="border-t border-stone-200 pt-2 mt-2">
                                <p className="font-bold text-stone-700 mb-1">Billing Rates</p>
                                {vendor.rates && vendor.rates.map((r, idx) => (
                                    <div key={idx} className="flex justify-between text-stone-500 mb-0.5"><span>{r.type}</span><span className="font-mono text-stone-800 font-bold">${r.rate}/hr</span></div>
                                ))}
                                {!vendor.rates && <div className="flex justify-between text-stone-500"><span>Standard</span><span className="font-mono text-stone-800 font-bold">${vendor.rate}/hr</span></div>}
                             </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-stone-100">
                        <p className="text-[10px] text-stone-400 uppercase font-bold mb-2">Engaged On</p>
                        <div className="flex flex-wrap gap-2">
                            {getTrustNames(vendor.engagedOn).map((trustName, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-racing-green-light text-racing-green text-[10px] font-bold border border-racing-green/20">
                                    <BadgeCheck size={10} className="mr-1"/> {trustName}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
