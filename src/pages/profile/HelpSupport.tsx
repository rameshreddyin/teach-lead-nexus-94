
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';

const HelpSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2" 
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium">Help & Support</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-app-mediumGray" />
            <div>
              <h3 className="text-sm font-medium">Email Support</h3>
              <p className="text-xs text-app-mediumGray">support@leadtracker.com</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-app-mediumGray" />
            <div>
              <h3 className="text-sm font-medium">Call Support</h3>
              <p className="text-xs text-app-mediumGray">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-3 text-app-mediumGray" />
            <div>
              <h3 className="text-sm font-medium">Live Chat</h3>
              <p className="text-xs text-app-mediumGray">Available 9am-5pm ET, Monday-Friday</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">How do I add a new lead?</h3>
            <p className="text-xs text-app-mediumGray">Use the plus button at the bottom of the screen to add a new lead.</p>
          </div>
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-1">How can I update a lead's status?</h3>
            <p className="text-xs text-app-mediumGray">Open the lead details and use the status dropdown to change the status.</p>
          </div>
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-1">Can I export my leads?</h3>
            <p className="text-xs text-app-mediumGray">Yes, you can export your leads from the main dashboard using the export button.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
