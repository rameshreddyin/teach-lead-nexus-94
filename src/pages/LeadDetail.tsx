
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLead, updateLeadStatus, deleteLead } from '@/lib/leadService';
import { Lead, LeadStatus, getStatusText, getSourceText } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Edit, Trash, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load lead details
  useEffect(() => {
    if (id) {
      const leadData = getLead(id);
      if (leadData) {
        setLead(leadData);
      } else {
        toast({
          title: "Error",
          description: "Lead not found",
          variant: "destructive",
        });
        navigate('/');
      }
      setIsLoading(false);
    }
  }, [id, navigate, toast]);

  // Handle status change
  const handleStatusChange = (newStatus: LeadStatus) => {
    if (id && lead) {
      const updatedLead = updateLeadStatus(id, newStatus);
      setLead(updatedLead);
      toast({
        title: "Status updated",
        description: `Lead status changed to ${getStatusText(newStatus)}`,
      });
    }
  };

  // Handle edit lead
  const handleEdit = () => {
    navigate(`/edit-lead/${id}`);
  };

  // Handle delete lead
  const handleDelete = () => {
    if (id) {
      deleteLead(id);
      toast({
        title: "Lead deleted",
        description: "The lead has been deleted successfully",
      });
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-pulse text-app-mediumGray">Loading lead details...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-8 text-app-mediumGray">
        <p>Lead not found</p>
        <Button onClick={() => navigate('/')} variant="link">
          Return to Home
        </Button>
      </div>
    );
  }

  // Format follow-up date
  const followUpDate = format(new Date(lead.followUpDate), 'MMMM d, yyyy');
  
  // Format created date
  const createdDate = format(new Date(lead.createdAt), 'MMMM d, yyyy');

  return (
    <div className="px-4 py-4">
      {/* Lead header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-medium">{lead.studentName}</h1>
          <StatusBadge status={lead.status} />
        </div>
        <p className="text-app-mediumGray text-lg">{lead.parentName}</p>
        <p className="text-app-mediumGray text-sm mt-1">Added on {createdDate}</p>
      </div>

      {/* Contact info */}
      <Card className="mb-4">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-3 text-app-mediumGray" />
            <a href={`tel:${lead.contactNumber}`} className="text-app-black">
              {lead.contactNumber}
            </a>
          </div>
          
          {lead.contactEmail && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-app-mediumGray" />
              <a href={`mailto:${lead.contactEmail}`} className="text-app-black">
                {lead.contactEmail}
              </a>
            </div>
          )}
          
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-3 text-app-mediumGray mt-0.5" />
            <div>
              <p>{lead.street}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-3 text-app-mediumGray" />
            <p>Follow up: {followUpDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-y-3">
            <div className="text-app-mediumGray">Class/Grade</div>
            <div>{lead.class}</div>
            
            <div className="text-app-mediumGray">Source</div>
            <div>{getSourceText(lead.source)}</div>
            
            <div className="text-app-mediumGray">Status</div>
            <div>{getStatusText(lead.status)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {lead.notes && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Notes</h3>
            <p className="text-app-mediumGray whitespace-pre-line">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Status change buttons */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {['new', 'contacted', 'follow_up', 'converted', 'closed'].map((status) => (
            <Button
              key={status}
              variant={lead.status === status ? 'default' : 'outline'}
              onClick={() => handleStatusChange(status as LeadStatus)}
              className={`
                ${lead.status === status ? 'bg-app-black text-app-white' : 'bg-app-white text-app-black'}
                flex-1 min-w-[100px]
              `}
            >
              {getStatusText(status as LeadStatus)}
            </Button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={handleEdit}
          className="flex-1 bg-app-black text-app-white"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Lead
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive"
              className="bg-app-lightGray hover:bg-app-mediumGray text-app-darkGray"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lead</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this lead? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-app-black">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default LeadDetail;
