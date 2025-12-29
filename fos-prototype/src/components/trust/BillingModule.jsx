import React, { useState } from 'react';
import { Clock, Play, Pause, Square, HelpCircle, Receipt, FileCheck, Mail, Download, MoreHorizontal } from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';
import { BILLING_ENTRIES, NEXUS_ACTIVITY_CATEGORIES } from '../../data/mockData';

export function BillingModule({ 
    invoices = [], 
    globalTimerRunning = false,
    globalTimerPaused = false,
    globalTimerSeconds = 0,
    globalWipEntries = BILLING_ENTRIES,
    setGlobalWipEntries,
    onTimerStart,
    onTimerPause,
    onTimerResume,
    onTimerStop,
    trustId,
    trustName
}) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [quickDate, setQuickDate] = useState('');
    const [quickDesc, setQuickDesc] = useState('');
    const [quickHours, setQuickHours] = useState('');
    const [quickActivityType, setQuickActivityType] = useState('safe');
    const [showNexusTooltip, setShowNexusTooltip] = useState(false);
    const HOURLY_RATE = 250;
    
    const wipEntries = globalWipEntries;

    const generatePDF = (invoiceData) => {
        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoiceData?.id || 'INV-000013'}</title>
    <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #004225; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #004225; }
        .invoice-title { font-size: 28px; color: #1c1917; margin-bottom: 5px; }
        .invoice-number { color: #78716c; font-family: monospace; }
        .bill-to { margin: 20px 0; }
        .bill-to-label { font-weight: bold; color: #1c1917; }
        .amount-box { background: #f5f5f4; padding: 15px; border: 1px solid #e7e5e4; display: inline-block; margin-bottom: 20px; }
        .amount-label { font-size: 10px; text-transform: uppercase; color: #78716c; }
        .amount-value { font-size: 24px; font-weight: bold; color: #1c1917; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #1c1917; color: white; padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
        th:last-child { text-align: right; }
        td { padding: 15px 12px; border-bottom: 1px solid #e7e5e4; }
        td:last-child { text-align: right; }
        .total-row td { font-weight: bold; font-size: 18px; color: #004225; border-top: 2px solid #1c1917; }
        .notes { background: #f5f5f4; padding: 15px; border: 1px solid #e7e5e4; margin-top: 30px; font-size: 14px; }
        .footer { margin-top: 50px; text-align: center; color: #78716c; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">FOS</div>
            <div style="color: #78716c; font-style: italic;">Fiduciary Operating System</div>
        </div>
        <div style="text-align: right;">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number"># ${invoiceData?.id || 'INV-000013'}</div>
        </div>
    </div>
    <div style="display: flex; justify-content: space-between;">
        <div class="bill-to">
            <div class="bill-to-label">Bill To:</div>
            <div>The Smith Family Dynasty Trust</div>
            <div>Attn: Larry Lahr, Fiduciary</div>
        </div>
        <div>
            <div class="amount-box">
                <div class="amount-label">Balance Due</div>
                <div class="amount-value">${invoiceData?.amount?.toFixed(2) || '4,556.65'}</div>
            </div>
            <div style="text-align: right; font-size: 14px;">
                <div><strong>Date:</strong> ${invoiceData?.date || 'Nov 28, 2025'}</div>
                <div><strong>Due:</strong> On Receipt</div>
            </div>
        </div>
    </div>
    <table>
        <thead>
            <tr><th>Description</th><th>Hrs</th><th>Rate</th><th>Amount</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Review 706 Draft</strong><br/><span style="color: #78716c; font-size: 12px;">Reviewing GST allocation schedules with CPA.</span></td><td>1.5</td><td>$250.00</td><td>$375.00</td></tr>
            <tr><td><strong>Beneficiary Correspondence</strong><br/><span style="color: #78716c; font-size: 12px;">Email to Greg re: distribution timing.</span></td><td>0.5</td><td>$250.00</td><td>$125.00</td></tr>
            <tr><td><strong>Bank Visit</strong><br/><span style="color: #78716c; font-size: 12px;">Chase Bank - Retitling operating account.</span></td><td>2.0</td><td>$250.00</td><td>$500.00</td></tr>
        </tbody>
        <tfoot>
            <tr class="total-row"><td colspan="3" style="text-align: right;">Total</td><td>$1,000.00</td></tr>
        </tfoot>
    </table>
    <div class="notes">
        <strong>Notes:</strong> Please remit payment to Lahr Fiduciary Services, LLC.
    </div>
    <div class="footer">
        Generated by Fiduciary Operating System | Confidential
    </div>
</body>
</html>`;
        
        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleTimerToggle = () => {
        if (globalTimerRunning && !globalTimerPaused) {
            if (onTimerPause) onTimerPause();
        } else if (globalTimerRunning && globalTimerPaused) {
            if (onTimerResume) onTimerResume();
        } else {
            if (onTimerStart) onTimerStart(trustId, trustName);
        }
    };
    
    const handleTimerStopAndLog = () => {
        if (onTimerStop) onTimerStop();
    };

    const handleQuickEntry = () => {
        if (!quickDesc || !quickHours) return;
        const hours = parseFloat(quickHours) || 0;
        const newEntry = {
            id: Date.now(),
            date: quickDate || 'Today',
            desc: quickDesc,
            hours: hours,
            rate: HOURLY_RATE,
            total: hours * HOURLY_RATE
        };
        if (setGlobalWipEntries) {
            setGlobalWipEntries(prev => [newEntry, ...prev]);
        }
        setQuickDate('');
        setQuickDesc('');
        setQuickHours('');
    };

    const totalWip = wipEntries.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            {showInvoiceModal && <InvoiceModal onClose={() => setShowInvoiceModal(false)} onDownload={() => generatePDF()} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="walnut-card flex flex-col items-center justify-center border-t-4 border-racing-green p-6">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">Fiduciary Timekeeper</h3>
                    <div className="text-5xl font-mono text-stone-800 mb-6 font-bold">{formatTime(globalTimerSeconds)}</div>
                    <div className="w-full space-y-2">
                        <button onClick={handleTimerToggle} className={`w-full py-3 rounded font-bold flex items-center justify-center transition-all shadow-md ${
                            globalTimerRunning && !globalTimerPaused 
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                : globalTimerRunning && globalTimerPaused
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-[#059669] text-white hover:bg-[#047857]' // Solid Emerald Green + Darker Hover
                        }`}>
                            {globalTimerRunning && !globalTimerPaused ? (
                                <><Pause size={18} className="mr-2"/> PAUSE</>
                            ) : globalTimerRunning && globalTimerPaused ? (
                                <><Play size={18} className="mr-2 fill-current"/> RESUME</>
                            ) : (
                                <><Play size={18} className="mr-2 fill-current"/> START TIMER</>
                            )}
                        </button>
                        {globalTimerRunning && (
                            <button onClick={handleTimerStopAndLog} className="w-full py-2 rounded font-bold flex items-center justify-center transition-all bg-red-100 text-red-700 hover:bg-red-200 text-sm">
                                <Square size={14} className="mr-2 fill-current"/> STOP & LOG ENTRY
                            </button>
                        )}
                    </div>
                    <div className="mt-4 text-xs text-stone-400">Rate: $250.00 / Hour</div>
                    {globalTimerRunning && (
                        <div className="mt-2 text-xs text-racing-green font-bold flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            Timer active globally
                        </div>
                    )}
                </div>
                <div className="walnut-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-stone-800 font-serif">Quick Entry</h3>
                        <button 
                            onClick={() => setShowNexusTooltip(!showNexusTooltip)} 
                            className="text-stone-400 hover:text-racing-green"
                            title="Learn about nexus implications"
                        >
                            <HelpCircle size={16} />
                        </button>
                    </div>
                    {showNexusTooltip && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded text-xs">
                            <p className="font-bold text-orange-800 mb-2">Tax Nexus: Activity Matters, Not Location</p>
                            <p className="text-orange-700 mb-2">It's not about WHERE the trustee lives—it's about WHAT ACTIVITIES they perform in California.</p>
                            <div className="space-y-1 text-orange-600">
                                <p><span className="font-bold">✅ Safe:</span> Routine correspondence, reviewing statements</p>
                                <p><span className="font-bold">⚠️ Caution:</span> Investment decisions, tax elections</p>
                                <p><span className="font-bold">🚫 Delegate:</span> Signing docs, court appearances</p>
                            </div>
                            <p className="mt-2 text-orange-500 italic">⚠️ Draft guidance only - consult tax counsel</p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <input type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)} className="w-full p-2 border border-stone-200 rounded text-sm font-serif" />
                        <input type="text" value={quickDesc} onChange={(e) => setQuickDesc(e.target.value)} placeholder="Description of task..." className="w-full p-2 border border-stone-200 rounded text-sm font-serif" />
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Activity Type (Nexus)</label>
                            <select 
                                value={quickActivityType} 
                                onChange={(e) => setQuickActivityType(e.target.value)} 
                                className={`w-full p-2 border rounded text-sm font-serif ${
                                    quickActivityType === 'safe' ? 'border-green-300 bg-green-50' :
                                    quickActivityType === 'caution' ? 'border-yellow-300 bg-yellow-50' :
                                    'border-red-300 bg-red-50'
                                }`}
                            >
                                {NEXUS_ACTIVITY_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            {quickActivityType !== 'safe' && (
                                <p className={`text-[10px] mt-1 ${
                                    quickActivityType === 'caution' ? 'text-yellow-700' : 'text-red-700'
                                }`}>
                                    {quickActivityType === 'caution' 
                                        ? '⚠️ This activity may trigger nexus considerations' 
                                        : '🚫 Consider delegating to NV-based trustee'}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input type="number" step="0.1" value={quickHours} onChange={(e) => setQuickHours(e.target.value)} placeholder="0.0 hrs" className="w-1/3 p-2 border border-stone-200 rounded text-sm font-serif" />
                            <button type="button" onClick={handleQuickEntry} disabled={!quickDesc || !quickHours} className="flex-1 bg-racing-green text-white font-bold rounded text-xs hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition">LOG ENTRY</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="walnut-card p-0 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50">
                     <div><h2 className="text-xl font-bold text-stone-900 font-serif flex items-center"><Clock size={24} className="mr-2 text-stone-400"/> Work In Progress (WIP)</h2></div>
                     <div className="text-right"><div className="text-xs text-stone-500 uppercase tracking-widest">Unbilled Amount</div><div className="text-2xl font-bold text-racing-green font-serif">${totalWip.toFixed(2)}</div></div>
                </div>
                <div className="overflow-x-auto"><table className="w-full accounting-table"><thead><tr className="text-left bg-white"><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4 text-right">Hrs</th><th className="p-4 text-right">Rate</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{wipEntries.map(entry => (<tr key={entry.id} className="border-b border-stone-100 hover:bg-stone-50"><td className="p-4 text-sm text-stone-600 font-serif">{entry.date}</td><td className="p-4 text-sm text-stone-800 font-bold font-serif">{entry.desc}</td><td className="p-4 text-sm text-stone-600 font-mono text-right">{entry.hours}</td><td className="p-4 text-sm text-stone-600 font-mono text-right">${entry.rate}</td><td className="p-4 text-sm text-racing-green font-mono text-right font-bold">${entry.total.toFixed(2)}</td></tr>))}</tbody></table></div>
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end"><button onClick={() => generatePDF()} className="flex items-center px-6 py-3 bg-stone-800 text-white rounded font-bold font-serif shadow-lg hover:bg-stone-900 transition"><Receipt size={18} className="mr-2" /> Generate Invoice PDF</button></div>
            </div>

            <div className="walnut-card p-0 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
                     <div><h2 className="text-xl font-bold text-stone-900 font-serif flex items-center"><FileCheck size={24} className="mr-2 text-stone-400"/> Invoice History</h2></div>
                     <div className="flex space-x-4">
                        <div className="text-right"><div className="text-[10px] text-stone-400 uppercase font-bold">Total Overdue</div><div className="text-lg font-bold text-orange-600 font-serif">$4,556.65</div></div>
                        <div className="text-right"><div className="text-[10px] text-stone-400 uppercase font-bold">Paid (YTD)</div><div className="text-lg font-bold text-stone-700 font-serif">$11,029.00</div></div>
                     </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full accounting-table">
                        <thead><tr className="text-left bg-stone-50"><th className="p-4">Invoice #</th><th className="p-4">Date</th><th className="p-4">Client</th><th className="p-4 text-right">Balance Due</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id} className="border-b border-stone-100 hover:bg-stone-50">
                                    <td className="p-4 text-sm text-racing-green font-bold font-serif hover:underline cursor-pointer">{inv.id}</td>
                                    <td className="p-4 text-sm text-stone-600 font-serif">{inv.date}</td>
                                    <td className="p-4 text-sm text-stone-800 font-serif">{inv.client}</td>
                                    <td className="p-4 text-sm text-stone-800 font-serif text-right font-bold">${inv.amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            inv.status === 'Overdue' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                                            inv.status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                            {inv.status} {inv.status === 'Overdue' && `(${inv.days} days)`}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-1 text-stone-400">
                                            <button className="p-1 hover:text-racing-green hover:bg-stone-100 rounded"><Mail size={16}/></button>
                                            <button className="p-1 hover:text-racing-green hover:bg-stone-100 rounded"><Download size={16}/></button>
                                            <button className="p-1 hover:text-racing-green hover:bg-stone-100 rounded"><MoreHorizontal size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
