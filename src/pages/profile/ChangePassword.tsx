
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would update the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
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
        <h1 className="text-xl font-medium">Change Password</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/profile')}>Cancel</Button>
          <Button onClick={handleSubmit}>Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
