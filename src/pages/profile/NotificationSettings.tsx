
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [appNotifications, setAppNotifications] = React.useState(true);
  const [followUpReminders, setFollowUpReminders] = React.useState(true);
  const [leadUpdates, setLeadUpdates] = React.useState(true);
  
  const handleSave = () => {
    // In a real app, this would save the notification settings
    navigate('/profile');
  };

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
        <h1 className="text-xl font-medium">Notification Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manage Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Email Notifications</h3>
              <p className="text-xs text-app-mediumGray">Receive email alerts</p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">App Notifications</h3>
              <p className="text-xs text-app-mediumGray">Receive in-app notifications</p>
            </div>
            <Switch 
              checked={appNotifications} 
              onCheckedChange={setAppNotifications} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Follow-up Reminders</h3>
              <p className="text-xs text-app-mediumGray">Get reminded about upcoming follow-ups</p>
            </div>
            <Switch 
              checked={followUpReminders} 
              onCheckedChange={setFollowUpReminders} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Lead Updates</h3>
              <p className="text-xs text-app-mediumGray">Notifications when leads are updated</p>
            </div>
            <Switch 
              checked={leadUpdates} 
              onCheckedChange={setLeadUpdates} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
