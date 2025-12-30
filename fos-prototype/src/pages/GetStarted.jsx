import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff, Shield } from 'lucide-react';

const StepFooter = ({ backLabel = 'Back', onBack, nextLabel = 'Next', onNext, nextDisabled }) => (
  <div className="mt-auto pt-8 border-t border-slate-200 flex items-center justify-between">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
    >
      <ArrowLeft className="w-4 h-4" />
      {backLabel}
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={nextDisabled}
      className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${nextDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#183B56] hover:bg-[#102A3D] text-white'}`}
    >
      {nextLabel}
    </button>
  </div>
);

const StepActions = ({ leftLabel, onLeft, rightLabel, onRight, rightDisabled }) => (
  <div className="mt-auto pt-8 border-t border-slate-200 flex items-center justify-between gap-3">
    <button
      type="button"
      onClick={onLeft}
      className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition"
    >
      {leftLabel}
    </button>
    <button
      type="button"
      onClick={onRight}
      disabled={rightDisabled}
      className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold shadow-sm transition ${rightDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#183B56] hover:bg-[#102A3D] text-white'}`}
    >
      {rightLabel}
    </button>
  </div>
);

const StepContainer = ({ title, subtitle, children, footer }) => (
  <div className="w-full max-w-md flex flex-col min-h-[560px]">
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle ? <p className="mt-2 text-slate-600">{subtitle}</p> : null}
    </div>
    <div className="mt-10">{children}</div>
    {footer}
  </div>
);

export const GetStarted = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('start');
  const [signup, setSignup] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyWebsite: '',
    orgSize: '',
    password: '',
    provider: 'email'
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [emailSendError, setEmailSendError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const codeInputRefs = useRef([]);

  const isEmailDeliveryNotConfiguredError = (e) =>
    e instanceof Error && /not configured/i.test(e.message || '');

  const demoPassword = 'FOSDemoPassword!2025';

  useEffect(() => {
    if (step !== 'password') return;
    if (signup.password) return;
    setSignup((prev) => ({ ...prev, password: demoPassword }));
  }, [demoPassword, signup.password, step]);

  const updateSignup = (key, value) => setSignup((prev) => ({ ...prev, [key]: value }));

  const canVerifyEmail = useMemo(() => {
    if (!signup.email) return false;
    return /.+@.+\..+/.test(signup.email);
  }, [signup.email]);

  const passwordRules = useMemo(() => {
    const password = signup.password || '';
    return {
      minLength: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numberSymbolOrWhitespace: /[0-9]|[^A-Za-z0-9]|\s/.test(password)
    };
  }, [signup.password]);

  const passwordOk =
    passwordRules.minLength &&
    passwordRules.lowercase &&
    passwordRules.uppercase &&
    passwordRules.numberSymbolOrWhitespace;

  const handleSso = (provider) => {
    // 1. Record the provider (Google, Microsoft, Apple)
    updateSignup('provider', provider);
    
    // 2. Instead of navigating immediately, advance to the "Name" step.
    // This preserves the "bit-by-bit" data collection flow (Name -> Website -> OrgSize)
    // while skipping the "Email Verification" and "Password Creation" steps which SSO handles.
    setStep('name');
  };

  const seedVerificationCode = () => {
    const next = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(next);
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setEmailSendError('');
    return next;
  };

  const focusFirstCodeDigit = () => {
    setTimeout(() => {
      codeInputRefs.current?.[0]?.focus?.();
    }, 0);
  };

  const sendVerificationEmail = async ({ email, code }) => {
    const response = await fetch('/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    if (response.status === 404) {
      throw new Error('Email delivery is not configured');
    }
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || 'Failed to send verification email');
    }
  };

  const handleVerifyEmail = async () => {
    if (!canVerifyEmail) return;
    setSendingEmail(true);
    setEmailSendError('');
    const code = seedVerificationCode();
    try {
      await sendVerificationEmail({ email: signup.email, code });
      setStep('code');
      focusFirstCodeDigit();
    } catch (e) {
      if (isEmailDeliveryNotConfiguredError(e)) {
        setCodeDigits(code.split(''));
        setEmailSendError('Demo mode: email delivery is disabled, so we pre-filled your code.');
      } else {
        setEmailSendError(e instanceof Error ? e.message : 'Failed to send verification email');
      }
      setStep('code');
      focusFirstCodeDigit();
    } finally {
      setSendingEmail(false);
    }
  };

  const enteredCode = codeDigits.join('');
  const codeComplete = codeDigits.every((d) => d.length === 1);

  const handleCodeChange = (index, value) => {
    const nextChar = (value || '').replace(/\D/g, '').slice(-1);
    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = nextChar;
      return next;
    });
    if (codeError) setCodeError('');
    if (nextChar && index < 5) {
      codeInputRefs.current?.[index + 1]?.focus?.();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key !== 'Backspace') return;
    if (codeDigits[index]) return;
    if (index === 0) return;
    codeInputRefs.current?.[index - 1]?.focus?.();
  };

  const handleCodePaste = (e) => {
    const raw = e.clipboardData?.getData('text') || '';
    const digits = raw.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length !== 6) return;
    e.preventDefault();
    setCodeDigits(digits);
    setCodeError('');
    setTimeout(() => {
      codeInputRefs.current?.[5]?.focus?.();
    }, 0);
  };

  const handleCodeNext = () => {
    if (!codeComplete) return;
    if (verificationCode && enteredCode !== verificationCode) {
      setCodeError("That code didn’t match. Try again.");
      return;
    }
    setStep('password');
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const lead = {
        createdAt: new Date().toISOString(),
        provider: signup.provider || 'email',
        email: signup.email,
        firstName: signup.firstName,
        lastName: signup.lastName,
        companyWebsite: signup.companyWebsite,
        orgSize: signup.orgSize
      };
      localStorage.setItem('fos_lead', JSON.stringify(lead));
      localStorage.setItem('fos_demo_auth', 'true');
      navigate('/app');
    } catch (e) {
      void e;
    } finally {
      setSubmitting(false);
    }
  };

  const leftPanel = (
    <div className="hidden lg:flex flex-col bg-slate-50 border-r border-slate-100 min-h-screen">
      <div className="px-10 py-10">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-3">
          <div className="w-10 h-10 bg-[#183B56] rounded-lg flex items-center justify-center shadow-sm">
            <Shield className="text-[#F5C26B] h-6 w-6" />
          </div>
          <div>
            <div className="font-serif font-bold text-[#183B56] leading-none text-lg">Fiduciary OS</div>
            <div className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Operating System</div>
          </div>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="max-w-sm text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
              <path d="M32 10c2.8 9.8 11.2 18.2 21 21-9.8 2.8-18.2 11.2-21 21-2.8-9.8-11.2-18.2-21-21 9.8-2.8 18.2-11.2 21-21z" fill="#FF5C35" opacity="0.9" />
              <path d="M32 16c2.1 7.3 8.7 13.9 16 16-7.3 2.1-13.9 8.7-16 16-2.1-7.3-8.7-13.9-16-16 7.3-2.1 13.9-8.7 16-16z" fill="#183B56" opacity="0.9" />
            </svg>
          </div>
          <div className="mt-8 font-serif font-bold text-2xl text-slate-900 leading-snug">Let’s unify your trust operations on one platform</div>
          <div className="mt-3 text-sm text-slate-600">Clean onboarding. Clear steps. Built for fiduciary-grade workflows.</div>
        </div>
      </div>
      <div className="px-10 py-8 text-xs text-slate-400">© {new Date().getFullYear()} Fiduciary Operating System</div>
    </div>
  );

  const showSignIn = step !== 'confirm' && step !== 'welcome';

  const Header = (
    <div className="flex items-center justify-between px-6 py-6">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 lg:hidden">
        <div className="w-9 h-9 bg-[#183B56] rounded-lg flex items-center justify-center shadow-sm">
          <Shield className="text-[#F5C26B] h-5 w-5" />
        </div>
        <div className="hidden sm:block">
          <div className="font-serif font-bold text-[#183B56] leading-none">Fiduciary OS</div>
          <div className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Operating System</div>
        </div>
      </button>
      <div className="flex-1" />
      {showSignIn ? (
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 hidden sm:block">Have an account?</div>
          <button onClick={() => navigate('/login')} className="text-[#FF5C35] font-bold text-sm hover:underline">Sign in</button>
        </div>
      ) : null}
    </div>
  );

  const StartStep = (
    <StepContainer
      title="Create your free account"
      subtitle="100% free. No credit card needed."
    >
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSso('google')}
          className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-3"
        >
          <span className="w-5 h-5" aria-hidden="true">
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.2 29.6 1 24 1 14.6 1 6.6 6.3 2.7 14l7.4 5.7C12 13.8 17.5 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.7-.2-3.3-.5-4.9H24v9.3h12.6c-.5 2.6-2 4.8-4.3 6.3l7 5.4c4.1-3.8 6.2-9.4 6.2-16.1z" />
              <path fill="#FBBC05" d="M10.1 28.4c-1-2.9-1-6 0-8.9L2.7 13.8C.2 18.8.2 25.2 2.7 30.2l7.4-5.8z" />
              <path fill="#34A853" d="M24 47c5.6 0 10.5-1.9 14-5.2l-7-5.4c-2 1.4-4.6 2.3-7 2.3-6.5 0-12-4.3-13.9-10.1l-7.4 5.8C6.6 41.7 14.6 47 24 47z" />
            </svg>
          </span>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => handleSso('microsoft')}
          className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-3"
        >
          <span className="w-5 h-5" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#7FBA00" d="M13 1h10v10H13z" />
              <path fill="#00A4EF" d="M1 13h10v10H1z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
          </span>
          Sign up with Microsoft
        </button>

        <button
          type="button"
          onClick={() => handleSso('apple')}
          className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.365 1.43c0 1.14-.417 2.206-1.248 3.18-.97 1.13-2.55 2-4.018 1.88-.193-1.08.34-2.23 1.23-3.14.98-1.05 2.68-1.87 4.036-1.92zM20.52 17.23c-.51 1.19-.75 1.72-1.4 2.77-.9 1.43-2.17 3.2-3.74 3.22-1.4.02-1.76-.92-3.65-.91-1.89 0-2.29.89-3.68.93-1.57.06-2.76-1.57-3.66-3-2.52-3.96-2.78-8.6-1.23-10.99 1.1-1.71 2.85-2.72 4.5-2.72 1.68 0 2.73.93 4.12.93 1.35 0 2.17-.93 4.11-.93 1.47 0 3.03.8 4.13 2.19-3.63 1.99-3.04 7.18.5 8.51z"
            />
          </svg>
          Sign up with Apple
        </button>
      </div>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px bg-slate-200 flex-1" />
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">or</div>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyEmail();
        }}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={signup.email}
            onChange={(e) => updateSignup('email', e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65]"
            placeholder="name@company.com"
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!canVerifyEmail || sendingEmail}
          className={`w-full rounded-lg px-4 py-3 font-bold text-sm shadow-sm transition ${canVerifyEmail && !sendingEmail ? 'bg-[#183B56] hover:bg-[#102A3D] text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          {sendingEmail ? 'Sending email…' : 'Verify email'}
        </button>
      </form>
    </StepContainer>
  );

  const CodeStep = (
    <StepContainer
      title="Check your email"
      subtitle={
        <span>
          We’ve sent your verification code to <span className="font-semibold text-slate-800">{signup.email}</span>
        </span>
      }
      footer={
        <StepFooter
          onBack={() => setStep('start')}
          nextLabel="Next"
          onNext={handleCodeNext}
          nextDisabled={!codeComplete}
        />
      }
    >
      <div>
        <div className="text-sm font-bold text-slate-700">Verification code</div>
        <div className="mt-4 flex gap-2" onPaste={handleCodePaste}>
          {codeDigits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                codeInputRefs.current[i] = el;
              }}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              value={digit}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(i, e)}
              className={`w-12 h-12 text-center text-lg font-bold rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65] ${codeError ? 'border-red-300' : 'border-slate-300'}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        {codeError ? <div className="mt-3 text-sm text-red-600">{codeError}</div> : null}
        {emailSendError ? <div className="mt-3 text-sm text-amber-700">{emailSendError}</div> : null}
        <div className="mt-6 text-sm text-slate-600">
          Didn’t get the email?{' '}
          <button
            type="button"
            onClick={async () => {
              setSendingEmail(true);
              setEmailSendError('');
              const code = seedVerificationCode();
              try {
                await sendVerificationEmail({ email: signup.email, code });
                focusFirstCodeDigit();
              } catch (e) {
                if (isEmailDeliveryNotConfiguredError(e)) {
                  setCodeDigits(code.split(''));
                  setEmailSendError('Demo mode: email delivery is disabled, so we pre-filled your code.');
                } else {
                  setEmailSendError(e instanceof Error ? e.message : 'Failed to send verification email');
                }
                focusFirstCodeDigit();
              } finally {
                setSendingEmail(false);
              }
            }}
            className="font-semibold text-[#183B56] hover:underline disabled:opacity-50"
            disabled={sendingEmail}
          >
            Resend
          </button>{' '}
          or{' '}
          <button
            type="button"
            onClick={() => {
              setCodeDigits(['', '', '', '', '', '']);
              setCodeError('');
              setVerificationCode('');
              setStep('start');
            }}
            className="font-semibold text-[#183B56] hover:underline"
          >
            edit your email address
          </button>
          .
        </div>
        <div className="mt-3 text-xs text-slate-400">{sendingEmail ? 'Sending email…' : ' '}</div>
      </div>
    </StepContainer>
  );

  const PasswordStep = (
    <StepContainer
      title="Create your password"
      subtitle="Use a strong password to protect your account."
      footer={
        <StepFooter
          onBack={() => setStep('code')}
          nextLabel="Next"
          onNext={() => setStep('name')}
          nextDisabled={!passwordOk}
        />
      }
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="password"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              value={signup.password}
              onChange={(e) => updateSignup('password', e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65]"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="h-11 w-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            >
              {passwordVisible ? <EyeOff className="w-5 h-5 text-slate-600" /> : <Eye className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { ok: passwordRules.minLength, label: 'At least 12 characters' },
            { ok: passwordRules.lowercase, label: 'One lowercase character' },
            { ok: passwordRules.uppercase, label: 'One uppercase character' },
            { ok: passwordRules.numberSymbolOrWhitespace, label: 'One number, symbol, or whitespace character' }
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2 text-sm">
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${row.ok ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`} aria-hidden="true">
                {row.ok ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              </span>
              <span className={row.ok ? 'text-slate-700' : 'text-slate-500'}>{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    </StepContainer>
  );

  const NameStep = (
    <StepContainer
      title="Welcome, what’s your name?"
      footer={
        <StepFooter
          onBack={() => setStep('password')}
          nextLabel="Next"
          onNext={() => setStep('website')}
          nextDisabled={!signup.firstName.trim() || !signup.lastName.trim()}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-slate-700">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={signup.firstName}
            onChange={(e) => updateSignup('firstName', e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65]"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold text-slate-700">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={signup.lastName}
            onChange={(e) => updateSignup('lastName', e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65]"
            autoComplete="family-name"
          />
        </div>
      </div>
    </StepContainer>
  );

  const WebsiteStep = (
    <StepContainer
      title="What is your company’s website?"
      subtitle="This helps tailor onboarding to your organization."
      footer={
        <StepFooter
          onBack={() => setStep('name')}
          nextLabel="Next"
          onNext={() => setStep('orgSize')}
          nextDisabled={!signup.companyWebsite.trim()}
        />
      }
    >
      <div>
        <label htmlFor="companyWebsite" className="block text-sm font-bold text-slate-700">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="url"
          value={signup.companyWebsite}
          onChange={(e) => updateSignup('companyWebsite', e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A65] focus:border-[#007A65]"
          placeholder="www.companywebsite.com"
          autoComplete="url"
        />
      </div>
    </StepContainer>
  );

  const orgSizes = [
    { id: 'solo', label: 'Just me' },
    { id: '2-10', label: '2–10 employees' },
    { id: '11-50', label: '11–50 employees' },
    { id: '51-200', label: '51–200 employees' },
    { id: '201-1000', label: '201–1,000 employees' },
    { id: '1000+', label: '1,000+ employees' }
  ];

  const selectedOrgSizeLabel = orgSizes.find((size) => size.id === signup.orgSize)?.label || '';

  const OrgSizeStep = (
    <StepContainer
      title="Tailor your experience"
      subtitle="How large is your organization?"
      footer={
        <StepFooter
          onBack={() => setStep('website')}
          nextLabel="Continue"
          onNext={() => setStep('confirm')}
          nextDisabled={!signup.orgSize}
        />
      }
    >
      <div className="space-y-3">
        {orgSizes.map((size) => (
          <button
            key={size.id}
            type="button"
            onClick={() => updateSignup('orgSize', size.id)}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition flex items-center justify-between ${signup.orgSize === size.id ? 'border-[#007A65] bg-[#E6F4F1]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <span className="text-slate-900">{size.label}</span>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${signup.orgSize === size.id ? 'border-[#007A65] bg-[#007A65]' : 'border-slate-300 bg-white'}`} aria-hidden="true">
              {signup.orgSize === size.id ? <Check className="w-3.5 h-3.5 text-white" /> : null}
            </span>
          </button>
        ))}
      </div>
    </StepContainer>
  );

  const ConfirmDetailsStep = (
    <StepContainer
      title="Confirm your details"
      subtitle="A quick review before we drop you into the platform."
      footer={
        <StepActions
          leftLabel="Edit details"
          onLeft={() => setStep('name')}
          rightLabel="Yes, looks good."
          onRight={() => setStep('welcome')}
          rightDisabled={
            !signup.firstName.trim() ||
            !signup.lastName.trim() ||
            !signup.email.trim() ||
            !signup.companyWebsite.trim() ||
            !signup.orgSize
          }
        />
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">Personal information</div>
          <div className="mt-1 text-xs text-slate-500">This is what we’ll use to personalize your experience.</div>
        </div>
        <dl className="px-5 py-4 space-y-4">
          <div className="flex items-start justify-between gap-6">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">First name</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right">{signup.firstName || '—'}</dd>
          </div>
          <div className="flex items-start justify-between gap-6">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Last name</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right">{signup.lastName || '—'}</dd>
          </div>
          <div className="flex items-start justify-between gap-6">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Email address</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right break-all">{signup.email || '—'}</dd>
          </div>
          <div className="flex items-start justify-between gap-6">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Company URL</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right break-all">{signup.companyWebsite || '—'}</dd>
          </div>
          <div className="flex items-start justify-between gap-6">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-400">Company size</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right">{selectedOrgSizeLabel || '—'}</dd>
          </div>
        </dl>
      </div>
    </StepContainer>
  );

  const WelcomeStep = (
    <StepContainer
      title="Welcome to Fiduciary Operating System"
      subtitle="Built exclusively for professionals like you."
      footer={
        <StepActions
          leftLabel="Back"
          onLeft={() => setStep('confirm')}
          rightLabel={submitting ? 'Entering…' : 'Enter the app'}
          onRight={handleComplete}
          rightDisabled={submitting}
        />
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-sm text-slate-700 leading-relaxed">
            <div className="font-bold text-slate-900">Welcome to Fiduciary OS{signup.firstName ? `, ${signup.firstName}` : ''}.</div>
            <div className="mt-2">
              You’ve just taken the first step toward moving beyond disparate one-off non-integrated systems to a single pane of glass that reduces personal liability, ensures the continuity of all correspondence and work, protects legal privilege and secures the generational transfer of wealth.
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-900">And while giving it a test drive, you might want to take a look at some high-impact features built for people like you:</div>
          <div className="mt-3 space-y-3">
            {[
              {
                title: 'The Command Center',
                description: 'The beating heart of the system and your primary landing page.'
              },
              {
                title: 'The Compliance Watchdog',
                description: 'Organizes your to-do items and deadlines in one easy-to-navigate space.'
              },
              {
                title: 'The Succession Protocol',
                description: 'An automated fail-safe that transfers encrypted access to a named successor after a confirmed inactivity period.'
              },
              {
                title: 'The Privilege Trap',
                description: 'A segregated “iron vault” for drafts that are invisible to beneficiaries, distinct from the “public” record.'
              },
              {
                title: 'The Fiduciary Mind',
                description: 'Harness the power of the latest AI to communicate and query against any and all documents in the system.'
              }
            ].map((row) => (
              <div key={row.title} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#E6F4F1] border border-[#BFE6DE] flex items-center justify-center" aria-hidden="true">
                  <Check className="w-4 h-4 text-[#007A65]" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">{row.title}</div>
                  <div className="text-sm text-slate-600">{row.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );

  const stepUi =
    step === 'start' ? StartStep :
    step === 'code' ? CodeStep :
    step === 'password' ? PasswordStep :
    step === 'name' ? NameStep :
    step === 'website' ? WebsiteStep :
    step === 'orgSize' ? OrgSizeStep :
    step === 'confirm' ? ConfirmDetailsStep :
    step === 'welcome' ? WelcomeStep :
    StartStep;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="min-h-screen grid lg:grid-cols-2">
        {leftPanel}
        <div className="min-h-screen flex flex-col">
          {Header}
          <main className="flex-1 flex items-center justify-center px-6 pb-12">
            {stepUi}
          </main>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
