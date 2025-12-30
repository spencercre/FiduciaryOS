import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { SEED_TRUSTS } from '../data/mockData';

const COLLECTION_NAME = 'trusts';

export const trustService = {
  // Fetch all trusts (supports filtering by orgId in future)
  getTrusts: async () => {
    try {
      if (db) {
        // Future: const q = query(collection(db, COLLECTION_NAME), where('orgId', '==', currentOrgId));
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      }
    } catch (error) {
      console.warn('Error fetching trusts from Firestore, falling back to mock data:', error);
    }
    // Fallback to mock data
    return [...SEED_TRUSTS];
  },

  // Get single trust by ID
  getTrustById: async (trustId) => {
    try {
      if (db) {
        const docRef = doc(db, COLLECTION_NAME, trustId.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      }
    } catch (error) {
      console.warn(`Error fetching trust ${trustId}, falling back to mock:`, error);
    }
    return SEED_TRUSTS.find(t => t.id.toString() === trustId.toString()) || null;
  }
};
