
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
        <h1 className="text-xl font-medium">Privacy Policy</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>Last updated: April 21, 2025</p>
          
          <h3 className="text-base font-medium mt-4">1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, submit lead information, or contact us.</p>
          
          <h3 className="text-base font-medium mt-4">2. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.</p>
          
          <h3 className="text-base font-medium mt-4">3. Information Sharing</h3>
          <p>We do not share your personal information with third parties except as described in this policy.</p>
          
          <h3 className="text-base font-medium mt-4">4. Data Security</h3>
          <p>We use reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>
          
          <h3 className="text-base font-medium mt-4">5. Your Rights and Choices</h3>
          <p>You can update your account information and preferences at any time by logging into your account settings.</p>
          
          <h3 className="text-base font-medium mt-4">6. Children's Privacy</h3>
          <p>Our services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children.</p>
          
          <h3 className="text-base font-medium mt-4">7. Changes to this Policy</h3>
          <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          
          <h3 className="text-base font-medium mt-4">8. Contact Us</h3>
          <p>If you have any questions about this privacy policy, please contact us at privacy@leadtracker.com.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
