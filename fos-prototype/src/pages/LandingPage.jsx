import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Menu, X, Check } from 'lucide-react';

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
                Eliminate the "Bus Factor", automate compliance, and protect your license with the first purpose-built platform for Trust Administration.
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

        <section id="platform" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Platform</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-[#183B56]">One place to run every trust like a system.</h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                  FOS turns scattered checklists, email threads, and tribal knowledge into a repeatable operating model: deadlines, decisions, documents, and audit trail.
                </p>
                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  {[
                    { value: '30d', label: 'Compliance horizon' },
                    { value: '1', label: 'Unified inbox' },
                    { value: '∞', label: 'Audit trail' }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-2xl font-serif font-bold text-[#183B56]">{stat.value}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-700">FOS Command Center</div>
                  <div className="text-xs font-semibold text-slate-400">Live preview</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5 space-y-3">
                      {['Compliance Roadmap', 'Context Inbox', 'The Vault'].map((row) => (
                        <div key={row} className="h-10 rounded-lg border border-slate-100 bg-white flex items-center px-3 text-sm font-semibold text-slate-700">
                          {row}
                        </div>
                      ))}
                      <div className="h-24 rounded-lg border border-slate-100 bg-white" />
                    </div>
                    <div className="col-span-7 space-y-3">
                      <div className="h-10 rounded-lg border border-slate-100 bg-white" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-28 rounded-lg border border-slate-100 bg-white" />
                        <div className="h-28 rounded-lg border border-slate-100 bg-white" />
                      </div>
                      <div className="h-24 rounded-lg border border-slate-100 bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-12">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                   <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#183B56] mb-3">The Bus Factor</h3>
                <p className="text-slate-600">
                  Automated "Dead Man's Switch" ensures your successor has immediate, encrypted access if you become incapacitated.
                </p>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                   <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-[#183B56] mb-3">Jurisdiction Watchdog</h3>
                <p className="text-slate-600">
                  Geo-fenced alerts warn you when your physical location risks triggering accidental tax nexus for the Trust.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                   <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-[#183B56] mb-3">Visual Compliance</h3>
                <p className="text-slate-600">
                  Turn abstract duties into a concrete roadmap. Every action is logged, stamped, and auditable forever.
                </p>
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

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[ 
                { name: 'Starter', price: '$0', note: 'For evaluation and demos', cta: 'Get started free', primary: false, items: ['Single workspace', 'Sample data', 'Core navigation', 'Demo login'] },
                { name: 'Professional', price: '$249', note: 'Per user / month', cta: 'Schedule a demo', primary: true, items: ['Multi-trust operations', 'Inbox triage + audit', 'Vault + permissions', 'Compliance roadmap'] },
                { name: 'Firm', price: 'Custom', note: 'For teams and integrations', cta: 'Talk to sales', primary: false, items: ['SSO & provisioning', 'Custom retention', 'Reporting exports', 'Implementation support'] }
              ].map((plan) => (
                <div key={plan.name} className={`rounded-2xl border ${plan.primary ? 'border-[#183B56] shadow-md' : 'border-slate-200'} bg-white p-6`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{plan.name}</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-3xl font-serif font-bold text-[#183B56]">{plan.price}</div>
                        <div className="text-xs font-semibold text-slate-400">{plan.note}</div>
                      </div>
                    </div>
                    {plan.primary && (
                      <div className="px-2 py-1 rounded-full bg-[#E6F4F1] text-[#007A65] text-[11px] font-bold uppercase tracking-widest">Most popular</div>
                    )}
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
                    { q: 'Can I try it without configuring Firebase?', a: 'Yes. Use the demo credentials to explore the workflow.' }
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
