import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, FileText, Activity, Inbox, ArrowRight, 
  Archive, CheckCircle, BrainCircuit, Paperclip, Trash2, 
  MapPin, TrendingUp, Home, Landmark, CreditCard, 
  Sparkles, User, MessageSquare, Thermometer,
  Wifi, Key, History, AlertOctagon, Gavel, Globe, UserCheck, Hourglass, 
  Briefcase, Lock, Unlock, Eye, EyeOff, Menu, X, ChevronLeft, ChevronRight, 
  Lightbulb, AlertTriangle, XCircle, Tag, Calendar, DollarSign, Scale, 
  Settings, Calculator, Printer, PieChart, FileArchive, FolderClosed,
  Clock, Play, Square, Plus, Receipt, List, Filter, FileCheck, Mail, MoreHorizontal, Download, Phone, Briefcase as BriefcaseIcon, BadgeCheck, BookOpen, ClipboardList, Loader, ChevronDown, ChevronUp, Map, AlignLeft, AtSign
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { auth, db } from './firebase'; 
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

const appId = 'fiduciary-os-local-dev';

// ==========================================
// 1. GLOBAL STYLES (Tailwind Override)
// ==========================================
function GlobalStyles() {
  return (
  <style>{`
    :root {
      --racing-green: #004225;
      --racing-green-light: #e5f0eb;
      --stone-50: #fafaf9;
      --stone-100: #f5f5f4;
      --stone-200: #e7e5e4;
      --stone-800: #292524;
      --stone-900: #1c1917;
      --paper-cream: #fdfbf7;
      --gold-500: #d4af37;
    }
    body { background-color: var(--stone-50); }
    
    .bg-racing-green { background-color: var(--racing-green); }
    .text-racing-green { color: var(--racing-green); }
    .border-racing-green { border-color: var(--racing-green); }
    .bg-racing-green-light { background-color: var(--racing-green-light); }
    
    .font-serif { font-family: 'Times New Roman', Times, serif; }
    .font-sans { font-family: system-ui, -apple-system, sans-serif; }
    
    .walnut-card { 
      background-color: white; 
      border: 1px solid var(--stone-200); 
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
      margin-bottom: 16px;
    }

    .sidebar-link:hover {
      background-color: var(--stone-800);
      color: var(--stone-100);
    }
    .sidebar-link.active {
      background-color: var(--racing-green);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; margin-left: 8px; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
    .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: var(--racing-green); }
    input:checked + .toggle-slider:before { transform: translateX(18px); }
    .toggle-red input:checked + .toggle-slider { background-color: #991b1b; }

    .kanban-card { background: white; border: 1px solid var(--stone-200); border-radius: 6px; padding: 12px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: transform 0.1s; }
    .kanban-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-color: var(--racing-green); }

    .accounting-table th { font-family: system-ui, -apple-system, sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.7rem; color: var(--stone-500); background-color: var(--stone-50); border-bottom: 1px solid var(--stone-200); padding: 12px; text-align: left; font-weight: 600; }
    .accounting-table td { padding: 12px; border-bottom: 1px solid var(--stone-100); font-family: 'Times New Roman', serif; font-size: 0.95rem; }
    .accounting-total { font-weight: bold; border-top: 2px solid var(--stone-800); border-bottom: 4px double var(--stone-800); }
    
    .bubble-user { background-color: var(--racing-green); color: white; border-radius: 12px 12px 0 12px; padding: 12px 16px; font-family: 'Times New Roman', serif; max-width: 80%; margin-left: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .bubble-ai { background-color: var(--paper-cream); border: 1px solid var(--stone-200); color: var(--stone-900); border-radius: 12px 12px 12px 0; padding: 12px 16px; font-family: 'Times New Roman', serif; max-width: 80%; margin-right: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  `}</style>
  );
}

// ==========================================
// 2. MOCK & SEED DATA
// ==========================================
const TRUSTS = [
  { id: 1, name: "The Smith Family Dynasty Trust", situs: "Nevada", type: "Irrevocable", status: "active", assets: 14200000, progress: 35, nextTask: "Review 706 Draft", ein: "88-1234567", dateOfDeath: "Oct 12, 2024" },
  { id: 2, name: "Estate of Arthur P. Jenkins", situs: "California", type: "Revocable", status: "critical", assets: 2100000, progress: 15, nextTask: "Marshalling", ein: "99-7654321", dateOfDeath: "Nov 01, 2024" },
  { id: 3, name: "Llewellyn Charitable Trust", situs: "Wyoming", type: "CRT", status: "active", assets: 5600000, progress: 45, nextTask: "Distribution", ein: "45-9988776", dateOfDeath: "N/A" }
];
const SEED_TRUSTS = TRUSTS;

const SEED_TASKS = [
    { id: 1, title: "File 706 Return", trustId: 1, priority: "High", status: "todo", due: "2 Days" },
    { id: 2, title: "Approve Appraiser Invoice", trustId: 2, priority: "Medium", status: "todo", due: "Today" },
    { id: 3, title: "Draft Response to Greg", trustId: 1, priority: "High", status: "in-progress", due: "ASAP" },
    { id: 4, title: "Quarterly Distribution", trustId: 3, priority: "Low", status: "todo", due: "Next Week" },
    { id: 5, title: "Review Investment Performance", trustId: 1, priority: "Medium", status: "done", due: "Yesterday" },
];

const SEED_VENDORS = [
    { 
        id: 1, name: "Sarah Jenkins", firm: "Jenkins Law Group, LLP", role: "Attorney", 
        phone: "(555) 123-4567", email: "sarah@jenkinslaw.com", engagedOn: [1, 2], status: "Active",
        address: "1200 Wilshire Blvd, Ste 400, Los Angeles, CA 90017",
        rates: [{ type: "Standard", rate: 450 }, { type: "Court Appearance", rate: 600 }, { type: "Paralegal", rate: 175 }],
        notes: "Sarah prefers email communication. Do not call before 10 AM."
    },
    { 
        id: 2, name: "Robert 'Bob' Vance", firm: "Vance & Associates CPAs", role: "Accountant (CPA)", 
        phone: "(555) 987-6543", email: "bob@vancecpa.com", engagedOn: [1, 3], status: "Active",
        address: "4500 Main St, Irvine, CA 92614",
        rates: [{ type: "Tax Prep", rate: 325 }, { type: "Audit", rate: 375 }],
        notes: "Bob handles the K-1s for all beneficiaries."
    },
    {
        id: 3, name: "Cushman & Wakefield", firm: "Cushman Commercial", role: "Appraiser", 
        phone: "(213) 555-9988", email: "appraisals@cushman.com", engagedOn: [1], status: "Pending",
        address: "444 S Flower St, Los Angeles, CA 90071", rates: [{ type: "Commercial", rate: 5000 }], notes: "Flat fee per property."
    },
    {
        id: 4, name: "Northern Trust", firm: "Northern Trust Corp", role: "Investment Advisor", 
        phone: "(800) 123-0000", email: "wealth@ntrs.com", engagedOn: [1, 3], status: "Active",
        address: "50 S La Salle St, Chicago, IL 60603", rates: [{ type: "AUM Fee", rate: 100 }], notes: "100 bps on first $5M."
    }
];
const VENDORS_MOCK = SEED_VENDORS;

const ASSETS_MOCK = [
  { id: 'a1', trustId: 1, name: "123 Highland Ave", type: "Real Estate", currentValue: 2600000, notes: "Appraisal low." },
  { id: 'a2', trustId: 1, name: "Chase Checking", type: "Cash", currentValue: 425000, notes: "Operating." },
  { id: 'a3', trustId: 1, name: "Smith Family LLC", type: "Business", currentValue: 4500000, notes: "Discounted." },
  { id: 'a4', trustId: 1, name: "NVIDIA Corp", type: "Securities", currentValue: 6800000, notes: "Verified." },
  { id: 'a5', trustId: 1, name: "Coinbase Wallet", type: "Digital Asset", currentValue: 920000, notes: "Secured. Custodian: Coinbase." }
];

