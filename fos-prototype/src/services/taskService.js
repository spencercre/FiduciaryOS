import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { supabase } from './supabase';
import { SEED_TASKS } from '../data/mockData';

const COLLECTION_NAME = 'tasks';

export const taskService = {
  getTasks: async (trustId = null) => {
    try {
      if (supabase) {
        let queryBuilder = supabase.from(COLLECTION_NAME).select('*');
        if (trustId) queryBuilder = queryBuilder.eq('trustId', trustId);
        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (Array.isArray(data) && data.length) return data;
      }
      if (db) {
        let q = collection(db, COLLECTION_NAME);
        if (trustId) {
          q = query(q, where('trustId', '==', trustId));
        }
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      }
    } catch (error) {
      console.warn('Error fetching tasks, falling back to mock:', error);
    }
    
    // Fallback
    if (trustId) {
      return SEED_TASKS.filter(t => t.trustId.toString() === trustId.toString());
    }
    return [...SEED_TASKS];
  }
};
