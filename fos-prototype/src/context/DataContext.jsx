import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trustService } from '../services/trustService';
import { taskService } from '../services/taskService';
import { emailService } from '../services/emailService';
import { useAuth } from './AuthContext';
import { BILLING_ENTRIES } from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [trusts, setTrusts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Timer State (moved from App.jsx)
  const [timerState, setTimerState] = useState({
    running: false,
    paused: false,
    seconds: 0,
    trustName: '',
    wipEntries: BILLING_ENTRIES
  });

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedTrusts, fetchedTasks, fetchedEmails] = await Promise.all([
        trustService.getTrusts(),
        taskService.getTasks(),
        emailService.getEmails()
      ]);
      setTrusts(fetchedTrusts);
      setTasks(fetchedTasks);
      setEmails(fetchedEmails);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  // Timer Actions
  const HOURLY_RATE = 250;

  useEffect(() => {
    let interval;
    if (timerState.running && !timerState.paused) {
      interval = setInterval(() => {
        setTimerState(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.running, timerState.paused]);

  const startTimer = (trustName) => {
    setTimerState(prev => ({ ...prev, running: true, paused: false, trustName: trustName || '' }));
  };

  const pauseTimer = () => setTimerState(prev => ({ ...prev, paused: true }));
  const resumeTimer = () => setTimerState(prev => ({ ...prev, paused: false }));
  
  const stopTimer = () => {
    if (timerState.seconds > 0) {
      const hours = Math.round((timerState.seconds / 3600) * 100) / 100;
      const newEntry = {
        id: Date.now(),
        date: 'Today',
        desc: `Timer Session${timerState.trustName ? ` - ${timerState.trustName}` : ''}`,
        hours: hours || 0.01,
        rate: HOURLY_RATE,
        total: (hours || 0.01) * HOURLY_RATE
      };
      setTimerState(prev => ({
        ...prev,
        running: false,
        paused: false,
        seconds: 0,
        trustName: '',
        wipEntries: [newEntry, ...prev.wipEntries]
      }));
    } else {
      setTimerState(prev => ({ ...prev, running: false, paused: false, seconds: 0, trustName: '' }));
    }
  };

  const discardTimer = () => {
    setTimerState(prev => ({ ...prev, running: false, paused: false, seconds: 0, trustName: '' }));
  };

  // Email Actions
  const triageEmail = (emailId, folder) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, folder } : e));
  };

  const value = {
    trusts,
    tasks,
    emails,
    loading,
    refreshData,
    // Timer
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    discardTimer,
    // Email
    triageEmail
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
