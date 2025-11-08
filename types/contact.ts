export type ContactTag = 'Nimble Development' | 'Real Deal' | 'Personal';

export type ContactSource = 
  | 'Manual Entry'
  | 'Email Import'
  | 'Meeting Notes'
  | 'Business Card'
  | 'LinkedIn'
  | 'Referral'
  | 'Other';

export type InteractionType = 
  | 'email'
  | 'call'
  | 'meeting'
  | 'note'
  | 'text';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  tags: ContactTag[];
  source: ContactSource;
  notes?: string;
  relationshipScore?: number; // 0-100, AI-computed
  lastContact?: Date;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Who owns this contact
  aiEnrichedData?: {
    linkedin?: string;
    companyInfo?: string;
    industry?: string;
    location?: string;
  };
}

export interface Interaction {
  id: string;
  contactId: string;
  userId: string;
  type: InteractionType;
  summary: string;
  fullContent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  actionItems?: string[];
  timestamp: Date;
  createdAt: Date;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  tags?: ContactTag[];
  source?: ContactSource;
  notes?: string;
  nextFollowUp?: Date;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
  lastContact?: Date;
}