const TRANSACTIONS = [
    { id: 1, date: "2024-11-01", type: "Receipt", category: "Interest", desc: "Chase Bank Interest", incomeRx: 450.22, incomeDx: 0, princRx: 0, princDx: 0 },
    { id: 2, date: "2024-11-05", type: "Disbursement", category: "Expense", desc: "Legal Fees - Jenkins Law", incomeRx: 0, incomeDx: 2500.00, princRx: 0, princDx: 0 }, 
    { id: 3, date: "2024-11-15", type: "Receipt", category: "Dividend", desc: "NVIDIA Div", incomeRx: 1200.00, incomeDx: 0, princRx: 0, princDx: 0 },
    { id: 4, date: "2024-11-20", type: "Disbursement", category: "Expense", desc: "Appraisal Fee", incomeRx: 0, incomeDx: 4000.00, princRx: 0, princDx: 0 }, 
    { id: 5, date: "2024-11-25", type: "Receipt", category: "Gain", desc: "Sale of Ford Truck", incomeRx: 15000.00, incomeDx: 0, princRx: 0, princDx: 0 }, // Principal Receipt
    { id: 6, date: "2024-11-28", type: "Disbursement", category: "Expense", desc: "Funeral Expenses", incomeRx: 0, incomeDx: 0, princRx: 0, princDx: 8500.00 }, // Principal Expense
];

const BILLING_ENTRIES = [
    { id: 1, date: "Today", desc: "Reviewing 706 Draft", hours: 0.8, rate: 250, total: 200.00 },
    { id: 2, date: "Yesterday", desc: "Call with Beneficiary (Greg)", hours: 0.4, rate: 250, total: 100.00 },
    { id: 3, date: "Yesterday", desc: "Bank Visit - Retitling", hours: 1.5, rate: 250, total: 375.00 },
];

const INVOICE_HISTORY = [
    { id: "INV-000013", date: "28 Nov 2025", client: "The Smith Family Trust", amount: 4556.65, status: "Overdue", days: 8 },
    { id: "INV-000012", date: "14 Oct 2025", client: "The Smith Family Trust", amount: 2355.78, status: "Paid", days: 0 },
    { id: "INV-000011", date: "02 Oct 2025", client: "Estate of A. Jenkins", amount: 8002.81, status: "Paid", days: 0 },
    { id: "INV-000010", date: "12 Sep 2025", client: "The Smith Family Trust", amount: 671.50, status: "Paid", days: 0 },
];

const DOCUMENTS = [
  { id: 101, name: "Death Certificate.pdf", type: "public", date: "Oct 12, 2024", size: "1.2 MB", trustName: "The Smith Family Dynasty Trust" },
  { id: 102, name: "Trust Instrument.pdf", type: "public", date: "Sep 01, 2020", size: "4.5 MB", trustName: "The Smith Family Dynasty Trust" },
  { id: 103, name: "Valuation_Draft_v2.docx", type: "privileged", subtype: "admin_work_product", date: "Today", size: "24 KB", trustName: "The Smith Family Dynasty Trust" },
  { id: 104, name: "Liability_Memo.msg", type: "privileged", subtype: "personal_defense", date: "Yesterday", size: "15 KB", trustName: "The Smith Family Dynasty Trust" },
  { id: 105, name: "Chase_Bank_Statement_Nov.pdf", type: "public", date: "Nov 30, 2024", size: "1.8 MB", trustName: "Estate of Arthur P. Jenkins" },
];

const LEGAL_TEXTS = {
  102: `THE SMITH FAMILY DYNASTY TRUST\n...`,
  101: `CERTIFICATE OF DEATH\n...`,
};

const WORKFLOW_STEPS = [
  { id: 'step1', title: "Immediate Post-Death", status: "complete", items: [{ label: "Order Death Certs", completed: true }, { label: "Notify Soc Sec", completed: true }] },
  { id: 'step2', title: "Marshaling", status: "active", items: [{ label: "Identify Accounts", completed: true }, { label: "Secure Digital Assets", completed: false }, { label: "Creditor Notice", completed: false }] },
  { id: 'step3', title: "Tax Compliance", status: "pending", items: [{ label: "GST Exemption", completed: false }, { label: "Review Draft 706", completed: false }] },
];

const INCOMING_EMAILS = [
  { id: 'e1', sender: "attorney@lawfirm.com", subject: "Draft 706", date: "10:42 AM", aiConfidence: 0.98, body: "Attached is the draft 706. Please review the GST allocations.", suggestedTrust: 't1', suggestedTag: "Tax" },
  { id: 'e2', sender: "greg@gmail.com", subject: "When do I get my money?", date: "9:15 AM", aiConfidence: 0.85, body: "It's been 6 months. I need a distribution.", suggestedTrust: 't1', suggestedTag: "Risk" },
];

const getAccountingData = (trustId) => {
    // FIX: Handle undefined or mismatched trustId
    if (!trustId) return { charges: [], credits: [] };
    
    let charges = [ { id: 'A', name: "Property on Hand (Start)", value: 14200000 }, { id: 'B', name: "Receipts (Income)", value: 150000 } ];
    let credits = [ { id: 'E', name: "Disbursements (Expenses)", value: 25000 }, { id: 'H', name: "Property on Hand (Ending)", value: 14375000 } ];
    if (trustId === 2) { credits[0].value = 25500; }
    return { charges, credits };
};

// ==========================================
// 3. BASE COMPONENTS (Defined First)
// ==========================================

function PrivilegeToggle({ isPrivileged, setIsPrivileged, className = "" }) {
  return (
    <div className={`flex items-center space-x-3 rounded-full px-4 py-2 shadow-sm border transition-all ${className} ${isPrivileged ? 'bg-red-50 border-red-200' : 'bg-racing-green-light border-racing-green'}`}>
        <span className={`text-xs font-bold font-serif ${isPrivileged ? 'text-red-800' : 'text-racing-green'}`}>{isPrivileged ? 'FIDUCIARY (Privileged)' : 'BENEFICIARY (Safe)'}</span>
        <label className={`toggle-switch ${isPrivileged ? 'toggle-red' : ''}`}>
          <input type="checkbox" className="toggle-checkbox" checked={isPrivileged} onChange={() => setIsPrivileged(!isPrivileged)} />
          <span className="toggle-slider"></span>
        </label>
    </div>
  );
}

function DocViewer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50 rounded-t-lg"><div className="flex items-center space-x-2"><FileText size={20} className="text-racing-green"/><h3 className="font-serif font-bold text-lg">{doc.name}</h3></div><button onClick={onClose}><X size={24} className="text-stone-400 hover:text-stone-600"/></button></div>
        <div className="p-8 overflow-y-auto font-serif text-sm leading-loose whitespace-pre-wrap bg-[#fdfbf7] text-stone-800">{doc.content || "Document preview loaded from secure vault."}</div>
        <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-lg flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 font-bold text-sm">Close</button></div>
      </div>
    </div>
  );
}

// ==========================================
// 4. FEATURE MODULES
// ==========================================

