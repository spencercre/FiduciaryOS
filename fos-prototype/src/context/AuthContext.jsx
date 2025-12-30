import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

const DEMO_USER = { email: 'demo@fiduciary.os', uid: 'demo-user', displayName: 'Demo User' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize Auth State
  useEffect(() => {
    // Check Demo Mode
    const checkDemoAuth = () => {
      const demoAuth = localStorage.getItem('fos_demo_auth');
      if (demoAuth === 'true') setIsDemoMode(true);
    };
    checkDemoAuth();

    // Listen for Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Poll for Demo Mode changes (legacy support for simple local storage hacks)
    const interval = setInterval(() => {
      const demoAuth = localStorage.getItem('fos_demo_auth');
      if (demoAuth === 'true' && !isDemoMode) setIsDemoMode(true);
      if (!demoAuth && isDemoMode) setIsDemoMode(false);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isDemoMode]);

  const currentUser = useMemo(() => user || (isDemoMode ? DEMO_USER : null), [user, isDemoMode]);
  const isAuthenticated = !!currentUser;

  // Derive Role (Temporary Logic until Database User Model is ready)
  const activeRole = useMemo(() => {
    const email = (currentUser?.email || "").toLowerCase();
    if (email.includes("jenkins") || email.includes("attorney")) return "attorney";
    if (email.includes("vance") || email.includes("cpa")) return "cpa";
    if (email.includes("greg") || email.includes("beneficiary")) return "beneficiary";
    return "fiduciary";
  }, [currentUser]);

  const canAccessPrivileged = activeRole === 'fiduciary' || activeRole === 'attorney';

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('fos_demo_auth');
      localStorage.removeItem('fos_lead');
      setIsDemoMode(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const value = {
    user: currentUser,
    isAuthenticated,
    loading,
    isDemoMode,
    activeRole,
    canAccessPrivileged,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
