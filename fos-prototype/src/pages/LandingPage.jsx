import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ChevronRight,
  Menu,
  X,
  Check,
  Activity,
  Inbox,
  Briefcase,
  BrainCircuit,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  Hourglass,
  Settings,
  Key
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { id: 'platform', label: 'Platform' },
      { id: 'solutions', label: 'Solutions' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'resources', label: 'Resources' }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* HubSpot-Style Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Area */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-[#183B56] rounded-lg flex items-center justify-center shadow-md">
                <Shield className="text-[#F5C26B] h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-[#183B56] leading-none">Fiduciary OS</span>
                <span className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Operating System</span>
              </div>
            </div>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="hover:text-[#183B56] transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Action Buttons (HubSpot Style Hierarchy) */}
            <div className="flex items-center gap-3">
              {/* 1. Welcome Back (Tertiary/Ghost) */}
              <button 
                onClick={() => navigate('/login')}
                className="hidden md:block text-slate-600 hover:text-[#183B56] font-medium text-sm px-3 py-2"
              >
                Welcome back
              </button>

              {/* 2. Schedule a Demo (Secondary/Outline) */}
              <button 
                onClick={() => navigate('/login?intent=demo')}
                className="hidden sm:block text-[#183B56] border border-[#183B56] hover:bg-slate-50 font-bold text-sm px-5 py-2.5 rounded transition-all"
              >
                Schedule a demo
              </button>

              {/* 3. Get Started Free (Primary/Solid) */}
              <button 
                onClick={() => navigate('/get-started')}
                className="bg-[#FF5C35] hover:bg-[#E54C28] text-white font-bold text-sm px-6 py-2.5 rounded shadow-sm hover:shadow transition-all flex items-center"
              >
                Get started free
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-slate-600"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-left px-3 py-2 rounded text-sm font-semibold text-[#183B56] hover:bg-slate-50"
                >
                  Welcome back
                </button>
                <button
                  onClick={() => navigate('/login?intent=demo')}
                  className="w-full px-3 py-2 rounded text-sm font-bold border border-[#183B56] text-[#183B56] hover:bg-slate-50"
                >
                  Schedule a demo
                </button>
                <button
                  onClick={() => navigate('/get-started')}
                  className="w-full px-3 py-2 rounded text-sm font-bold bg-[#FF5C35] hover:bg-[#E54C28] text-white"
                >
                  Get started free
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section / Template Container */}
      <main className="relative">
        {/* 
            ========================================================================
            GEMINI TEMPLATE PLACEHOLDER
            Paste the content from the Gemini-generated template below this comment.
            ========================================================================
        */}
        
        <div className="bg-[#FFF8F0] border-b border-[#F5E6D3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#007A65] text-xs font-bold tracking-wide uppercase mb-6">
                <Shield className="w-3 h-3" />
                Fiduciary Defense Grade
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#183B56] leading-tight mb-6">
                The Operating System for <span className="text-[#007A65]">Professional Fiduciaries</span>.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                Run trust administration from a single pane of glass—built to reduce personal liability, preserve privilege, and keep every action audit-ready.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/get-started')}
                  className="bg-[#FF5C35] hover:bg-[#E54C28] text-white font-bold text-lg px-8 py-4 rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                >
                  Get started free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => navigate('/login?intent=demo')}
                  className="text-[#183B56] font-bold text-lg px-8 py-4 rounded border border-slate-300 hover:border-[#183B56] bg-white transition-all"
                >
                  Schedule a demo
                </button>
              </div>
              
              <p className="mt-6 text-sm text-slate-500">
                No credit card required. SOC2 Compliant.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Trusted by</div>
                <div className="mt-2 text-slate-700 font-semibold">Professional fiduciaries, estate attorneys, and accounting teams</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                {['Jenkins Law', 'Vance CPA', 'Walnut Trust Co.', 'Redwood Estates'].map((name) => (
                  <div key={name} className="h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section id="platform" className="py-24 bg-[#F1FBF7] border-y border-[#D6EFE7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Platform</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-[#183B56]">One place to run every trust like a system.</h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                  FOS turns scattered checklists, email threads, and tribal knowledge into a repeatable operating model: deadlines, decisions, documents, and audit trail.
                </p>
                <div className="mt-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-[#E6F4F1] rounded-lg flex items-center justify-center mb-6">
                        <Activity className="w-6 h-6 text-[#007A65]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#183B56] mb-3">Command Center</h3>
                      <p className="text-slate-600">Your landing page for every trust: triage, deadlines, and risk signals in one place.</p>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-[#FFF1E6] rounded-lg flex items-center justify-center mb-6">
                        <BrainCircuit className="w-6 h-6 text-[#FF5C35]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#183B56] mb-3">Fiduciary Mind</h3>
                      <p className="text-slate-600">Query documents and correspondence to draft responses faster with defensible context.</p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 text-[#183B56]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#183B56] mb-3">Compliance Watchdog</h3>
                      <p className="text-slate-600">A forward-looking view of filings and duties so deadlines don’t become liabilities.</p>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-[#FFFBEB] rounded-lg flex items-center justify-center mb-6">
                        <Key className="w-6 h-6 text-[#B45309]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#183B56] mb-3">The Iron Key</h3>
                      <p className="text-slate-600">Automated successor handoff safeguards that activate on inactivity so nothing gets stranded.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-700">Application navigation</div>
                  <div className="text-xs font-semibold text-slate-400">Preview</div>
                </div>
                <div className="p-0">
                  <div className="grid grid-cols-12">
                    <div className="col-span-5 sm:col-span-4 bg-slate-900 text-slate-200">
                      <div className="px-5 py-5 flex items-center gap-2 border-b border-slate-800">
                        <Shield className="w-6 h-6 text-[#007A65]" />
                        <div className="font-serif font-bold tracking-wide text-slate-100">FOS</div>
                      </div>
                      <div className="px-4 py-4 space-y-1">
                        {[
                          { icon: Activity, label: 'Command Center', active: true },
                          { icon: Inbox, label: 'Context Inbox' },
                          { icon: Briefcase, label: 'My Trusts' },
                          { icon: BrainCircuit, label: 'Fiduciary Mind' },
                          { icon: Users, label: 'Meet-Me Room' },
                          { icon: BookOpen, label: 'Rolodex' },
                          { icon: ClipboardList, label: 'Compliance Roadmap' },
                          { icon: FileText, label: 'The Vault' },
                          { icon: Hourglass, label: 'Succession Protocol' },
                          { icon: Settings, label: 'Admin Console' }
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${
                              item.active ? 'bg-[#007A65] text-white' : 'text-slate-300'
                            }`}
                          >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-7 sm:col-span-8 bg-white">
                      <div className="p-6">
                        <div className="h-10 rounded-lg border border-slate-200 bg-slate-50" />
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="h-28 rounded-lg border border-slate-200 bg-white shadow-sm" />
                          <div className="h-28 rounded-lg border border-slate-200 bg-white shadow-sm" />
                        </div>
                        <div className="mt-3 h-28 rounded-lg border border-slate-200 bg-white shadow-sm" />
                        <div className="mt-3 h-24 rounded-lg border border-slate-200 bg-white shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section id="solutions" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Solutions</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-[#183B56]">Built for real-world fiduciary pressure.</h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                  Designed for the work you actually do: triage, deadlines, documentation, court accounting readiness, and stakeholder communication.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="grid gap-4">
                  {[
                    { title: 'Deadline defense', text: 'See upcoming filings across all trusts and never miss a court-driven requirement.' },
                    { title: 'Inbox triage', text: 'Classify correspondence into privileged vs public record with an audit breadcrumb.' },
                    { title: 'Vault-ready artifacts', text: 'Store critical docs and credentials so you can transition safely when needed.' }
                  ].map((f) => (
                    <div key={f.title} className="flex gap-3">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-[#E6F4F1] text-[#007A65] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{f.title}</div>
                        <div className="mt-1 text-sm text-slate-600">{f.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/login?intent=demo')}
                    className="px-4 py-3 rounded-lg border border-[#183B56] text-[#183B56] font-bold text-sm hover:bg-slate-50"
                  >
                    Schedule a demo
                  </button>
                  <button
                    onClick={() => navigate('/app')}
                    className="px-4 py-3 rounded-lg bg-[#183B56] hover:bg-[#102A3D] text-white font-bold text-sm"
                  >
                    Explore the app
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Pricing</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-[#183B56]">Start free. Upgrade when you scale.</h2>
              <p className="mt-4 text-lg text-slate-600">A simple model that supports solo fiduciaries and growing firms.</p>
            </div>

            <div className="mt-10 grid md:grid-cols-4 gap-6">
              {[ 
                { name: 'Starter', price: '$0', note: 'For evaluation and demos', cta: 'Get started free', primary: false, items: ['Single workspace', 'Sample data', 'Core navigation', 'Demo login'] },
                { name: 'Standard', price: '$149', note: 'Per user / month', cta: 'Schedule a demo', primary: true, items: ['Ledger', 'The Vault', 'Privilege Firewall'] },
                { name: 'Professional', price: '$249', note: 'Per user / month', cta: 'Schedule a demo', primary: false, items: ['Everything in Standard', 'AI', 'Court-ready audit', 'Accounting engine'] },
                { name: 'Dynasty', price: '$449', note: 'Per user / month', cta: 'Schedule a demo', primary: false, items: ['Everything in Professional', 'Successor Protocol', 'Nexus Watchdog'] }
              ].map((plan) => (
                <div key={plan.name} className={`rounded-2xl border ${plan.primary ? 'border-[#183B56] shadow-md' : 'border-slate-200'} bg-white p-6`}>
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-slate-900">{plan.name}</div>
                        {plan.primary && (
                          <div className="px-2 py-1 rounded-full bg-[#E6F4F1] text-[#007A65] text-[11px] font-bold uppercase tracking-widest">
                            Recommended
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-3xl font-serif font-bold text-[#183B56]">{plan.price}</div>
                        <div className="text-xs font-semibold text-slate-400 whitespace-nowrap">{plan.note}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        if (plan.name === 'Starter') navigate('/get-started');
                        else navigate('/login?intent=demo');
                      }}
                      className={`${plan.primary ? 'bg-[#FF5C35] hover:bg-[#E54C28] text-white' : 'border border-slate-300 hover:border-[#183B56] text-[#183B56]'} w-full font-bold text-sm px-4 py-3 rounded-lg transition-colors`}
                    >
                      {plan.cta}
                    </button>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-slate-500" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Resources</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-[#183B56]">Proof-driven, audit-ready operations.</h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                  Every action can be reviewable. Make it easy to show your work: what happened, who did it, and when.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-bold text-slate-900">Frequently asked</div>
                <div className="mt-4 space-y-3">
                  {[ 
                    { q: 'Is this a replacement for my email?', a: 'No. It organizes fiduciary work around inbox triage, deadlines, and artifacts.' },
                    { q: 'Does it support privileged vs public record?', a: 'Yes. Privileged mode can be restricted and audit breadcrumbs are recorded.' },
                    { q: 'Can I try it out before I purchase?', a: 'Yes. Click the "Get Started Free" button for a run of the entire application and see how it can enhance your workflows and your protection.' }
                  ].map((row) => (
                    <div key={row.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-sm font-bold text-slate-900">{row.q}</div>
                      <div className="mt-1 text-sm text-slate-600">{row.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#183B56] text-white p-8 md:p-12 overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold">Make fiduciary work defensible by default.</h2>
                  <p className="mt-3 text-slate-200 text-lg">Start free or schedule a walkthrough tailored to your firm.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                  <button
                    onClick={() => navigate('/get-started')}
                    className="px-6 py-3 rounded-lg bg-[#FF5C35] hover:bg-[#E54C28] text-white font-bold"
                  >
                    Get started free
                  </button>
                  <button
                    onClick={() => navigate('/login?intent=demo')}
                    className="px-6 py-3 rounded-lg border border-white/30 hover:border-white/60 text-white font-bold"
                  >
                    Schedule a demo
                  </button>
                </div>
              </div>
            </div>

            <footer className="mt-10 py-10 border-t border-slate-100">
              <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-[#183B56] rounded-lg flex items-center justify-center">
                    <Shield className="text-[#F5C26B] h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[#183B56]">Fiduciary OS</div>
                    <div className="text-xs text-slate-500">Defense-grade operations for trust administration</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">© {new Date().getFullYear()} Fiduciary OS. All rights reserved.</div>
              </div>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
