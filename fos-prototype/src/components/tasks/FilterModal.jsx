import React from 'react';

export const FilterModal = ({ onClose, onApply, onClear, filterPriority, setFilterPriority, filterTrust, setFilterTrust, trusts }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
                <div className="p-6 border-b border-stone-200">
                    <h2 className="text-xl font-serif font-bold text-stone-900">Filter Tasks</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Priority</label>
                        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full p-3 border border-stone-300 rounded font-serif text-sm">
                            <option value="all">All Priorities</option>
                            <option value="High">High Only</option>
                            <option value="Medium">Medium Only</option>
                            <option value="Low">Low Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Trust</label>
                        <select value={filterTrust} onChange={(e) => setFilterTrust(e.target.value)} className="w-full p-3 border border-stone-300 rounded font-serif text-sm">
                            <option value="all">All Trusts</option>
                            {trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between">
                    <button onClick={onClear} className="px-4 py-2 text-stone-500 font-bold text-sm">Clear Filters</button>
                    <button onClick={onApply} className="px-6 py-2 bg-racing-green text-white font-bold rounded shadow-md">Apply</button>
                </div>
            </div>
        </div>
    );
};
