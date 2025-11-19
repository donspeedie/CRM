/**
 * CRM Engagement Tracking Types
 *
 * Tracks all interactions with prospects, investors, and clients
 * across multiple channels (email, social, web, ads, etc.)
 */

export type EngagementEventType =
  // Awareness stage
  | 'ad_impression'
  | 'ad_click'
  | 'landing_page_view'
  | 'social_post_view'
  | 'social_post_engagement'
  | 'initial_contact'

  // Follow-up stage
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'phone_call'
  | 'meeting_scheduled'
  | 'meeting_completed'
  | 'app_signup'
  | 'app_login'

  // Converted stage
  | 'deal_closed'
  | 'contract_signed'
  | 'payment_received'

  // Recommendation stage
  | 'referral_made'
  | 'testimonial_given'
  | 'repeat_purchase';

export type EngagementSource =
  | 'email'
  | 'phone'
  | 'linkedin'
  | 'facebook'
  | 'google_ads'
  | 'web'
  | 'app'
  | 'direct'
  | 'other';

export type FunnelStage =
  | 'awareness'
  | 'follow-up'
  | 'converted'
  | 'recommendation';

export interface EngagementEvent {
  id?: string;
  eventType: EngagementEventType;
  source: EngagementSource;

  // Contact info
  contactEmail?: string;
  contactPhone?: string;
  contactName?: string;

  // Timing
  timestamp: Date | string;
  createdAt?: Date | string;

  // Metadata (flexible per event type)
  metadata?: {
    // Email-specific
    subject?: string;
    snippet?: string;
    gmailLink?: string;
    gmailId?: string;

    // Social-specific
    platform?: 'linkedin' | 'facebook';
    postUrl?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    reach?: number;
    impressions?: number;

    // Meeting-specific
    meetingTitle?: string;
    meetingDuration?: number;
    meetingNotes?: string;

    // Deal-specific
    dealValue?: number;
    dealType?: string;

    // Generic
    notes?: string;
    [key: string]: any;
  };

  // User tracking
  userId?: string;

  // Sync tracking
  syncedFromGmail?: boolean;
  syncedFromLinkedIn?: boolean;
  syncedFromGA4?: boolean;
}

// Helper to map event types to funnel stages
export const EVENT_STAGE_MAP: Record<EngagementEventType, FunnelStage> = {
  // Awareness
  'ad_impression': 'awareness',
  'ad_click': 'awareness',
  'landing_page_view': 'awareness',
  'social_post_view': 'awareness',
  'social_post_engagement': 'awareness',
  'initial_contact': 'awareness',

  // Follow-up
  'email_sent': 'follow-up',
  'email_opened': 'follow-up',
  'email_clicked': 'follow-up',
  'phone_call': 'follow-up',
  'meeting_scheduled': 'follow-up',
  'meeting_completed': 'follow-up',
  'app_signup': 'follow-up',
  'app_login': 'follow-up',

  // Converted
  'deal_closed': 'converted',
  'contract_signed': 'converted',
  'payment_received': 'converted',

  // Recommendation
  'referral_made': 'recommendation',
  'testimonial_given': 'recommendation',
  'repeat_purchase': 'recommendation',
};

// Helper to categorize sources
export type SourceCategory = 'web' | 'email' | 'social' | 'direct';

export const SOURCE_CATEGORY_MAP: Record<EngagementSource, SourceCategory> = {
  'email': 'email',
  'phone': 'direct',
  'linkedin': 'social',
  'facebook': 'social',
  'google_ads': 'web',
  'web': 'web',
  'app': 'web',
  'direct': 'direct',
  'other': 'direct',
};

// Dashboard metrics type
export interface EngagementMetrics {
  total: number;
  byStage: Record<FunnelStage, number>;
  bySource: Record<SourceCategory, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
}
