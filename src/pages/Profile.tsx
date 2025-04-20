
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogOut, Settings, User } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <div className="h-24 w-24 bg-app-lightGray rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-12 w-12 text-app-mediumGray" />
          </div>
          <h2 className="text-xl font-medium">{user.name}</h2>
          <p className="text-app-mediumGray">{user.email}</p>
          <p className="text-sm text-app-mediumGray mt-1 capitalize">{user.role}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <ul className="divide-y divide-app-lightGray">
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Edit Profile</span>
                <Settings className="h-4 w-4 text-app-mediumGray" />
              </button>
            </li>
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Notification Settings</span>
                <Settings className="h-4 w-4 text-app-mediumGray" />
              </button>
            </li>
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Change Password</span>
                <Settings className="h-4 w-4 text-app-mediumGray" />
              </button>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">App Information</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <ul className="divide-y divide-app-lightGray">
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Help & Support</span>
              </button>
            </li>
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Terms of Service</span>
              </button>
            </li>
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>Privacy Policy</span>
              </button>
            </li>
            <li className="py-3">
              <button className="w-full flex items-center justify-between">
                <span>App Version</span>
                <span className="text-sm text-app-mediumGray">1.0.0</span>
              </button>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            variant="destructive"
            className="w-full bg-app-lightGray hover:bg-app-mediumGray text-app-darkGray"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
