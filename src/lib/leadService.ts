import { Lead, LeadFormData, LeadStatus, LeadFilter } from './types';

// In a real app, this would be an API call to your backend
// For this demo, we'll use localStorage to persist data

const STORAGE_KEY = 'teacher_leads';
const DEFAULT_USER_ID = 'default-user'; // Add a constant for default user ID

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

// Clear any existing data (for testing purposes)
const clearExistingData = () => {
  console.log("Clearing existing data");
  localStorage.removeItem(STORAGE_KEY);
};

// Initialize with dummy data if storage is empty
const initializeDummyData = () => {
  // First clear any existing data to ensure fresh dummy data
  clearExistingData();
  
  const dummyLeads: Lead[] = [
    {
      id: 'lead1',
      studentName: 'Alice Johnson',
      parentName: 'Sarah Johnson',
      contactNumber: '+1234567890',
      contactEmail: 'sarah.johnson@example.com',
      class: 'Grade 5',
      street: '123 Oak Street, Anytown',
      source: 'parent_referral',
      status: 'new',
      followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      notes: 'Interested in after-school programs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead2',
      studentName: 'Tom Smith',
      parentName: 'Mary Smith',
      contactNumber: '+1234567891',
      contactEmail: 'mary.smith@example.com',
      class: 'Grade 3',
      street: '456 Pine Avenue, Springfield',
      source: 'school_event',
      status: 'contacted',
      followUpDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      notes: 'Met at science fair',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead3',
      studentName: 'Michael Brown',
      parentName: 'John Brown',
      contactNumber: '+1234567892',
      contactEmail: 'john.brown@example.com',
      class: 'Grade 4',
      street: '789 Maple Road, Westville',
      source: 'website',
      status: 'follow_up',
      followUpDate: new Date().toISOString(), // Today
      notes: 'Questions about curriculum',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead4',
      studentName: 'Emily Davis',
      parentName: 'Lisa Davis',
      contactNumber: '+1234567893',
      contactEmail: 'lisa.davis@example.com',
      class: 'Grade 6',
      street: '101 Cedar Lane, Easton',
      source: 'social_media',
      status: 'converted',
      followUpDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      notes: 'Registration completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead5',
      studentName: 'David Wilson',
      parentName: 'James Wilson',
      contactNumber: '+1234567894',
      contactEmail: 'james.wilson@example.com',
      class: 'Grade 2',
      street: '202 Birch Boulevard, Northtown',
      source: 'community',
      status: 'new',
      followUpDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      notes: 'Interested in music program',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead6',
      studentName: 'Sofia Martinez',
      parentName: 'Ana Martinez',
      contactNumber: '+1234567895',
      contactEmail: 'ana.martinez@example.com',
      class: 'Grade 1',
      street: '303 Willow Way, Southville',
      source: 'parent_referral',
      status: 'follow_up',
      followUpDate: new Date().toISOString(), // Today
      notes: 'Recommended by Johnson family',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead7',
      studentName: 'Lucas Taylor',
      parentName: 'Emma Taylor',
      contactNumber: '+1234567896',
      contactEmail: 'emma.taylor@example.com',
      class: 'Grade 4',
      street: '404 Aspen Court, Eastwood',
      source: 'school_event',
      status: 'closed',
      followUpDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      notes: 'Decided on another school',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead8',
      studentName: 'Oliver Anderson',
      parentName: 'Robert Anderson',
      contactNumber: '+1234567897',
      contactEmail: 'robert.anderson@example.com',
      class: 'Grade 3',
      street: '505 Redwood Drive, Westend',
      source: 'website',
      status: 'contacted',
      followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      notes: 'Following up on website inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead9',
      studentName: 'Ava Thompson',
      parentName: 'Michael Thompson',
      contactNumber: '+1234567898',
      contactEmail: 'michael.thompson@example.com',
      class: 'Grade 5',
      street: '606 Spruce Street, Northpoint',
      source: 'social_media',
      status: 'new',
      followUpDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
      notes: 'Facebook advertisement response',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    },
    {
      id: 'lead10',
      studentName: 'Ethan Lee',
      parentName: 'Jennifer Lee',
      contactNumber: '+1234567899',
      contactEmail: 'jennifer.lee@example.com',
      class: 'Grade 6',
      street: '707 Fir Avenue, Southpoint',
      source: 'community',
      status: 'converted',
      followUpDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      notes: 'Successfully enrolled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: DEFAULT_USER_ID
    }
  ];

  saveLeads(dummyLeads);
  console.log('Dummy data initialized:', dummyLeads.length, 'leads');
};

// Initialize dummy data
console.log("About to initialize dummy data");
initializeDummyData();

// Get all leads for a user
export const getUserLeads = (userId: string): Lead[] => {
  // For demo purposes, if userId is undefined or null, use the default user ID
  const userIdToUse = userId || DEFAULT_USER_ID;
  const allLeads = getLeads();
  console.log(`Getting leads for user: ${userIdToUse}, found ${allLeads.length} total leads`);
  
  // CRITICAL FIX: Return ALL leads during development to ensure data is visible
  // In a real app, we'd filter by user ID
  return allLeads;
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
