import React from 'react';
import { Download } from 'lucide-react';

export function InvoiceModal({ onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-8 border-b border-stone-200 flex justify-between items-start bg-stone-50">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">INVOICE</h1>
            <p className="text-sm text-stone-500 font-mono"># INV-000013</p>
            <div className="mt-4">
              <p className="font-bold text-stone-800">Bill To:</p>
              <p className="text-sm text-stone-600">The Smith Family Dynasty Trust</p>
              <p className="text-sm text-stone-600">Attn: Larry Lahr, Fiduciary</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white p-4 border border-stone-200 rounded shadow-sm mb-4 inline-block text-left">
              <p className="text-xs text-stone-400 uppercase font-bold">Balance Due</p>
              <p className="text-2xl font-serif font-bold text-stone-900">$4,556.65</p>
            </div>
            <div className="text-sm text-stone-600">
              <p><strong>Date:</strong> Nov 28, 2025</p>
              <p><strong>Due:</strong> On Receipt</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-stone-800 text-white text-xs uppercase"><th className="p-3 text-left">Description</th><th className="p-3 text-right">Hrs</th><th className="p-3 text-right">Rate</th><th className="p-3 text-right">Amount</th></tr>
            </thead>
            <tbody className="text-sm font-serif">
              <tr className="border-b border-stone-100"><td className="p-4"><strong>Review 706 Draft</strong><br/><span className="text-stone-500 text-xs">Reviewing GST allocation schedules with CPA.</span></td><td className="p-4 text-right">1.5</td><td className="p-4 text-right">250.00</td><td className="p-4 text-right">375.00</td></tr>
              <tr className="border-b border-stone-100"><td className="p-4"><strong>Beneficiary Correspondence</strong><br/><span className="text-stone-500 text-xs">Email to Greg re: distribution timing.</span></td><td className="p-4 text-right">0.5</td><td className="p-4 text-right">250.00</td><td className="p-4 text-right">125.00</td></tr>
              <tr className="border-b border-stone-100"><td className="p-4"><strong>Bank Visit</strong><br/><span className="text-stone-500 text-xs">Chase Bank - Retitling operating account.</span></td><td className="p-4 text-right">2.0</td><td className="p-4 text-right">250.00</td><td className="p-4 text-right">500.00</td></tr>
            </tbody>
            <tfoot>
              <tr><td colSpan="3" className="p-4 text-right font-bold text-stone-600">Total</td><td className="p-4 text-right font-bold text-xl font-serif text-racing-green">$1,000.00</td></tr>
            </tfoot>
          </table>
          <div className="bg-stone-50 p-4 rounded text-sm text-stone-600 border border-stone-200">
            <strong>Notes:</strong> Please remit payment to Lahr Fiduciary Services, LLC.
          </div>
        </div>
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded text-stone-600 font-bold text-sm">Close</button>
          <button onClick={onDownload} className="px-4 py-2 bg-racing-green text-white rounded font-bold text-sm shadow-md flex items-center"><Download size={16} className="mr-2"/> Download PDF</button>
        </div>
      </div>
    </div>
  );
}
