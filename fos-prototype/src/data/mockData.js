export const TRUSTS = [
  { id: 1, name: "The Smith Family Dynasty Trust", situs: "Nevada", type: "Irrevocable", status: "active", assets: 14200000, progress: 35, nextTask: "Review 706 Draft", ein: "88-1234567", dateOfDeath: "Oct 12, 2024" },
  { id: 2, name: "Estate of Arthur P. Jenkins", situs: "California", type: "Revocable", status: "critical", assets: 2100000, progress: 15, nextTask: "Marshaling", ein: "99-7654321", dateOfDeath: "Nov 01, 2024" },
  { id: 3, name: "Llewellyn Charitable Trust", situs: "Wyoming", type: "CRT", status: "active", assets: 5600000, progress: 45, nextTask: "Distribution", ein: "45-9988776", dateOfDeath: "N/A" }
];
export const SEED_TRUSTS = TRUSTS;

export const SEED_TASKS = [
    { id: 1, title: "File 706 Return", trustId: 1, priority: "High", status: "todo", due: "2 Days" },
    { id: 2, title: "Approve Appraiser Invoice", trustId: 2, priority: "Medium", status: "todo", due: "Today" },
    { id: 3, title: "Draft Response to Greg", trustId: 1, priority: "High", status: "in-progress", due: "ASAP" },
    { id: 4, title: "Quarterly Distribution", trustId: 3, priority: "Low", status: "todo", due: "Next Week" },
    { id: 5, title: "Review Investment Performance", trustId: 1, priority: "Medium", status: "done", due: "Yesterday" },
    // STEP 3: Added Backlog tasks
    { id: 6, title: "Update Beneficiary Contact Info", trustId: 1, priority: "Low", status: "backlog", due: "Next Month" },
    { id: 7, title: "Schedule Annual Trust Review", trustId: 3, priority: "Medium", status: "backlog", due: "Q1 2025" },
    // STEP 3: Added Review tasks
    { id: 8, title: "Final 706 Draft Review", trustId: 1, priority: "High", status: "review", due: "Tomorrow" },
    { id: 9, title: "CPA K-1 Verification", trustId: 1, priority: "Medium", status: "review", due: "This Week" },
    { id: 10, title: "Creditor Claim Summary", trustId: 2, priority: "High", status: "review", due: "Today" },
];

