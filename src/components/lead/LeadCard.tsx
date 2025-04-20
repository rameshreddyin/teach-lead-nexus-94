
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lead, getSourceText } from '@/lib/types';

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, newStatus: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick, onStatusChange }) => {
  // Format the created date
  const formattedDate = formatDistanceToNow(new Date(lead.createdAt), {
    addSuffix: true,
  });

  // Format the follow-up date
  const followUpDate = new Date(lead.followUpDate).toLocaleDateString();

  // Handle card click
  const handleClick = () => {
    onClick(lead);
  };

  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{lead.studentName}</h3>
            <p className="text-app-mediumGray text-sm">{lead.parentName}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <div className="text-app-mediumGray">Class:</div>
          <div>{lead.class}</div>
          
          <div className="text-app-mediumGray">Source:</div>
          <div>{getSourceText(lead.source)}</div>
          
          <div className="text-app-mediumGray">Follow-up:</div>
          <div>{followUpDate}</div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-xs text-app-mediumGray">
          <span>{formattedDate}</span>
          {lead.notes && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Has notes
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
