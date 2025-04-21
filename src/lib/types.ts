
// Types for the Lead Management System

// Lead source options
export type LeadSource = 'teacher_referral' | 'parent_referral' | 'school_event' | 'website' | 'social_media' | 'community' | 'other';

// Lead status options
export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed';

// Lead interface
export interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  contactNumber: string;
  contactEmail?: string;
  class: string;
  street: string;
  source: LeadSource;
  followUpDate: string; // ISO date string
  notes: string;
  status: LeadStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: string; // User ID
}

// Form data for creating/editing a lead
export type LeadFormData = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status'>;

// Data for lead filter
export interface LeadFilter {
  status?: LeadStatus | 'all';
  source?: LeadSource | 'all';
  searchQuery?: string;
  fromDate?: string;
  toDate?: string;
}

// Get human-readable status
export const getStatusText = (status: LeadStatus): string => {
  const statusMap: Record<LeadStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    follow_up: 'Follow Up',
    converted: 'Converted',
    closed: 'Closed'
  };
  return statusMap[status] || status;
};

// Get human-readable source
export const getSourceText = (source: LeadSource): string => {
  const sourceMap: Record<LeadSource, string> = {
    teacher_referral: 'Teacher Referral',
    parent_referral: 'Parent Referral',
    school_event: 'School Event',
    website: 'Website',
    social_media: 'Social Media',
    community: 'Community',
    other: 'Other'
  };
  return sourceMap[source] || source;
};
