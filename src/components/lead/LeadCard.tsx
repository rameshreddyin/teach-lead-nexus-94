
import React, { memo, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lead, getSourceText } from '@/lib/types';
import { Phone } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, newStatus: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = memo(({ lead, onClick }) => {
  const formattedDate = formatDistanceToNow(new Date(lead.createdAt), {
    addSuffix: true,
  });

  const followUpDate = new Date(lead.followUpDate).toLocaleDateString();

  const handleClick = useCallback(() => {
    onClick(lead);
  }, [lead, onClick]);

  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.99]"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{lead.studentName}</h3>
            <p className="text-app-mediumGray text-sm truncate">{lead.parentName}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          <div className="text-app-mediumGray">Class:</div>
          <div className="font-medium truncate">{lead.class}</div>
          
          <div className="text-app-mediumGray">Source:</div>
          <div className="font-medium truncate">{getSourceText(lead.source)}</div>
          
          <div className="text-app-mediumGray">Follow-up:</div>
          <div className="font-medium">{followUpDate}</div>

          <div className="text-app-mediumGray">Contact:</div>
          <div className="flex items-center gap-1 text-app-black">
            <Phone className="h-3 w-3" />
            <span className="truncate">{lead.contactNumber}</span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-xs">
          <span className="text-app-mediumGray">{formattedDate}</span>
          {lead.notes && (
            <span className="flex items-center text-app-mediumGray">
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
});

LeadCard.displayName = 'LeadCard';
