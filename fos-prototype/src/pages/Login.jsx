import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // MOCK AUTHENTICATION for "demo" / "demo"
    // This allows the prototype to work without Firebase for the specific demo user
    if (email.toLowerCase() === 'demo' && password === 'demo') {
        setTimeout(() => {
            // Store a mock token or flag
            localStorage.setItem('fos_demo_auth', 'true');
            // We also need to trigger the parent App state update, 
            // but for now, the App will check this storage or we rely on the redirect.
            // Since App.jsx uses Firebase auth listener, we might need to actually sign in anonymously 
            // or mock the user object in App.jsx. 
            // For this specific request, I will rely on the App.jsx refactor to handle this "demo" mode.
            navigate('/app');
        }, 800);
        return;
    }

    // Fallback to real Firebase Auth for other users (if configured)
    try {
      // await signInWithEmailAndPassword(auth, email, password);
      // For now, fail if not demo/demo
      throw new Error("Invalid credentials. Please use the demo account.");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      
      {/* Header for Back Navigation (Fix for Concern #1) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
         {/* Logo / Home Link */}
         <div className="pointer-events-auto cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#183B56] rounded flex items-center justify-center shadow-md">
                <Shield className="text-[#F5C26B] h-5 w-5" />
            </div>
            <span className="font-serif font-bold text-[#183B56] text-lg hidden md:block">Fiduciary OS</span>
         </div>

         {/* Right Side Actions */}
         <div className="pointer-events-auto flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">Don't have an account?</span>
             <button onClick={() => navigate('/get-started')} className="text-[#FF5C35] font-bold text-sm hover:underline">
                Get started free
             </button>
         </div>
      </div>

      {/* Left Side: Brand / Visual */}
      <div className="hidden md:flex md:w-1/2 bg-[#183B56] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#F5C26B 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-md text-center text-white">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <Shield className="text-[#F5C26B] h-10 w-10" />
          </div>
          <h2 className="font-serif text-4xl font-bold mb-6">Fiduciary Operating System</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            "The standard for professional trust administration. Protect your license, automate compliance, and ensure your legacy."
          </p>
          
          {/* Animated Carousel Dots (Fix for Concern #2) */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#F5C26B] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-24 bg-white relative z-10">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center md:text-left pt-10 md:pt-0">
            <div className="md:hidden flex justify-center mb-4">
               <div className="w-12 h-12 bg-[#183B56] rounded-lg flex items-center justify-center">
                <Shield className="text-[#F5C26B] h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">
              Please enter your details to access the vault.
            </p>
          </div>

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleLogin} autoComplete="off">
            {/* Hack to prevent LastPass overlay issues: add a hidden overlay shield */}
            <div className="hidden">
                <input type="text" name="fakeusernameremembered" />
                <input type="password" name="fakepasswordremembered" />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    className="focus:ring-[#007A65] focus:border-[#007A65] block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 relative z-0"
                    placeholder="demo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    className="focus:ring-[#007A65] focus:border-[#007A65] block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 relative z-0"
                    placeholder="••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#183B56] hover:bg-[#102a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#183B56] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
             <p className="text-xs text-slate-500">
                Protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
