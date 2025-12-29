import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export function VendorModal({ isNewVendor, editingVendor, onClose, onSave, onFieldChange, onRateChange, onAddRate, onRemoveRate }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-serif font-bold text-stone-900">{isNewVendor ? 'Add Professional' : 'Edit Professional'}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={24}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Name</label><input type="text" value={editingVendor?.name || ''} onChange={(e) => onFieldChange('name', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm" placeholder="Full Name" /></div>
            <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Role</label><select value={editingVendor?.role || 'Attorney'} onChange={(e) => onFieldChange('role', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm"><option value="Attorney">Attorney</option><option value="Accountant (CPA)">Accountant (CPA)</option><option value="Appraiser">Appraiser</option><option value="Investment Advisor">Investment Advisor</option><option value="Insurance Agent">Insurance Agent</option><option value="Real Estate Agent">Real Estate Agent</option><option value="Other">Other</option></select></div>
          </div>
          <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Firm / Company</label><input type="text" value={editingVendor?.firm || ''} onChange={(e) => onFieldChange('firm', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm" placeholder="Firm or Company Name" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label><input type="email" value={editingVendor?.email || ''} onChange={(e) => onFieldChange('email', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm" placeholder="email@example.com" /></div>
            <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone</label><input type="tel" value={editingVendor?.phone || ''} onChange={(e) => onFieldChange('phone', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm" placeholder="(555) 123-4567" /></div>
          </div>
          <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Address</label><input type="text" value={editingVendor?.address || ''} onChange={(e) => onFieldChange('address', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm" placeholder="Full Address" /></div>
          <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Notes</label><textarea value={editingVendor?.notes || ''} onChange={(e) => onFieldChange('notes', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm h-20" placeholder="Any special notes..." /></div>
          <div><label className="block text-xs font-bold uppercase text-stone-500 mb-1">Status</label><select value={editingVendor?.status || 'Active'} onChange={(e) => onFieldChange('status', e.target.value)} className="w-full p-2 border border-stone-300 rounded font-serif text-sm"><option value="Active">Active</option><option value="Pending">Pending</option><option value="Inactive">Inactive</option></select></div>
          <div>
            <div className="flex justify-between items-center mb-2"><label className="block text-xs font-bold uppercase text-stone-500">Billing Rates</label><button onClick={onAddRate} className="text-xs text-racing-green font-bold hover:underline flex items-center"><Plus size={12} className="mr-1"/> Add Rate</button></div>
            <div className="space-y-2">{editingVendor?.rates?.map((rate, idx) => (<div key={idx} className="flex items-center gap-2"><input type="text" value={rate.type} onChange={(e) => onRateChange(idx, 'type', e.target.value)} className="flex-1 p-2 border border-stone-300 rounded font-serif text-sm" placeholder="Rate Type" /><div className="flex items-center"><span className="text-stone-400 mr-1">$</span><input type="number" value={rate.rate} onChange={(e) => onRateChange(idx, 'rate', e.target.value)} className="w-20 p-2 border border-stone-300 rounded font-serif text-sm" /><span className="text-stone-400 ml-1 text-sm">/hr</span></div>{(editingVendor?.rates?.length || 0) > 1 && (<button onClick={() => onRemoveRate(idx)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>)}</div>))}</div>
          </div>
        </div>
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-stone-600 font-bold text-sm">Cancel</button>
          <button onClick={onSave} disabled={!editingVendor?.name} className="px-6 py-2 bg-racing-green text-white font-bold rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{isNewVendor ? 'Add Professional' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}
