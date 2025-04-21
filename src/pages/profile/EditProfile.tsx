
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ArrowLeft } from 'lucide-react';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile changes
    // For now, just navigate back
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
        <h1 className="text-xl font-medium">Edit Profile</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-center">Your Profile</CardTitle>
          <div className="flex justify-center mt-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-app-lightGray">
                <User className="h-12 w-12 text-app-mediumGray" />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Input id="role" defaultValue={user.role} disabled />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/profile')}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditProfile;