export const SEED_VENDORS = [
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
export const VENDORS_MOCK = SEED_VENDORS;

export const ASSETS_MOCK = [
  { id: 'a1', trustId: 1, name: "123 Highland Ave", type: "Real Estate", currentValue: 2600000, notes: "Appraisal low." },
  { id: 'a2', trustId: 1, name: "Chase Checking", type: "Cash", currentValue: 425000, notes: "Operating." },
  { id: 'a3', trustId: 1, name: "Smith Family LLC", type: "Business", currentValue: 4500000, notes: "Discounted." },
  { id: 'a4', trustId: 1, name: "NVIDIA Corp", type: "Securities", currentValue: 6800000, notes: "Verified." },
  { id: 'a5', trustId: 1, name: "Coinbase Wallet", type: "Digital Asset", currentValue: 920000, notes: "Secured. Custodian: Coinbase." }
];

export const TRANSACTIONS = [
    { id: 1, date: "2024-11-01", type: "Receipt", category: "Interest", desc: "Chase Bank Interest", incomeRx: 450.22, incomeDx: 0, princRx: 0, princDx: 0 },
    { id: 2, date: "2024-11-05", type: "Disbursement", category: "Expense", desc: "Legal Fees - Jenkins Law", incomeRx: 0, incomeDx: 2500.00, princRx: 0, princDx: 0 }, 
    { id: 3, date: "2024-11-15", type: "Receipt", category: "Dividend", desc: "NVIDIA Div", incomeRx: 1200.00, incomeDx: 0, princRx: 0, princDx: 0 },
    { id: 4, date: "2024-11-20", type: "Disbursement", category: "Expense", desc: "Appraisal Fee", incomeRx: 0, incomeDx: 4000.00, princRx: 0, princDx: 0 }, 
    { id: 5, date: "2024-11-25", type: "Receipt", category: "Gain", desc: "Sale of Ford Truck", incomeRx: 15000.00, incomeDx: 0, princRx: 0, princDx: 0 }, // Principal Receipt
    { id: 6, date: "2024-11-28", type: "Disbursement", category: "Expense", desc: "Funeral Expenses", incomeRx: 0, incomeDx: 0, princRx: 0, princDx: 8500.00 }, // Principal Expense
];

export const BILLING_ENTRIES = [
    { id: 1, date: "Today", desc: "Reviewing 706 Draft", hours: 0.8, rate: 250, total: 200.00 },
    { id: 2, date: "Yesterday", desc: "Call with Beneficiary (Greg)", hours: 0.4, rate: 250, total: 100.00 },
    { id: 3, date: "Yesterday", desc: "Bank Visit - Retitling", hours: 1.5, rate: 250, total: 375.00 },
];

export const INVOICE_HISTORY = [
    { id: "INV-000013", date: "28 Nov 2025", client: "The Smith Family Trust", amount: 4556.65, status: "Overdue", days: 8 },
    { id: "INV-000012", date: "14 Oct 2025", client: "The Smith Family Trust", amount: 2355.78, status: "Paid", days: 0 },
    { id: "INV-000011", date: "02 Oct 2025", client: "Estate of A. Jenkins", amount: 8002.81, status: "Paid", days: 0 },
    { id: "INV-000010", date: "12 Sep 2025", client: "The Smith Family Trust", amount: 671.50, status: "Paid", days: 0 },
];

export const DOCUMENTS = [
  { id: 101, name: "Death Certificate.pdf", type: "public", date: "Oct 12, 2024", size: "1.2 MB", trustName: "The Smith Family Dynasty Trust" },
  { id: 102, name: "Trust Instrument.pdf", type: "public", date: "Sep 01, 2020", size: "4.5 MB", trustName: "The Smith Family Dynasty Trust" },
  { id: 103, name: "Valuation_Draft_v2.docx", type: "privileged", subtype: "admin_work_product", date: "Today", size: "24 KB", trustName: "The Smith Family Dynasty Trust" },
  { id: 104, name: "Liability_Memo.msg", type: "privileged", subtype: "personal_defense", date: "Yesterday", size: "15 KB", trustName: "The Smith Family Dynasty Trust" },
  { id: 105, name: "Chase_Bank_Statement_Nov.pdf", type: "public", date: "Nov 30, 2024", size: "1.8 MB", trustName: "Estate of Arthur P. Jenkins" },
];

export const LEGAL_TEXTS = {
  102: `THE SMITH FAMILY DYNASTY TRUST\n...`,
  101: `CERTIFICATE OF DEATH\n...`,
};

export const WORKFLOW_STEPS = [
  { id: 'step1', title: "Immediate Post-Death", status: "complete", items: [{ label: "Order Death Certs", completed: true }, { label: "Notify Soc Sec", completed: true }] },
  { id: 'step2', title: "Marshaling", status: "active", items: [{ label: "Identify Accounts", completed: true }, { label: "Secure Digital Assets", completed: false }, { label: "Creditor Notice", completed: false }] },
  { id: 'step3', title: "Tax Compliance", status: "pending", items: [{ label: "GST Exemption", completed: false }, { label: "Review Draft 706", completed: false }] },
];

export const INCOMING_EMAILS = [
  { id: 'e1', trustId: 1, sender: "attorney@lawfirm.com", subject: "Draft 706", date: "10:42 AM", aiConfidence: 0.98, body: "Attached is the draft 706. Please review the GST allocations.", suggestedTrust: 't1', suggestedTag: "Tax", folder: "quarantine", classification: "needs_review" },
  { id: 'e2', trustId: 1, sender: "greg@gmail.com", subject: "When do I get my money?", date: "9:15 AM", aiConfidence: 0.85, body: "It's been 6 months. I need a distribution.", suggestedTrust: 't1', suggestedTag: "Risk", folder: "quarantine", classification: "needs_review" },
  { id: 'e3', trustId: 1, sender: "bob@vancecpa.com", subject: "K-1 Forms Ready for Review", date: "Yesterday", aiConfidence: 0.96, body: "Hi Larry, I've completed the K-1 forms for all beneficiaries. Please review before we distribute. Note: Greg's K-1 shows significant capital gains this year.", suggestedTrust: 't1', suggestedTag: "Tax", folder: "quarantine", classification: "needs_review" },
  { id: 'e4', trustId: 1, sender: "claims@metlife.com", subject: "Life Insurance Claim - Policy #ML-2024-556789", date: "Yesterday", aiConfidence: 0.92, body: "Your claim has been approved. Payment of $2,500,000 will be issued to the trust within 10 business days. Please confirm banking details.", suggestedTrust: 't1', suggestedTag: "Asset", folder: "quarantine", classification: "needs_review" },
  { id: 'e5', trustId: 2, sender: "sarah@jenkinslaw.com", subject: "Creditor Claim Deadline Approaching", date: "Dec 17", aiConfidence: 0.99, body: "Reminder: The 4-month creditor claim period for the Jenkins Estate expires on January 15th. We've received 12 claims totaling $847,000. Please review the attached summary before our call tomorrow.", suggestedTrust: 't2', suggestedTag: "Legal", folder: "quarantine", classification: "needs_review" },
  { id: 'e6', trustId: 1, sender: "notices@irs.gov", subject: "CP2000 Notice - Trust EIN 88-1234567", date: "Dec 16", aiConfidence: 0.88, body: "We have identified a discrepancy in the income reported on Form 1041. The reported dividend income does not match our records. Response required within 30 days.", suggestedTrust: 't1', suggestedTag: "Tax", folder: "quarantine", classification: "needs_review" },
  { id: 'e7', trustId: 1, sender: "wealth@ntrs.com", subject: "Q4 Portfolio Review Scheduled", date: "Dec 15", aiConfidence: 0.94, body: "This is a reminder that your quarterly investment review is scheduled for December 22nd at 2:00 PM PST. We'll discuss rebalancing strategies and the impact of recent market volatility on the trust portfolios.", suggestedTrust: 't1', suggestedTag: "Investment", folder: "quarantine", classification: "needs_review" },
  { id: 'e8', trustId: 3, sender: "executor@llewellyn-foundation.org", subject: "Annual Distribution Calculation", date: "Dec 14", aiConfidence: 0.97, body: "Per Article 5.2 of the trust instrument, the Q4 charitable distribution is due by December 31st. Based on current asset values, the required distribution is $280,000. Please confirm authorization.", suggestedTrust: 't3', suggestedTag: "Distribution", folder: "quarantine", classification: "needs_review" },
];

export const NEXUS_ACTIVITY_CATEGORIES = [
    { value: 'safe', label: '✅ Safe in CA', color: 'green', examples: 'Correspondence, reviewing statements, beneficiary calls' },
    { value: 'caution', label: '⚠️ Caution', color: 'yellow', examples: 'Investment decisions, distribution approvals, tax elections' },
    { value: 'delegate', label: '🚫 Delegate to NV', color: 'red', examples: 'Signing trust docs, real estate transactions, court appearances' },
];

export const getAccountingData = (trustId) => {
    if (!trustId) return { charges: [], credits: [] };
    
    let charges = [ { id: 'A', name: "Property on Hand (Start)", value: 14200000 }, { id: 'B', name: "Receipts (Income)", value: 150000 } ];
    let credits = [ { id: 'E', name: "Disbursements (Expenses)", value: 25000 }, { id: 'H', name: "Property on Hand (Ending)", value: 14375000 } ];
    if (trustId === 2) { credits[0].value = 25500; }
    return { charges, credits };
};
