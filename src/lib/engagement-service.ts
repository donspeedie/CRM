/**
 * Engagement Service
 *
 * Handles all engagement tracking operations with Firestore
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getFirestore,
} from 'firebase/firestore';
import { app } from './firebase';
import {
  EngagementEvent,
  EngagementMetrics,
  FunnelStage,
  EVENT_STAGE_MAP,
  SOURCE_CATEGORY_MAP,
  SourceCategory,
} from '../types/engagement';

const db = getFirestore(app);
const ENGAGEMENTS_COLLECTION = 'engagements';

/**
 * Create a new engagement event
 */
export async function createEngagement(
  event: Omit<EngagementEvent, 'id' | 'createdAt'>
): Promise<string> {
  const eventData = {
    ...event,
    timestamp: event.timestamp instanceof Date
      ? Timestamp.fromDate(event.timestamp)
      : Timestamp.fromDate(new Date(event.timestamp)),
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, ENGAGEMENTS_COLLECTION), eventData);
  return docRef.id;
}

/**
 * Get all engagements for a user
 */
export async function getEngagements(
  userId: string,
  options?: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    source?: string;
    eventType?: string;
  }
): Promise<EngagementEvent[]> {
  let q = query(
    collection(db, ENGAGEMENTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  if (options?.startDate) {
    q = query(q, where('timestamp', '>=', Timestamp.fromDate(options.startDate)));
  }

  if (options?.endDate) {
    q = query(q, where('timestamp', '<=', Timestamp.fromDate(options.endDate)));
  }

  const snapshot = await getDocs(q);

  const engagements = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp?.toDate(),
      createdAt: data.createdAt?.toDate(),
    } as EngagementEvent;
  });

  // Apply client-side filters (Firestore doesn't support multiple where clauses on different fields)
  let filtered = engagements;

  if (options?.source) {
    filtered = filtered.filter((e) => e.source === options.source);
  }

  if (options?.eventType) {
    filtered = filtered.filter((e) => e.eventType === options.eventType);
  }

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Get engagement metrics for dashboard
 */
export async function getEngagementMetrics(
  userId: string,
  days: number = 30
): Promise<EngagementMetrics> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const engagements = await getEngagements(userId, { startDate, endDate });

  // Count by stage
  const byStage: Record<FunnelStage, number> = {
    awareness: 0,
    'follow-up': 0,
    converted: 0,
    recommendation: 0,
  };

  engagements.forEach((event) => {
    const stage = EVENT_STAGE_MAP[event.eventType];
    if (stage) {
      byStage[stage]++;
    }
  });

  // Count by source category
  const bySource: Record<SourceCategory, number> = {
    web: 0,
    email: 0,
    social: 0,
    direct: 0,
  };

  engagements.forEach((event) => {
    const category = SOURCE_CATEGORY_MAP[event.source];
    if (category) {
      bySource[category]++;
    }
  });

  return {
    total: engagements.length,
    byStage,
    bySource,
    timeRange: {
      start: startDate,
      end: endDate,
    },
  };
}

/**
 * Update an engagement event
 */
export async function updateEngagement(
  id: string,
  updates: Partial<EngagementEvent>
): Promise<void> {
  const docRef = doc(db, ENGAGEMENTS_COLLECTION, id);

  const updateData: any = { ...updates };

  if (updates.timestamp) {
    updateData.timestamp = updates.timestamp instanceof Date
      ? Timestamp.fromDate(updates.timestamp)
      : Timestamp.fromDate(new Date(updates.timestamp));
  }

  await updateDoc(docRef, updateData);
}

/**
 * Delete an engagement event
 */
export async function deleteEngagement(id: string): Promise<void> {
  const docRef = doc(db, ENGAGEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Quick-add social engagement (LinkedIn/Facebook post)
 */
export async function trackSocialPost(data: {
  userId: string;
  platform: 'linkedin' | 'facebook';
  postUrl?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  impressions?: number;
  newContacts?: number;
  notes?: string;
}): Promise<string[]> {
  const eventIds: string[] = [];

  // Create main social post engagement
  const postEventId = await createEngagement({
    eventType: 'social_post_engagement',
    source: data.platform,
    userId: data.userId,
    timestamp: new Date(),
    metadata: {
      platform: data.platform,
      postUrl: data.postUrl,
      likes: data.likes,
      comments: data.comments,
      shares: data.shares,
      reach: data.reach,
      impressions: data.impressions,
      notes: data.notes,
    },
  });

  eventIds.push(postEventId);

  // Create "initial_contact" events for new contacts
  if (data.newContacts && data.newContacts > 0) {
    for (let i = 0; i < data.newContacts; i++) {
      const contactEventId = await createEngagement({
        eventType: 'initial_contact',
        source: data.platform,
        userId: data.userId,
        timestamp: new Date(),
        metadata: {
          platform: data.platform,
          fromSocialPost: true,
          postUrl: data.postUrl,
        },
      });
      eventIds.push(contactEventId);
    }
  }

  return eventIds;
}

/**
 * Get contacts from engagements (unique emails)
 */
export async function getContacts(userId: string): Promise<string[]> {
  const engagements = await getEngagements(userId);

  const emails = new Set<string>();

  engagements.forEach((event) => {
    if (event.contactEmail) {
      emails.add(event.contactEmail);
    }
  });

  return Array.from(emails).sort();
}

/**
 * Get engagement timeline for a specific contact
 */
export async function getContactTimeline(
  userId: string,
  contactEmail: string
): Promise<EngagementEvent[]> {
  const q = query(
    collection(db, ENGAGEMENTS_COLLECTION),
    where('userId', '==', userId),
    where('contactEmail', '==', contactEmail),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp?.toDate(),
      createdAt: data.createdAt?.toDate(),
    } as EngagementEvent;
  });
}