function TaskCommandCenter({ tasks, trusts, onMoveTask }) {
    const getTrustName = (id) => trusts.find(t => t.id === id)?.name || "Unknown";
    const [localTasks, setLocalTasks] = useState(tasks);

    useEffect(() => { setLocalTasks(tasks); }, [tasks]);

    const handleMove = (taskId, newStatus) => {
        const updated = localTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        setLocalTasks(updated);
        if(onMoveTask) onMoveTask(taskId, newStatus);
    };

    const TaskCard = ({ task }) => (
        <div className="kanban-card group flex flex-col justify-between h-full bg-white p-4 border border-stone-200 rounded shadow-sm hover:shadow-md transition-all">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                    <span className="text-[10px] text-stone-400 flex items-center"><Clock size={10} className="mr-1"/> {task.due}</span>
                </div>
                <p className="text-sm font-bold text-stone-800 mb-1">{task.title}</p>
                <div className="flex items-center mt-2">
                   <BadgeCheck size={12} className="text-racing-green mr-1" />
                   <p className="text-xs text-racing-green font-bold font-serif">{getTrustName(task.trustId)}</p>
                </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-stone-100 opacity-20 group-hover:opacity-100 transition-opacity mt-3">
                {task.status !== 'done' && (
                    <button onClick={() => handleMove(task.id, task.status === 'todo' ? 'in-progress' : 'done')} className="text-xs text-stone-500 font-bold flex items-center hover:text-racing-green">
                        Next <ArrowRight size={12} className="ml-1"/>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6">
                <div><h1 className="font-serif text-3xl font-bold text-stone-900">Task Command Center</h1><p className="text-stone-500 font-serif italic">Unified Workflow Across All Trusts</p></div>
                <div className="flex space-x-2"><button className="flex items-center px-4 py-2 bg-white border border-stone-300 rounded text-stone-600 font-bold text-sm hover:bg-stone-50"><Filter size={16} className="mr-2"/> Filter</button><button className="flex items-center px-4 py-2 bg-racing-green text-white rounded font-bold text-sm hover:bg-stone-800 shadow-md"><Plus size={16} className="mr-2"/> New Task</button></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 min-h-[500px]"><h3 className="font-bold text-stone-700 uppercase tracking-widest text-xs mb-4 flex items-center">To Do ({localTasks.filter(t => t.status === 'todo').length})</h3><div className="space-y-2">{localTasks.filter(t => t.status === 'todo').map((task, i) => <TaskCard key={i} task={task} />)}</div></div>
                <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 min-h-[500px]"><h3 className="font-bold text-blue-700 uppercase tracking-widest text-xs mb-4 flex items-center">In Progress ({localTasks.filter(t => t.status === 'in-progress').length})</h3><div className="space-y-2">{localTasks.filter(t => t.status === 'in-progress').map((task, i) => <TaskCard key={i} task={task} />)}</div></div>
                <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 min-h-[500px]"><h3 className="font-bold text-green-700 uppercase tracking-widest text-xs mb-4 flex items-center">Completed ({localTasks.filter(t => t.status === 'done').length})</h3><div className="space-y-2">{localTasks.filter(t => t.status === 'done').map((task, i) => <TaskCard key={i} task={task} />)}</div></div>
            </div>
        </div>
    );
}

function BillingModule({ invoices = [] }) {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    useEffect(() => {
        let interval;
        if (isTimerRunning) { interval = setInterval(() => setTime(prev => prev + 1), 1000); }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // ZOHO STYLE INVOICE MODAL
    const InvoiceModal = () => (
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
                    <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 bg-white border border-stone-300 rounded text-stone-600 font-bold text-sm">Close</button>
                    <button className="px-4 py-2 bg-racing-green text-white rounded font-bold text-sm shadow-md flex items-center"><Download size={16} className="mr-2"/> Download PDF</button>
                </div>
            </div>
        </div>
    );

    const totalWip = BILLING_ENTRIES.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            {showInvoiceModal && <InvoiceModal />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="walnut-card flex flex-col items-center justify-center border-t-4 border-racing-green p-6">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">Fiduciary Timekeeper</h3>
                    <div className="text-5xl font-mono text-stone-800 mb-6 font-bold">{formatTime(time)}</div>
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`w-full py-3 rounded font-bold flex items-center justify-center transition-all ${isTimerRunning ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-racing-green text-white hover:bg-stone-800'}`}>
                        {isTimerRunning ? <Square size={18} className="mr-2 fill-current"/> : <Play size={18} className="mr-2 fill-current"/>}
                        {isTimerRunning ? "STOP & LOG" : "START TIMER"}
                    </button>
                    <div className="mt-4 text-xs text-stone-400">Rate: $250.00 / Hour</div>
                </div>
                <div className="walnut-card p-6">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-stone-800 font-serif">Quick Entry</h3><button className="text-xs text-racing-green font-bold flex items-center"><Plus size={14} className="mr-1"/> Add Item</button></div>
                    <form className="space-y-3">
                        <input type="date" className="w-full p-2 border border-stone-200 rounded text-sm font-serif" />
                        <input type="text" placeholder="Description of task..." className="w-full p-2 border border-stone-200 rounded text-sm font-serif" />
                        <div className="flex gap-2"><input type="number" placeholder="0.0 hrs" className="w-1/3 p-2 border border-stone-200 rounded text-sm font-serif" /><button type="button" className="flex-1 bg-stone-100 text-stone-600 font-bold rounded text-xs hover:bg-stone-200">LOG ENTRY</button></div>
                    </form>
                </div>
            </div>

            <div className="walnut-card p-0 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50">
                     <div><h2 className="text-xl font-bold text-stone-900 font-serif flex items-center"><Clock size={24} className="mr-2 text-stone-400"/> Work In Progress (WIP)</h2></div>
                     <div className="text-right"><div className="text-xs text-stone-500 uppercase tracking-widest">Unbilled Amount</div><div className="text-2xl font-bold text-racing-green font-serif">${totalWip.toFixed(2)}</div></div>
                </div>
                <div className="overflow-x-auto"><table className="w-full accounting-table"><thead><tr className="text-left bg-white"><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4 text-right">Hrs</th><th className="p-4 text-right">Rate</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{BILLING_ENTRIES.map(entry => (<tr key={entry.id} className="border-b border-stone-100 hover:bg-stone-50"><td className="p-4 text-sm text-stone-600 font-serif">{entry.date}</td><td className="p-4 text-sm text-stone-800 font-bold font-serif">{entry.desc}</td><td className="p-4 text-sm text-stone-600 font-mono text-right">{entry.hours}</td><td className="p-4 text-sm text-stone-600 font-mono text-right">${entry.rate}</td><td className="p-4 text-sm text-racing-green font-mono text-right font-bold">${entry.total.toFixed(2)}</td></tr>))}</tbody></table></div>
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end"><button className="flex items-center px-6 py-3 bg-stone-800 text-white rounded font-bold font-serif shadow-lg hover:bg-stone-900 transition"><Receipt size={18} className="mr-2" /> Generate Invoice PDF</button></div>
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

function CourtAccounting({ trust, isPrivileged }) {
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
                      {filteredTransactions.map(tx => {
                          return (
                          <tr key={tx.id || Math.random()} className="hover:bg-stone-50 border-b border-stone-100">
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

function AdminConsole() {
  const [selectedTier, setSelectedTier] = useState('pro');
  const [modules, setModules] = useState([
    { id: 'core', label: 'Core Ledger & Vault', tiers: ['standard', 'pro', 'dynasty'], icon: FileText, enabled: true },
    { id: 'privilege', label: 'Privilege Firewall', tiers: ['standard', 'pro', 'dynasty'], icon: Shield, enabled: true }, 
    { id: 'oracle', label: 'AI Fiduciary Mind', tiers: ['pro', 'dynasty'], icon: BrainCircuit, enabled: true }, 
    { id: 'legacy', label: 'Digital Successor Protocol', tiers: ['dynasty'], icon: Hourglass, enabled: false }, 
    { id: 'audit', label: 'Court-Ready Audit Logs', tiers: ['pro', 'dynasty'], icon: History, enabled: true }, 
    { id: 'nexus', label: 'Multi-State Nexus Watchdog', tiers: ['dynasty'], icon: Globe, enabled: false }, 
    { id: 'accounting', label: 'Court Accounting Engine', tiers: ['pro', 'dynasty'], icon: Scale, enabled: true }
  ]);

  const toggleModule = (id) => {
      setModules(modules.map(m => m.id === id ? {...m, enabled: !m.enabled} : m));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Platform Administration</h1><p className="text-stone-500 font-serif italic">Manage Licensing & Active Modules</p></div><div className="px-4 py-2 bg-stone-800 rounded text-white text-sm font-serif flex items-center"><Settings size={16} className="mr-2"/> Administrator Mode</div></div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['standard', 'pro', 'dynasty'].map(tier => (<div key={tier} onClick={() => setSelectedTier(tier)} className={`walnut-card cursor-pointer transition-all ${selectedTier === tier ? 'border-racing-green ring-2 ring-racing-green bg-racing-green-light' : 'opacity-60 hover:opacity-100'}`}><h3 className="font-serif font-bold text-xl text-stone-800 capitalize">{tier}</h3><div className="text-2xl font-bold text-racing-green mb-1">${tier === 'standard' ? 150 : tier === 'pro' ? 250 : 450}<span className="text-sm text-stone-500 font-normal">/mo</span></div></div>))}</div>
       
       <div className="walnut-card"><h3 className="font-serif font-bold text-lg text-stone-800 mb-6 border-b border-stone-100 pb-2">Feature Flags</h3>
       <div className="space-y-4">
           {modules.map((mod) => (
               <div key={mod.id} className={`flex items-center justify-between p-4 rounded border ${mod.enabled ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
                   <div className="flex items-center space-x-4">
                       <div className={`p-2 rounded ${mod.enabled ? 'bg-racing-green-light text-racing-green' : 'bg-stone-200 text-stone-400'}`}><mod.icon size={20} /></div>
                       <div><p className={`font-bold text-sm ${mod.enabled ? 'text-stone-800' : 'text-stone-400'}`}>{mod.label}</p></div>
                   </div>
                   <div>
                       <label className="toggle-switch">
                           <input type="checkbox" className="toggle-checkbox" checked={mod.enabled} onChange={() => toggleModule(mod.id)} />
                           <span className="toggle-slider"></span>
                       </label>
                   </div>
               </div>
           ))}
       </div>
       </div>
    </div>
  );
}

function VendorRolodex({ vendors }) {
  const getTrustNames = (ids) => ids.map(id => SEED_TRUSTS.find(t => t.id === id)?.name).filter(Boolean);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6">
            <div><h1 className="font-serif text-3xl font-bold text-stone-900">Professional Directory</h1><p className="text-stone-500 font-serif italic">Your Ecosystem of Experts</p></div>
            <div className="flex space-x-2"><button className="flex items-center px-4 py-2 bg-white border border-stone-300 rounded text-stone-600 font-bold text-sm hover:bg-stone-50 transition"><Filter size={16} className="mr-2"/> Filter</button><button className="flex items-center px-4 py-2 bg-racing-green text-white rounded font-bold text-sm hover:bg-stone-800 transition shadow-md"><Plus size={16} className="mr-2"/> Add Professional</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
                <div key={vendor.id} className="walnut-card p-6 hover:shadow-md transition-shadow group relative">
                    <div className="flex justify-between items-start mb-4">
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

function Sidebar({ activeTab, setActiveTab, isPrivileged, setIsPrivileged, isMobile, isOpen, setIsOpen }) {
  const menuItems = [{ id: 'dashboard', label: 'Command Center', icon: Activity }, { id: 'inbox', label: 'Context Inbox', icon: Inbox }, { id: 'trusts', label: 'My Trusts', icon: Briefcase }, { id: 'oracle', label: 'Fiduciary Mind', icon: BrainCircuit }, { id: 'meet-me', label: 'Meet-Me Room', icon: Users }, { id: 'rolodex', label: 'Rolodex', icon: BookOpen }, { id: 'tasks', label: 'Task Command', icon: ClipboardList }, { id: 'documents', label: 'Vault', icon: FileText }, { id: 'legacy', label: 'Digital Successor', icon: Hourglass }, { id: 'admin', label: 'Admin Console', icon: Settings, spacer: true }];
  return (
    <div className={isMobile ? `fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : "w-64 bg-stone-900 text-stone-200 flex-shrink-0 min-h-screen sticky top-0 hidden md:flex flex-col border-r border-stone-800"}>
      <div className="p-6 flex items-center justify-between"><div className="flex items-center space-x-2"><Shield className="text-racing-green h-8 w-8 fill-current" /><span className="font-serif text-xl font-bold tracking-wide text-stone-100">FOS</span></div>{isMobile && <button onClick={() => setIsOpen(false)} className="text-stone-400"><X size={24} /></button>}</div>
      <nav className="flex-1 px-4 space-y-2 mt-4">{menuItems.map((item) => (<div key={item.id}>{item.spacer && <div className="h-px bg-stone-800 my-4"></div>}<button onClick={() => { setActiveTab(item.id); if(isMobile) setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 sidebar-link ${activeTab === item.id ? 'active' : 'text-stone-400'}`}><item.icon size={18} /><span className="font-medium font-serif tracking-wide">{item.label}</span></button></div>))}</nav>
      {/* SIDEBAR TOGGLE */}
      <div className="p-4 border-t border-stone-800 bg-stone-950">
        <PrivilegeToggle isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} className="w-full justify-between p-3 border-stone-700 bg-stone-900" />
      </div>
    </div>
  );
}

// RESTORED MISSING COMPONENTS FROM ORIGINAL PROTOTYPE

const AssetManager = ({ isPrivileged }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  const totalCurrent = ASSETS_MOCK.reduce((acc, curr) => acc + curr.currentValue, 0);
  return (
    <div className="space-y-6">
      <div className="bg-stone-800 rounded-lg p-4 text-white flex flex-col md:flex-row items-center justify-between shadow-md border-t-4 border-red-800"><div className="flex items-center"><AlertTriangle size={24} className="text-red-200 mr-3"/><h3 className="font-serif font-bold text-lg text-red-50">2026 Tax Cliff Warning</h3></div><div className="text-center md:text-right"><div className="text-3xl font-mono font-bold text-red-400">~390 Days</div><p className="text-xs text-stone-500 uppercase tracking-widest font-serif">Remaining</p></div></div>
      <div className="walnut-card p-0 overflow-hidden flex flex-col md:flex-row"><div className="md:w-1/3 bg-racing-green p-6 text-white flex flex-col justify-center"><div className="text-racing-green-light text-xs font-bold uppercase tracking-wider font-serif mb-2">Total Estate Value</div><div className="text-3xl font-bold font-serif text-white">{formatCurrency(totalCurrent)}</div></div><div className="md:w-2/3 p-6 flex items-center justify-around bg-stone-50"><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Real Estate</div><div className="text-lg font-bold text-stone-800 font-serif">32%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[32%]"></div></div></div><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Securities</div><div className="text-lg font-bold text-stone-800 font-serif">45%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[45%]"></div></div></div><div className="text-center"><div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1">Cash/Other</div><div className="text-lg font-bold text-stone-800 font-serif">23%</div><div className="w-16 h-1 bg-stone-200 mt-2 mx-auto"><div className="bg-racing-green h-1 w-[23%]"></div></div></div></div></div>
      <div className="walnut-card overflow-hidden"><div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-100 text-xs font-bold text-stone-600 uppercase tracking-wider font-serif"><div className="col-span-4">Asset Name</div><div className="col-span-3">Type</div><div className="col-span-3 text-right">Value</div>{isPrivileged && <div className="col-span-2">Notes</div>}</div><div className="divide-y divide-stone-100">{ASSETS_MOCK.map((asset) => (<div key={asset.id} className="flex flex-col md:grid md:grid-cols-12 md:gap-4 p-4 items-center hover:bg-stone-50"><div className="col-span-4 font-bold text-stone-800 text-sm font-serif flex items-center"><Home size={14} className="mr-2 text-stone-400"/> {asset.name}</div><div className="col-span-3 text-sm text-stone-500 font-serif italic">{asset.type}</div><div className="col-span-3 text-right font-mono text-sm text-stone-700">{formatCurrency(asset.currentValue)}</div>{isPrivileged && <div className="col-span-2 text-xs text-stone-500">{asset.notes}</div>}</div>))}</div></div>
    </div>
  );
};

const OracleInterface = ({ initialPrompt, contextTrust, onSelectContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  // CONTEXT AWARE GREETING (UPDATED TO USER SPEC)
  useEffect(() => {
    if (contextTrust) {
        if (messages.length === 0) setMessages([{ id: 1, type: 'ai', text: `Hello Larry, I've reviewed the instruments for the **${contextTrust.name}**. How can I help?` }]);
    } else {
        if (initialPrompt) {
            handleSend(initialPrompt);
        } else if (messages.length === 0) {
            setMessages([{ id: 1, type: 'ai', text: "Hello Larry, I'm looking forward to digging into any trust or questions you might have. What trust are we talking about today?" }]);
        }
    }
  }, [initialPrompt, contextTrust]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  
  const handleTrustSelect = (trust) => { setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Let's discuss: ${trust.name}` }, { id: Date.now()+1, type: 'ai', text: `Context set to ${trust.name} (${trust.situs}). Accessing Asset Ledger... Ready.` }]); if (onSelectContext) onSelectContext(trust.id); };
  
  const handleSend = (text) => {
    const userText = text || input; if (!userText) return;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]); setInput(""); setIsThinking(true);
    setTimeout(() => {
        let response = "I have analyzed the request."; let citation = "";
        if (userText.toLowerCase().includes("greg")) { response = "I have analyzed the last 5 emails from Gregory Smith. The sentiment has shifted from 'Inquisitive' to 'Hostile'."; citation = "Source: Email Archive"; }
        else { response = "Based on the trust instrument, Article 4.2 grants you discretion here."; citation = "Source: Trust Instrument, Article 4.2"; }
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: response, citation: citation }]); setIsThinking(false);
    }, 1500);
  };
  return (
    <div className="walnut-card h-[600px] flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center"><h2 className="font-serif font-bold text-stone-800 text-lg flex items-center"><BrainCircuit className="mr-2 text-racing-green" size={24} /> The Oracle</h2><span className="text-xs text-stone-500 font-serif italic">{contextTrust ? `Context: ${contextTrust.name}` : "Global Intelligence"}</span></div>
        <div className="flex-1 overflow-y-auto p-4 bg-[#fdfbf7] space-y-4">{messages.map(msg => (<div key={msg.id} className={msg.type === 'user' ? 'bubble-user' : 'bubble-ai'}><p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />{msg.citation && (<div className="mt-2 pt-2 border-t border-stone-200 text-xs text-stone-500 flex items-center font-bold"><FileText size={10} className="mr-1"/> {msg.citation}</div>)}</div>))}
        {(!contextTrust && messages.length === 1 && !initialPrompt) && (<div className="flex flex-wrap gap-2 mt-2">{TRUSTS.map(t => (<button key={t.id} onClick={() => handleTrustSelect(t)} className="px-3 py-2 bg-white border border-stone-300 rounded-md text-xs font-serif text-stone-700 hover:border-racing-green hover:text-racing-green shadow-sm">{t.name}</button>))}</div>)}
        {isThinking && <div className="bubble-ai text-stone-400 text-sm italic">Consulting the Trust Instrument...</div>}<div ref={bottomRef} /></div>
        <div className="p-4 bg-stone-100 border-t border-stone-200"><div className="flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask a question..." className="flex-1 p-3 rounded-md border border-stone-300 focus:outline-none focus:border-racing-green font-serif text-sm" /><button onClick={() => handleSend()} className="bg-racing-green text-white px-4 py-2 rounded-md font-serif font-bold">Ask</button></div></div>
    </div>
  );
};

const MeetMeRoom = ({ isPrivileged, setIsPrivileged }) => {
  const [viewDoc, setViewDoc] = useState(null);
  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div><h1 className="font-serif text-3xl font-bold text-stone-900">The Meet-Me Room</h1><p className="text-stone-500 font-serif italic">Collaborative Workspace (Drafts & Strategy)</p></div>
           
           {/* MEET-ME TOGGLE (Removed per request - Relying on Global) */}
        </div>
        <div className="walnut-card rounded-lg overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-wider font-serif"><div className="col-span-4">Document Name</div><div className="col-span-3">Trust Context</div><div className="col-span-2">Date</div><div className="col-span-3 text-right">Action</div></div>
          <div className="divide-y divide-stone-100">{DOCUMENTS.map((doc) => { const isHidden = !isPrivileged && doc.type === 'privileged'; if (isHidden) return null; return (<div key={doc.id} className={`p-4 flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-stone-50 transition-colors ${doc.subtype === 'personal_defense' ? 'bg-red-50' : ''}`}><div className="flex items-center space-x-3 lg:col-span-4 w-full min-w-0"><div className={`flex-shrink-0 p-2 rounded-md ${doc.type === 'privileged' ? 'bg-red-100 text-red-800' : 'bg-racing-green-light text-racing-green'}`}><FileText size={18} /></div><div className="min-w-0 flex-1"><p className={`text-sm font-serif truncate ${doc.subtype === 'personal_defense' ? 'text-red-900 font-bold' : 'text-stone-800 font-medium'}`}>{doc.name}</p></div></div><div className="lg:col-span-3 text-xs font-bold text-stone-500 uppercase tracking-wide">{doc.trustName || "Smith Family Trust"}</div><div className="hidden lg:block lg:col-span-2 text-sm text-stone-600 font-serif">{doc.date}</div><div className="lg:col-span-3 text-right mt-1 lg:mt-0"><button onClick={() => setViewDoc(doc)} className="text-stone-400 hover:text-racing-green transition-colors font-serif text-sm w-full lg:w-auto text-left lg:text-right">View</button></div></div>); })}</div>
        </div>
      </div>
      {viewDoc && <DocViewer doc={viewDoc} onClose={() => setViewDoc(null)} />}
    </>
  );
};

const Vault = () => {
    const [viewDoc, setViewDoc] = useState(null);
    const publicDocs = DOCUMENTS.filter(d => d.type === 'public');
    
    return (
      <>
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Permanent Vault</h1><p className="text-stone-500 font-serif italic">Finalized & Archived Records (Read-Only)</p></div></div>
          <div className="walnut-card rounded-lg overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-wider font-serif"><div className="col-span-4">Document Name</div><div className="col-span-3">Trust Context</div><div className="col-span-2">Date</div><div className="col-span-3 text-right">Action</div></div>
            <div className="divide-y divide-stone-100">{publicDocs.map((doc) => (<div key={doc.id} className="p-4 flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-stone-50 transition-colors"><div className="flex items-center space-x-3 lg:col-span-4 w-full min-w-0"><div className="flex-shrink-0 p-2 rounded-md bg-stone-100 text-stone-600"><FileText size={18} /></div><div className="min-w-0 flex-1"><p className="text-sm font-serif truncate text-stone-800 font-medium">{doc.name}</p></div></div><div className="lg:col-span-3 text-xs font-bold text-stone-500 uppercase tracking-wide">{doc.trustName || "Smith Family Trust"}</div><div className="hidden lg:block lg:col-span-2 text-sm text-stone-600 font-serif">{doc.date}</div><div className="lg:col-span-3 text-right mt-1 lg:mt-0"><button onClick={() => setViewDoc(doc)} className="text-stone-400 hover:text-stone-800 transition-colors font-serif text-sm w-full lg:w-auto text-left lg:text-right">View Archive</button></div></div>))}</div>
          </div>
        </div>
        {viewDoc && <DocViewer doc={viewDoc} onClose={() => setViewDoc(null)} />}
      </>
    );
};

const TrustDetail = ({ trustId, onBack, isPrivileged, setIsPrivileged, initialOraclePrompt }) => {
  const [view, setView] = useState('roadmap');
  const trust = TRUSTS.find(t => t.id === trustId);
  if (!trust) return null;
  useEffect(() => { if (initialOraclePrompt) setView('oracle'); }, [initialOraclePrompt]);
  const showNexusWarning = trust.situs !== 'California'; 

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4"><div className="flex items-center space-x-2 flex-1 min-w-0"><button onClick={onBack} className="text-stone-400 hover:text-stone-600 transition-colors"><ChevronLeft size={24} /></button><div className="flex items-center"><h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 truncate tracking-tight">{trust.name}</h1><ChevronRight size={24} className="text-stone-300 ml-2" /></div></div><PrivilegeToggle isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} /></div>
      {showNexusWarning && isPrivileged && (<div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex items-start shadow-sm mb-4"><Globe className="text-orange-600 mr-3 mt-0.5" size={20} /><div><h3 className="text-orange-900 font-bold text-sm font-serif">Jurisdiction Watchdog: Tax Nexus Alert</h3><p className="text-orange-800 text-sm mt-1 font-serif">You are administering a <strong>{trust.situs}</strong> trust from <strong>California</strong>. This may trigger CA state income tax.</p></div></div>)}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Situs</p><div className="flex items-center text-stone-800 font-bold font-serif"><Scale size={16} className="mr-2 text-racing-green"/> {trust.situs}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">EIN</p><div className="flex items-center text-stone-800 font-bold font-serif"><Tag size={16} className="mr-2 text-racing-green"/> {isPrivileged ? trust.ein : '••-•••••••'}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Date of Death</p><div className="flex items-center text-stone-800 font-bold font-serif"><Calendar size={16} className="mr-2 text-racing-green"/> {trust.dateOfDeath}</div></div><div className="walnut-card p-4 flex flex-col justify-center"><p className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1">Total Assets</p><div className="flex items-center text-stone-800 font-bold font-serif"><DollarSign size={16} className="mr-2 text-racing-green"/> ${(trust.assets / 1000000).toFixed(1)}M</div></div></div>
      <div className="flex bg-white rounded-md p-1 border border-stone-200 shadow-sm overflow-x-auto">{['roadmap', 'assets', 'accounting', 'billing', 'oracle', 'meet-me', 'vault'].map(tab => (<button key={tab} onClick={() => setView(tab)} className={`flex-1 px-4 py-2 rounded-sm text-sm font-bold font-serif capitalize transition-colors whitespace-nowrap ${view === tab ? 'bg-racing-green text-white' : 'text-stone-500 hover:text-stone-900'}`}>{tab}</button>))}</div>
      {view === 'roadmap' && (<div className="walnut-card p-6"><h2 className="font-bold text-stone-800 mb-4 font-serif text-xl">Administration Roadmap</h2><div className="space-y-4">{WORKFLOW_STEPS.map(step => (<div key={step.id} className={`p-4 rounded border ${step.status === 'active' ? 'border-racing-green bg-racing-green-light' : 'border-stone-200 bg-stone-50'}`}><div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-800 font-serif">{step.title}</h3>{step.status === 'active' && <span className="text-xs bg-racing-green text-white px-2 py-1 rounded font-serif tracking-wider">ACTIVE</span>}</div><div className="space-y-2 pl-2">{step.items.map((item, i) => (<div key={i} className="flex items-center text-sm font-serif"><CheckCircle size={14} className={`mr-2 ${item.completed ? 'text-racing-green' : 'text-stone-300'}`}/> <span className={item.completed ? 'text-stone-400 line-through' : 'text-stone-700'}>{item.label}</span></div>))}</div></div>))}</div></div>)}
      {view === 'assets' && <AssetManager isPrivileged={isPrivileged} />}
      {view === 'accounting' && <CourtAccounting trust={trust} isPrivileged={isPrivileged} />}
      {view === 'billing' && <BillingModule invoices={INVOICE_HISTORY} />}
      {view === 'oracle' && <OracleInterface initialPrompt={initialOraclePrompt} contextTrust={trust} />}
      {view === 'meet-me' && <MeetMeRoom isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} />}
      {view === 'vault' && <Vault />}
    </div>
  );
};

const ContextInbox = ({ emails }) => {
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [processedEmails, setProcessedEmails] = useState([]);
  const handleProcess = (emailId) => { setProcessedEmails([...processedEmails, emailId]); setSelectedEmailId(null); };
  const activeEmails = emails.filter(e => !processedEmails.includes(e.id));
  const selectedEmail = activeEmails.find(e => e.id === selectedEmailId);
  const getTrustName = (id) => TRUSTS.find(t => t.id === id)?.name || "Unknown Trust";
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fadeIn">
      <div className="md:w-1/3 flex flex-col bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden min-h-0"><div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center"><h2 className="font-bold text-stone-700 flex items-center font-serif"><Inbox size={18} className="mr-2" /> Quarantine Stream</h2><span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full font-serif">{activeEmails.length}</span></div><div className="flex-1 overflow-y-auto">{activeEmails.length === 0 ? (<div className="p-8 text-center text-stone-400"><CheckCircle size={40} className="mx-auto mb-2 text-racing-green opacity-50"/><p className="font-serif">All caught up!</p></div>) : (activeEmails.map(email => (<div key={email.id} onClick={() => setSelectedEmailId(email.id)} className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${selectedEmailId === email.id ? 'bg-racing-green-light border-l-4 border-racing-green' : ''}`}><div className="flex justify-between items-start mb-1"><span className="font-bold text-stone-800 truncate w-2/3 font-serif">{email.sender}</span><span className="text-xs text-stone-400 font-serif">{email.date}</span></div><p className="text-sm font-medium text-stone-600 truncate mb-1 font-serif">{email.subject}</p></div>)))}</div></div>
      <div className="md:w-2/3 flex flex-col bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden relative min-h-0">{!selectedEmail ? (<div className="flex-1 flex flex-col items-center justify-center text-stone-300 p-8 text-center"><ArrowRight size={48} className="mb-4 text-stone-200" /><h3 className="text-lg font-medium text-stone-400 font-serif">Select an item to classify</h3></div>) : (<><div className="p-6 border-b border-stone-200"><h2 className="text-xl font-bold text-stone-900 font-serif mb-4">{selectedEmail.subject}</h2><div className="flex items-center space-x-3 text-sm"><div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold font-serif">{selectedEmail.sender[0].toUpperCase()}</div><div><p className="font-bold text-stone-800 font-serif">{selectedEmail.sender}</p><p className="text-stone-400 font-serif italic">To: You (Trustee)</p></div></div></div><div className="flex-1 p-6 overflow-y-auto text-stone-600 font-serif text-sm">{selectedEmail.body}</div><div className="p-4 bg-stone-50 border-t border-stone-200 flex space-x-3"><button onClick={() => handleProcess(selectedEmail.id)} className="flex-1 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold py-3 rounded shadow-sm font-serif flex items-center justify-center"><FileArchive size={18} className="mr-2"/> File to Admin Archive</button><button onClick={() => handleProcess(selectedEmail.id)} className="flex-1 bg-red-50 border border-red-200 hover:bg-red-100 text-red-900 font-bold py-3 rounded shadow-sm font-serif flex items-center justify-center"><Shield size={18} className="mr-2"/> File to Privileged Zone</button></div></>)}</div>
    </div>
  );
};

// DIGITAL SUCCESSOR MODAL
function DigitalSuccessor() {
    const [showConfig, setShowConfig] = useState(false);
    
    return (
        <div className="space-y-6 animate-fadeIn relative">
             {showConfig && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-2xl">
                         <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Configure Iron Key Protocols</h2>
                         <p className="text-sm text-stone-600 mb-6">Define the triggers that will release the Master Encryption Key to your Successor Trustee.</p>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Inactivity Trigger (Days)</label>
                                 <input type="number" defaultValue={30} className="w-full p-2 border border-stone-300 rounded font-serif" />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Successor Trustee Email</label>
                                 <input type="email" defaultValue="sarah@jenkinslaw.com" className="w-full p-2 border border-stone-300 rounded font-serif" />
                             </div>
                             <div className="flex items-center space-x-2">
                                 <input type="checkbox" defaultChecked />
                                 <span className="text-sm text-stone-700">Require 2-Factor Confirmation from Successor</span>
                             </div>
                         </div>
                         <div className="mt-8 flex justify-end space-x-2">
                             <button onClick={() => setShowConfig(false)} className="px-4 py-2 text-stone-600 font-bold text-sm">Cancel</button>
                             <button onClick={() => setShowConfig(false)} className="px-6 py-2 bg-racing-green text-white font-bold rounded shadow-md">Save Protocols</button>
                         </div>
                     </div>
                 </div>
             )}
             
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6"><div><h1 className="font-serif text-3xl font-bold text-stone-900">Succession Protocol</h1><p className="text-stone-500 font-serif italic">"The Dead Man's Switch"</p></div><div className="px-4 py-2 bg-stone-100 rounded-md border border-stone-200 text-stone-600 text-sm font-serif"><span className="font-bold">Status:</span> ARMED & MONITORING</div></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="walnut-card relative overflow-hidden"><div className="absolute top-0 left-0 w-1 h-full bg-racing-green"></div><div className="flex justify-between items-start mb-4"><h3 className="font-serif text-xl font-bold text-stone-800">Fiduciary Heartbeat</h3><Activity className="text-racing-green" size={24} /></div><div className="flex items-center space-x-4 mb-6"><div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-4 border-racing-green"><UserCheck size={32} className="text-racing-green" /></div><div><p className="text-sm text-stone-500 uppercase tracking-widest font-bold">Last Verification</p><p className="text-2xl font-serif font-bold text-stone-900">Today, 10:42 AM</p></div></div><div className="bg-stone-50 p-4 rounded border border-stone-200"><div className="flex justify-between text-sm mb-1"><span className="text-stone-600">Inactivity Trigger</span><span className="text-red-600 font-bold">30 Days</span></div><div className="w-full bg-stone-200 rounded-full h-2"><div className="bg-racing-green h-2 rounded-full" style={{ width: '2%' }}></div></div><p className="text-xs text-stone-400 mt-2">If no login by <span className="font-bold">Jan 28, 2026</span>, protocol initiates.</p></div></div>
                <div className="bg-stone-900 p-6 rounded-lg shadow-lg text-stone-300"><div className="flex justify-between items-start mb-4"><h3 className="font-serif text-xl font-bold text-white">The Iron Key</h3><Key className="text-amber-500" size={24} /></div><p className="text-sm mb-6 leading-relaxed">Upon confirmed incapacity, the <strong>Master Encryption Key</strong> will be securely transmitted.</p><div className="space-y-4"><div className="flex items-center p-3 bg-stone-800 rounded border border-stone-700"><div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-white font-bold font-serif mr-3">1</div><div><p className="text-sm font-bold text-white">Primary Successor</p><p className="text-xs text-stone-400">Sarah Jenkins (Partner)</p></div><CheckCircle size={16} className="text-racing-green ml-auto" /></div></div><button onClick={() => setShowConfig(true)} className="w-full mt-6 py-3 border border-stone-600 rounded text-stone-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Configure Protocols</button></div>
             </div>
        </div>
    );
}

// Re-using previous definitions for other components to ensure no duplication
function getGreeting() { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening"; }
function MorningBriefing({ onAnalyzeRisk, userName = "Larry" }) {
  const greeting = getGreeting();
  // DYNAMIC DATE CALC
  const daysUntil2026 = Math.ceil((new Date('2026-01-01') - new Date()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="walnut-card mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-4 mb-4"><div><h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center"><Lightbulb className="mr-2 text-racing-green" size={24} />{greeting}, {userName}.</h2><p className="text-stone-500 text-sm font-serif italic mt-1">Here is your practice briefing for today.</p></div><div className="mt-2 md:mt-0 px-3 py-1 bg-racing-green text-white text-xs font-bold rounded-full font-serif">3 Risks Detected</div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md"><div className="flex justify-between items-start"><h3 className="font-bold text-red-800 font-serif text-sm">Litigation Risk</h3><Thermometer size={16} className="text-red-600" /></div><p className="text-red-700 text-xs mt-1 font-serif"><strong>Gregory Smith</strong> marked "High Risk".</p><button onClick={() => onAnalyzeRisk('greg')} className="mt-2 text-xs font-bold text-red-800 underline cursor-pointer">Review Correspondence</button></div>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md"><div className="flex justify-between items-start"><h3 className="font-bold text-yellow-800 font-serif text-sm">Tax Cliff</h3><AlertOctagon size={16} className="text-yellow-600" /></div><p className="text-yellow-700 text-xs mt-1 font-serif">Exemption drops in <strong>{daysUntil2026} Days</strong>.</p><button onClick={() => onAnalyzeRisk('tax')} className="mt-2 text-xs font-bold text-yellow-800 underline cursor-pointer">Analyze Strategy</button></div>
        <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-md"><div className="flex justify-between items-start"><h3 className="font-bold text-orange-800 font-serif text-sm">Nexus Alert</h3><Globe size={16} className="text-orange-600" /></div><p className="text-orange-700 text-xs mt-1 font-serif">Jenkins Estate (NV) / CA Trustee.</p><button onClick={() => onAnalyzeRisk('nexus')} className="mt-2 text-xs font-bold text-orange-800 underline cursor-pointer">Check Liability</button></div>
      </div>
    </div>
  );
}

function Dashboard({ trusts, onSelectTrust, onAnalyzeRisk, onNavigateToTasks, totalAUM }) {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    return (
    <div className="space-y-6">
        {/* CEO STATS (RESTORED & FIXED) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <div className="walnut-card p-4 flex flex-col justify-between">
                 <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Total AUM</p>
                 <p className="text-2xl font-serif font-bold text-stone-900">{formatCurrency(totalAUM)}</p>
                 <div className="w-full bg-stone-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-racing-green h-full w-[70%]"></div></div>
            </div>
            <div className="walnut-card p-4 flex flex-col justify-between">
                 <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">YTD Fees</p>
                 <p className="text-2xl font-serif font-bold text-stone-900">$142,500</p>
                 <div className="w-full bg-stone-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-racing-green h-full w-[45%]"></div></div>
            </div>
            {/* LINKED PENDING ACTIONS CARD */}
            <div onClick={onNavigateToTasks} className="walnut-card p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all border-l-4 border-orange-400">
                 <div className="flex justify-between"><p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Pending Actions</p><ArrowRight size={14} className="text-stone-300"/></div>
                 <p className="text-2xl font-serif font-bold text-stone-900">8</p>
                 <p className="text-[10px] text-red-500 font-bold mt-1">2 High Priority</p>
            </div>
             {/* FIXED 4TH CARD - Hardcoded Style to ensure visibility */}
             <div className="walnut-card p-4 flex flex-col justify-between border-none" style={{ backgroundColor: '#004225', color: 'white' }}>
                 <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#e5f0eb' }}>Fiduciary Status</p>
                 <div className="flex items-center"><CheckCircle size={20} className="mr-2 text-white"/><span className="text-xl font-bold">Active</span></div>
                 <p className="text-[10px] mt-1" style={{ color: '#e5f0eb' }}>Next check-in: 28 days</p>
            </div>
        </div>

        <MorningBriefing onAnalyzeRisk={onAnalyzeRisk} />

        <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Active Engagements</h2>
        <div className="grid gap-4">
            {trusts.map((trust) => (
            <div key={trust.id} onClick={() => onSelectTrust(trust.id)} className="walnut-card cursor-pointer hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h3 className="font-bold text-stone-800 text-lg font-serif">{trust.name}</h3>
                        <ChevronRight size={20} className="text-racing-green ml-2"/>
                    </div>
                    <span className="text-sm text-stone-500 font-serif">{trust.situs}</span>
                </div>
            </div>
            ))}
        </div>
    </div>
    );
}

// --- LOGIN SCREEN COMPONENT ---
const LoginScreen = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="walnut-card max-w-md w-full p-8 text-center shadow-xl border-t-4 border-racing-green">
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-racing-green rounded-full flex items-center justify-center">
                 <Shield className="text-white h-8 w-8" />
              </div>
           </div>
           <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Fiduciary OS</h1>
           <p className="text-stone-500 font-serif italic mb-8">Secure Trust Administration System</p>
           
           <button 
             onClick={handleLogin}
             className="w-full py-3 px-4 bg-white border border-stone-300 rounded shadow-sm text-stone-700 font-bold font-sans hover:bg-stone-50 transition-all flex items-center justify-center"
           >
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
             Sign in with Google
           </button>
           
           <p className="mt-6 text-xs text-stone-400">Restricted Access. Authorized Fiduciaries Only.</p>
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTrustId, setSelectedTrustId] = useState(null);
  const [isPrivileged, setIsPrivileged] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [oraclePrompt, setOraclePrompt] = useState(null);

  const [trusts, setTrusts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [totalAUM, setTotalAUM] = useState(0);
  const [documents, setDocuments] = useState([]);

  // --- INITIALIZATION: FIREBASE + SEED ---
  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // App Init
    const init = async () => {
      const handleResize = () => { setIsMobile(window.innerWidth < 1024); if (window.innerWidth >= 1024) setIsOpen(false); };
      handleResize();
      window.addEventListener('resize', handleResize);

      // MOCK DB LOAD (Tasks/Vendors still mock for now)
      // Trusts are now fetched live from Firestore
      setTasks(SEED_TASKS);
      setVendors(SEED_VENDORS);
      setLoading(false);
      
      return () => window.removeEventListener('resize', handleResize);
    };
    init();

    // Fetch Trusts Data (Live)
    const fetchTrustsData = async () => {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "trusts"));
            const loadedTrusts = [];
            let sum = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Map Firestore doc to Trust object structure
                loadedTrusts.push({
                    id: doc.id,
                    name: data.name || "Unnamed Trust",
                    situs: data.situs || "Unknown",
                    assets: Number(data.assets || 0),
                    // Preserve other fields if needed or default them
                    type: data.type || "Trust",
                    status: data.status || "active",
                    progress: 0,
                    nextTask: "Review",
                    ein: data.ein || "",
                    dateOfDeath: data.date_of_death || "N/A"
                });
                sum += Number(data.assets || 0);
            });
            
            setTrusts(loadedTrusts);
            setTotalAUM(sum);
        } catch (error) {
            console.error("Error fetching trusts:", error);
        }
    };
    // Fetch Documents (Context Inbox)
    const fetchDocuments = async () => {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "documents"));
            const docs = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                docs.push({
                    id: doc.id,
                    sender: data.trustName || "Unknown Trust", // Mapping trustName to sender for visibility
                    subject: data.subject || "(No Subject)",
                    date: "Today",
                    body: data.body || "Retrieved from secure storage.",
                    type: "alert",
                    aiConfidence: 0.99
                });
            });
            setDocuments(docs);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    if (user) {
        fetchTrustsData();
        fetchDocuments();
    }

    return () => unsubscribeAuth();
  }, [user]);

  const handleTabSwitch = (tab) => { setActiveTab(tab); setSelectedTrustId(null); setOraclePrompt(null); };
  
  const handleAnalyzeRisk = (riskType) => {
    setSelectedTrustId(1); // Use ID number 1 from seed (Fixed from 't1' string)
    if (riskType === 'greg') setOraclePrompt("Analyze Gregory Smith's recent emails for hostility.");
    if (riskType === 'tax') setOraclePrompt("Analyze tax cliff liability.");
    if (riskType === 'nexus') setOraclePrompt("Check Nexus liability for California trustee.");
  };

  if (authLoading || loading) return <div className="h-screen flex items-center justify-center bg-stone-50 font-serif text-racing-green"><Loader className="animate-spin mr-2"/> Loading Fiduciary OS...</div>;

  if (!user) return <LoginScreen />;

  return (
    <>
      <GlobalStyles />
      <div className="bg-[#f5f5f0] font-sans text-stone-800 flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={handleTabSwitch} isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} isMobile={isMobile} isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="md:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30"><button onClick={() => setIsOpen(true)} className="text-stone-600 font-bold"><Menu/></button><span className="font-serif text-lg font-bold text-stone-900">FOS</span><div className="w-6 text-xl">{isPrivileged ? <Lock size={18}/> : <Unlock size={18}/>}</div></div>
            <main className="p-4 md:p-8 w-full">
               <div className="max-w-6xl mx-auto">
                 {selectedTrustId ? (
                   <TrustDetail trustId={selectedTrustId} onBack={() => { setSelectedTrustId(null); setOraclePrompt(null); }} isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} initialOraclePrompt={oraclePrompt} />
                 ) : (
                   <>
                     {activeTab === 'dashboard' && <Dashboard totalAUM={totalAUM} trusts={trusts} onSelectTrust={setSelectedTrustId} onAnalyzeRisk={handleAnalyzeRisk} onNavigateToTasks={() => setActiveTab('tasks')} />}
                     {activeTab === 'oracle' && <OracleInterface />}
                     {activeTab === 'inbox' && <ContextInbox emails={documents} />}
                     {activeTab === 'meet-me' && <MeetMeRoom isPrivileged={isPrivileged} setIsPrivileged={setIsPrivileged} />}
                     {activeTab === 'trusts' && (<div className="space-y-6"><h2 className="font-serif text-2xl font-bold text-stone-900">My Trusts</h2><div className="grid gap-4">{TRUSTS.map((trust) => (<div key={trust.id} onClick={() => setSelectedTrustId(trust.id)} className="walnut-card cursor-pointer hover:shadow-md"><div className="flex justify-between items-center"><h3 className="font-bold text-stone-800 text-lg font-serif">{trust.name}</h3><span className="text-sm text-stone-500 font-serif">{trust.situs}</span></div></div>))}</div></div>)}
                     {activeTab === 'rolodex' && <VendorRolodex vendors={VENDORS_MOCK} />}
                     {activeTab === 'documents' && <Vault />}
                     {activeTab === 'legacy' && <DigitalSuccessor />}
                     {activeTab === 'admin' && <AdminConsole />}
                     {activeTab === 'tasks' && <TaskCommandCenter tasks={SEED_TASKS} trusts={TRUSTS} onMoveTask={()=>{}} />}
                   </>
                 )}
               </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
