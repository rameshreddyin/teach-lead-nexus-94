
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { getUserLeads, getFollowUpLeads } from '@/lib/leadService';
import { Lead, LeadStatus, LeadSource } from '@/lib/types';
import { LeadCard } from '@/components/lead/LeadCard';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUpLeads, setFollowUpLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load leads on component mount
  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  // Load leads from the service
  const loadLeads = () => {
    setIsLoading(true);
    
    if (user) {
      // Get all leads
      const allLeads = getUserLeads(user.id);
      setLeads(allLeads);
      
      // Get today's follow-up leads
      const todayFollowUps = getFollowUpLeads(user.id);
      setFollowUpLeads(todayFollowUps);
      
      // Initialize filtered leads
      setFilteredLeads(allLeads);
    }
    
    setIsLoading(false);
  };

  // Apply filters when they change
  useEffect(() => {
    if (leads.length > 0) {
      let filtered = [...leads];
      
      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(lead => lead.status === statusFilter);
      }
      
      // Apply source filter
      if (sourceFilter && sourceFilter !== 'all') {
        filtered = filtered.filter(lead => lead.source === sourceFilter);
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          lead => 
            lead.studentName.toLowerCase().includes(query) || 
            lead.parentName.toLowerCase().includes(query)
        );
      }
      
      setFilteredLeads(filtered);
    }
  }, [leads, statusFilter, sourceFilter, searchQuery]);

  // Handle lead card click
  const handleLeadClick = (lead: Lead) => {
    navigate(`/lead/${lead.id}`);
  };

  // Handle add new lead
  const handleAddLead = () => {
    navigate('/add-lead');
  };

  return (
    <div className="px-4 py-3">
      {/* Tabs for All Leads and Today's Follow-ups */}
      <Tabs defaultValue="all" className="mb-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">All Leads</TabsTrigger>
          <TabsTrigger value="followup" className="flex-1">
            Today's Follow-ups
            {followUpLeads.length > 0 && (
              <span className="ml-2 bg-app-black text-app-white px-2 py-0.5 rounded-full text-xs">
                {followUpLeads.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {/* Search and filters */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-app-mediumGray" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as LeadStatus | '')}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={sourceFilter} 
                onValueChange={(value) => setSourceFilter(value as LeadSource | '')}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="parent_referral">Parent Referral</SelectItem>
                  <SelectItem value="school_event">School Event</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Lead list */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-pulse text-app-mediumGray">Loading leads...</div>
            </div>
          ) : filteredLeads.length > 0 ? (
            <div>
              {filteredLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onClick={handleLeadClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-app-mediumGray">
              <p>No leads found</p>
              <p className="text-sm mt-2">Add your first lead to get started</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="followup">
          {followUpLeads.length > 0 ? (
            <div>
              {followUpLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onClick={handleLeadClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-app-mediumGray">
              <p>No follow-ups for today</p>
              <p className="text-sm mt-2">All caught up! 🎉</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Floating action button */}
      <FloatingActionButton onClick={handleAddLead} />
    </div>
  );
};

export default Home;
