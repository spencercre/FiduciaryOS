import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { INCOMING_EMAILS } from '../data/mockData';

const COLLECTION_NAME = 'emails';

export const emailService = {
  getEmails: async () => {
    try {
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
