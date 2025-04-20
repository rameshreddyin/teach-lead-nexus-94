import { Lead, LeadFormData, LeadStatus, LeadFilter } from './types';

// In a real app, this would be an API call to your backend
// For this demo, we'll use localStorage to persist data

const STORAGE_KEY = 'teacher_leads';

// Generate a unique ID 
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get leads from storage
const getLeads = (): Lead[] => {
  const storedLeads = localStorage.getItem(STORAGE_KEY);
  return storedLeads ? JSON.parse(storedLeads) : [];
};

// Save leads to storage
const saveLeads = (leads: Lead[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};

// Initialize with dummy data if storage is empty
const initializeDummyData = () => {
  if (getLeads().length === 0) {
    const dummyLeads: Lead[] = [
      {
        id: 'lead1',
        studentName: 'Alice Johnson',
        parentName: 'Sarah Johnson',
        contactNumber: '+1234567890',
        class: 'Grade 5',
        source: 'parent_referral',
        status: 'new',
        followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        notes: 'Interested in after-school programs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead2',
        studentName: 'Tom Smith',
        parentName: 'Mary Smith',
        contactNumber: '+1234567891',
        class: 'Grade 3',
        source: 'school_event',
        status: 'contacted',
        followUpDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        notes: 'Met at science fair',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead3',
        studentName: 'Michael Brown',
        parentName: 'John Brown',
        contactNumber: '+1234567892',
        class: 'Grade 4',
        source: 'website',
        status: 'follow_up',
        followUpDate: new Date().toISOString(), // Today
        notes: 'Questions about curriculum',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead4',
        studentName: 'Emily Davis',
        parentName: 'Lisa Davis',
        contactNumber: '+1234567893',
        class: 'Grade 6',
        source: 'social_media',
        status: 'converted',
        followUpDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        notes: 'Registration completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead5',
        studentName: 'David Wilson',
        parentName: 'James Wilson',
        contactNumber: '+1234567894',
        class: 'Grade 2',
        source: 'community',
        status: 'new',
        followUpDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        notes: 'Interested in music program',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead6',
        studentName: 'Sofia Martinez',
        parentName: 'Ana Martinez',
        contactNumber: '+1234567895',
        class: 'Grade 1',
        source: 'parent_referral',
        status: 'follow_up',
        followUpDate: new Date().toISOString(), // Today
        notes: 'Recommended by Johnson family',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead7',
        studentName: 'Lucas Taylor',
        parentName: 'Emma Taylor',
        contactNumber: '+1234567896',
        class: 'Grade 4',
        source: 'school_event',
        status: 'closed',
        followUpDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        notes: 'Decided on another school',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead8',
        studentName: 'Oliver Anderson',
        parentName: 'Robert Anderson',
        contactNumber: '+1234567897',
        class: 'Grade 3',
        source: 'website',
        status: 'contacted',
        followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        notes: 'Following up on website inquiry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead9',
        studentName: 'Ava Thompson',
        parentName: 'Michael Thompson',
        contactNumber: '+1234567898',
        class: 'Grade 5',
        source: 'social_media',
        status: 'new',
        followUpDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
        notes: 'Facebook advertisement response',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      },
      {
        id: 'lead10',
        studentName: 'Ethan Lee',
        parentName: 'Jennifer Lee',
        contactNumber: '+1234567899',
        class: 'Grade 6',
        source: 'community',
        status: 'converted',
        followUpDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        notes: 'Successfully enrolled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'default-user'
      }
    ];

    saveLeads(dummyLeads);
  }
};

// Initialize dummy data
initializeDummyData();

// Get all leads for a user
export const getUserLeads = (userId: string): Lead[] => {
  return getLeads().filter(lead => lead.createdBy === userId);
};

// Get a single lead by ID
export const getLead = (id: string): Lead | undefined => {
  return getLeads().find(lead => lead.id === id);
};

// Create a new lead
export const createLead = (data: LeadFormData, userId: string): Lead => {
  const now = new Date().toISOString();
  const newLead: Lead = {
    id: generateId(),
    ...data,
    status: 'new',
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  };
  
  const leads = getLeads();
  leads.push(newLead);
  saveLeads(leads);
  
  return newLead;
};

// Update an existing lead
export const updateLead = (id: string, data: Partial<Lead>): Lead => {
  const leads = getLeads();
  const index = leads.findIndex(lead => lead.id === id);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${id} not found`);
  }
  
  const updatedLead = {
    ...leads[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  leads[index] = updatedLead;
  saveLeads(leads);
  
  return updatedLead;
};

// Update lead status
export const updateLeadStatus = (id: string, status: LeadStatus): Lead => {
  return updateLead(id, { status });
};

// Delete a lead
export const deleteLead = (id: string): void => {
  const leads = getLeads();
  const filteredLeads = leads.filter(lead => lead.id !== id);
  saveLeads(filteredLeads);
};

// Filter leads
export const filterLeads = (userId: string, filter: LeadFilter): Lead[] => {
  let leads = getUserLeads(userId);
  
  // Apply status filter
  if (filter.status) {
    leads = leads.filter(lead => lead.status === filter.status);
  }
  
  // Apply source filter
  if (filter.source) {
    leads = leads.filter(lead => lead.source === filter.source);
  }
  
  // Apply date range filter
  if (filter.fromDate) {
    const from = new Date(filter.fromDate).getTime();
    leads = leads.filter(lead => new Date(lead.createdAt).getTime() >= from);
  }
  
  if (filter.toDate) {
    const to = new Date(filter.toDate).getTime();
    leads = leads.filter(lead => new Date(lead.createdAt).getTime() <= to);
  }
  
  // Apply search query filter to student name or parent name
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    leads = leads.filter(
      lead => 
        lead.studentName.toLowerCase().includes(query) || 
        lead.parentName.toLowerCase().includes(query)
    );
  }
  
  return leads;
};

// Get leads for follow-up today
export const getFollowUpLeads = (userId: string): Lead[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getUserLeads(userId).filter(lead => {
    const followUpDate = new Date(lead.followUpDate);
    followUpDate.setHours(0, 0, 0, 0);
    return (
      followUpDate >= today && 
      followUpDate < tomorrow && 
      lead.status !== 'converted' && 
      lead.status !== 'closed'
    );
  });
};
