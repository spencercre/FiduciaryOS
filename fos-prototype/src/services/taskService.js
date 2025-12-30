import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { SEED_TASKS } from '../data/mockData';

const COLLECTION_NAME = 'tasks';

export const taskService = {
  getTasks: async (trustId = null) => {
    try {
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
