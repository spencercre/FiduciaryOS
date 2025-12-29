import React, { useState } from 'react';
import { Scale, CheckCircle, XCircle, List } from 'lucide-react';
import { TRANSACTIONS, getAccountingData } from '../../data/mockData';

export function CourtAccounting({ trust }) {
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  
  if (!trust) return null;

  const { charges, credits } = getAccountingData(trust.id);
  const totalCharges = charges.reduce((sum, item) => sum + item.value, 0);
  const totalCredits = credits.reduce((sum, item) => sum + item.value, 0);
  const diff = totalCharges - totalCredits;
  const isBalanced = Math.abs(diff) < 0.01;

  const filteredTransactions = TRANSACTIONS.filter(tx => {
      if (ledgerFilter === 'all') return true;
      if (ledgerFilter === 'receipts') return tx.type === 'Receipt';
      if (ledgerFilter === 'disbursements') return tx.type === 'Disbursement';
      return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex space-x-2 border-b border-stone-200 pb-1 mb-4">
          <button onClick={() => setLedgerFilter('all')} className={`px-4 py-2 text-sm font-bold font-serif border-b-2 transition-colors ${ledgerFilter === 'all' ? 'border-racing-green text-racing-green' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>Full Ledger</button>
          <button onClick={() => setLedgerFilter('receipts')} className={`px-4 py-2 text-sm font-bold font-serif border-b-2 transition-colors ${ledgerFilter === 'receipts' ? 'border-racing-green text-racing-green' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>Schedule A (Receipts)</button>
          <button onClick={() => setLedgerFilter('disbursements')} className={`px-4 py-2 text-sm font-bold font-serif border-b-2 transition-colors ${ledgerFilter === 'disbursements' ? 'border-racing-green text-racing-green' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>Schedule C (Disbursements)</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <div className={`walnut-card border-l-4 ${isBalanced ? 'border-racing-green' : 'border-red-600'}`}>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center"><Scale size={24} className="mr-2 text-stone-600" /> Summary of Account</h2>
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs font-serif flex items-center ${isBalanced ? 'bg-racing-green-light text-racing-green' : 'bg-red-100 text-red-800'}`}>{isBalanced ? <CheckCircle size={14} className="mr-1.5"/> : <XCircle size={14} className="mr-1.5"/>}{isBalanced ? "BALANCED" : `IMBALANCE: ${formatCurrency(diff)}`}</div>
             </div>
          </div>

          <div className="walnut-card p-0 overflow-hidden">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-stone-800 font-serif flex items-center"><List size={18} className="mr-2 text-stone-500"/> {ledgerFilter === 'all' ? 'All Transactions' : ledgerFilter === 'receipts' ? 'Schedule A: Receipts' : 'Schedule C: Disbursements'}</h3>
                  <span className="text-xs text-stone-400 font-mono">{filteredTransactions.length} Entries</span>
              </div>
              <table className="w-full accounting-table">
                  <thead>
                      <tr>
                          <th className="w-24">Date</th>
                          <th>Description</th>
                          <th colSpan="2" className="text-center border-l border-stone-200 bg-stone-100 text-stone-700">INCOME</th>
                          <th colSpan="2" className="text-center border-l border-stone-200 bg-stone-100 text-stone-700">PRINCIPAL</th>
                      </tr>
                      <tr className="bg-white border-b border-stone-200">
                          <th></th>
                          <th></th>
                          <th className="text-right border-l border-stone-100 text-[10px]">Receipts</th>
                          <th className="text-right text-[10px]">Disbursements</th>
                          <th className="text-right border-l border-stone-100 text-[10px]">Receipts</th>
                          <th className="text-right text-[10px]">Disbursements</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredTransactions.map((tx, idx) => {
                          return (
                          <tr key={tx.id ?? `${tx.date}-${tx.desc}-${idx}`} className="hover:bg-stone-50 border-b border-stone-100">
                              <td className="p-3 font-serif text-stone-600 text-sm">{tx.date}</td>
                              <td className="p-3 font-serif text-stone-800 text-sm font-medium">{tx.desc}</td>
                              
                              <td className="p-3 font-serif text-right text-stone-600 text-sm border-l border-stone-100 bg-stone-50/30">
                                  {tx.incomeRx > 0 ? formatCurrency(tx.incomeRx) : ''}
                              </td>
                              <td className="p-3 font-serif text-right text-red-800 text-sm bg-stone-50/30">
                                  {tx.incomeDx > 0 ? `(${formatCurrency(tx.incomeDx)})` : ''}
                              </td>

                              <td className="p-3 font-serif text-right text-stone-600 text-sm border-l border-stone-100">
                                  {tx.princRx > 0 ? formatCurrency(tx.princRx) : ''}
                              </td>
                              <td className="p-3 font-serif text-right text-red-800 text-sm">
                                  {tx.princDx > 0 ? `(${formatCurrency(tx.princDx)})` : ''}
                              </td>
                          </tr>
                          )
                      })}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
