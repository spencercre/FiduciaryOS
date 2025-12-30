import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { supabase } from './supabase';
import { INCOMING_EMAILS } from '../data/mockData';

const COLLECTION_NAME = 'emails';

export const emailService = {
  getEmails: async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from(COLLECTION_NAME).select('*');
        if (error) throw error;
        if (Array.isArray(data) && data.length) return data;
      }
      if (db) {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      }
    } catch (error) {
      console.warn('Error fetching emails, falling back to mock:', error);
    }
    return [...INCOMING_EMAILS];
  }
};
