
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
        <h1 className="text-xl font-medium">Terms of Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>Last updated: April 21, 2025</p>
          
          <h3 className="text-base font-medium mt-4">1. Introduction</h3>
          <p>These Terms of Service govern your use of our lead management application and services.</p>
          
          <h3 className="text-base font-medium mt-4">2. Acceptance of Terms</h3>
          <p>By accessing or using our application, you agree to be bound by these terms.</p>
          
          <h3 className="text-base font-medium mt-4">3. Privacy Policy</h3>
          <p>Your use of our service is also governed by our Privacy Policy, which can be found in the app settings.</p>
          
          <h3 className="text-base font-medium mt-4">4. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account information.</p>
          
          <h3 className="text-base font-medium mt-4">5. Prohibited Activities</h3>
          <p>Users may not engage in any activity that interferes with or disrupts the service.</p>
          
          <h3 className="text-base font-medium mt-4">6. Termination</h3>
          <p>We reserve the right to terminate or suspend your account for violations of these terms.</p>
          
          <h3 className="text-base font-medium mt-4">7. Limitation of Liability</h3>
          <p>We shall not be liable for any indirect, incidental, special, consequential or punitive damages.</p>
          
          <h3 className="text-base font-medium mt-4">8. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes.</p>
          
          <h3 className="text-base font-medium mt-4">9. Contact Information</h3>
          <p>For questions about these terms, please contact support@leadtracker.com.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
