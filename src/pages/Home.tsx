
import React, { useState, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');

  console.log('Home component rendered, user:', user);
  
  // Use React Query for data fetching with proper caching
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', user?.id],
    queryFn: () => getUserLeads(user?.id || ''),
    staleTime: 60000, // 1 minute
    enabled: !!user,
  });
  
  // Get today's follow-ups using React Query
  const { data: followUpLeads = [] } = useQuery({
    queryKey: ['followUpLeads', user?.id],
    queryFn: () => getFollowUpLeads(user?.id || ''),
    staleTime: 60000, // 1 minute
    enabled: !!user,
  });

  // Apply filters using memoization to prevent unnecessary re-calculations
  const filteredLeads = useMemo(() => {
    console.log('Filtering leads...');
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
    
    return filtered;
  }, [leads, statusFilter, sourceFilter, searchQuery]);

  // Handle lead card click using useCallback to prevent recreation on each render
  const handleLeadClick = React.useCallback((lead: Lead) => {
    navigate(`/lead/${lead.id}`);
  }, [navigate]);

  // Handle add new lead
  const handleAddLead = React.useCallback(() => {
    navigate('/add-lead');
  }, [navigate]);

  return (
    <div className="px-4 py-3 pb-20">
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
                onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
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
                onValueChange={(value) => setSourceFilter(value as LeadSource | 'all')}
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
          {leadsLoading ? (
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
      
      {/* Floating action button with higher z-index and proper position */}
      <FloatingActionButton 
        onClick={handleAddLead} 
        className="z-50"
      />
    </div>
  );
};

export default Home;
