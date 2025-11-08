import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Contact, CreateContactInput, UpdateContactInput, Interaction } from '@/types/contact';

const CONTACTS_COLLECTION = 'contacts';
const INTERACTIONS_COLLECTION = 'interactions';

// Helper to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Helper to convert Firestore document to Contact type
const docToContact = (docData: any, id: string): Contact => {
  return {
    ...docData,
    id,
    createdAt: timestampToDate(docData.createdAt),
    updatedAt: timestampToDate(docData.updatedAt),
    lastContact: docData.lastContact ? timestampToDate(docData.lastContact) : undefined,
    nextFollowUp: docData.nextFollowUp ? timestampToDate(docData.nextFollowUp) : undefined,
  } as Contact;
};

export const contactService = {
  // Create a new contact
  async create(userId: string, contactData: CreateContactInput): Promise<string> {
    const contactRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...contactData,
      userId,
      tags: contactData.tags || [],
      source: contactData.source || 'Manual Entry',
      relationshipScore: 50, // Default mid-range
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return contactRef.id;
  },

  // Get a single contact by ID
  async get(contactId: string): Promise<Contact | null> {
    const docRef = doc(db, CONTACTS_COLLECTION, contactId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docToContact(docSnap.data(), docSnap.id);
  },

  // Get all contacts for a user
  async getAll(userId: string): Promise<Contact[]> {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToContact(doc.data(), doc.id));
  },

  // Get contacts by tag
  async getByTag(userId: string, tag: string): Promise<Contact[]> {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('userId', '==', userId),
      where('tags', 'array-contains', tag),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToContact(doc.data(), doc.id));
  },

  // Get contacts needing follow-up
  async getNeedingFollowUp(userId: string): Promise<Contact[]> {
    const now = Timestamp.now();
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      where('userId', '==', userId),
      where('nextFollowUp', '<=', now),
      orderBy('nextFollowUp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToContact(doc.data(), doc.id));
  },

  // Update a contact
  async update(contactId: string, updates: Partial<UpdateContactInput>): Promise<void> {
    const docRef = doc(db, CONTACTS_COLLECTION, contactId);
    const { id, ...updateData } = updates;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete a contact
  async delete(contactId: string): Promise<void> {
    const docRef = doc(db, CONTACTS_COLLECTION, contactId);
    await deleteDoc(docRef);
  },

  // Search contacts
  async search(userId: string, searchTerm: string): Promise<Contact[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider Algolia or similar
    const allContacts = await this.getAll(userId);
    const lowerSearch = searchTerm.toLowerCase();
    
    return allContacts.filter(contact => 
      contact.name.toLowerCase().includes(lowerSearch) ||
      contact.email?.toLowerCase().includes(lowerSearch) ||
      contact.company?.toLowerCase().includes(lowerSearch) ||
      contact.phone?.includes(searchTerm)
    );
  },

  // Add an interaction
  async addInteraction(
    userId: string,
    contactId: string,
    interaction: Omit<Interaction, 'id' | 'userId' | 'contactId' | 'createdAt'>
  ): Promise<string> {
    const interactionRef = await addDoc(collection(db, INTERACTIONS_COLLECTION), {
      ...interaction,
      userId,
      contactId,
      createdAt: serverTimestamp(),
    });

    // Update contact's lastContact
    await this.update(contactId, { lastContact: new Date() });

    return interactionRef.id;
  },

  // Get interactions for a contact
  async getInteractions(contactId: string): Promise<Interaction[]> {
    const q = query(
      collection(db, INTERACTIONS_COLLECTION),
      where('contactId', '==', contactId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: timestampToDate(doc.data().timestamp),
      createdAt: timestampToDate(doc.data().createdAt),
    } as Interaction));
  },
};
