
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
