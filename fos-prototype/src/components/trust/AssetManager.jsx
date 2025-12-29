import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { ASSETS_MOCK } from '../../data/mockData';

const getTaxCliffDays = () => {
  const taxCliffDate = new Date('2026-01-01');
  const today = new Date();
  const diffTime = taxCliffDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export function AssetManager({ isPrivileged }) {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  const totalCurrent = ASSETS_MOCK.reduce((acc, curr) => acc + curr.currentValue, 0);
  const taxCliffDays = getTaxCliffDays();
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-stone-800 rounded-lg p-4 text-white flex flex-col md:flex-row items-center justify-between shadow-md border-t-4 border-red-800"><div className="flex items-center"><AlertTriangle size={24} className="text-red-200 mr-3"/><h3 className="font-serif font-bold text-lg text-red-50">2026 Tax Cliff Warning</h3></div><div className="text-center md:text-right"><div className="text-3xl font-mono font-bold text-red-400">{taxCliffDays} Days</div><p className="text-xs text-stone-500 uppercase tracking-widest font-serif">Remaining</p></div></div>
      <div className="walnut-card p-0 overflow-hidden flex flex-col md:flex-row"><div className="md:w-1/3 bg-racing-green p-6 text-white flex flex-col justify-center"><div className="text-racing-green-light text-xs font-bold uppercase tracking-wider font-serif mb-2">Total Estate Value</div><div className="text-3xl font-bold font-serif text-white">{formatCurrency(totalCurrent)}</div></div><div className="md:w-2/3 p-6 flex items-center justify-around bg-stone-50"><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Real Estate</div><div className="text-lg font-bold text-stone-800 font-serif">32%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[32%]"></div></div></div><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Securities</div><div className="text-lg font-bold text-stone-800 font-serif">45%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[45%]"></div></div></div><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Cash/Other</div><div className="text-lg font-bold text-stone-800 font-serif">23%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[23%]"></div></div></div></div></div>
      <div className="walnut-card overflow-hidden"><div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-100 text-xs font-bold text-stone-600 uppercase tracking-wider font-serif"><div className="col-span-4">Asset Name</div><div className="col-span-3">Type</div><div className="col-span-3 text-right">Value</div>{isPrivileged && <div className="col-span-2">Notes</div>}</div><div className="divide-y divide-stone-100">{ASSETS_MOCK.map((asset) => (<div key={asset.id} className="flex flex-col md:grid md:grid-cols-12 md:gap-4 p-4 items-center hover:bg-stone-50"><div className="col-span-4 font-bold text-stone-800 text-sm font-serif flex items-center"><Home size={14} className="mr-2 text-stone-400"/> {asset.name}</div><div className="col-span-3 text-sm text-stone-500 font-serif italic">{asset.type}</div><div className="col-span-3 text-right font-mono text-sm text-stone-700">{formatCurrency(asset.currentValue)}</div>{isPrivileged && <div className="col-span-2 text-xs text-stone-500">{asset.notes}</div>}</div>))}</div></div>
    </div>
  );
}
