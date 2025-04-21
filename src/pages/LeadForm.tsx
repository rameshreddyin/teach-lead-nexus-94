import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { createLead, getLead, updateLead } from '@/lib/leadService';
import { LeadFormData, Lead } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SuccessConfirmation } from '@/components/lead/SuccessConfirmation';
import { MapPin } from 'lucide-react';

const LeadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<LeadFormData & {
    pincode?: string;
    locality?: string;
    city?: string;
    state?: string;
  }>({
    studentName: '',
    parentName: '',
    contactNumber: '',
    contactEmail: '',
    class: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    source: 'parent_referral',
    followUpDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const isEditing = location.pathname.includes('/edit-lead');

  useEffect(() => {
    if (isEditing && id) {
      const lead = getLead(id);
      if (lead) {
        const followUpDate = format(new Date(lead.followUpDate), 'yyyy-MM-dd');
        const addressParts = parseAddressFromStreet(lead.street);
        
        setFormData({
          studentName: lead.studentName,
          parentName: lead.parentName,
          contactNumber: lead.contactNumber,
          contactEmail: lead.contactEmail || '',
          class: lead.class,
          street: addressParts.street || lead.street,
          locality: addressParts.locality || '',
          city: addressParts.city || '',
          state: addressParts.state || '',
          pincode: addressParts.pincode || '',
          source: lead.source,
          followUpDate,
          notes: lead.notes,
        });
      }
    }
  }, [id, isEditing]);

  const parseAddressFromStreet = (streetAddress: string) => {
    const parts = streetAddress.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      locality: parts[1] || '',
      city: parts[2] || '',
      state: parts[3] || '',
      pincode: parts[4] || '',
    };
  };

  const combineAddressComponents = () => {
    const { street, locality, city, state, pincode } = formData;
    return [
      street, 
      locality, 
      city, 
      state, 
      pincode
    ].filter(Boolean).join(', ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const combinedAddress = combineAddressComponents();
      
      const submissionData = {
        ...formData,
        street: combinedAddress
      };
      
      delete (submissionData as any).locality;
      delete (submissionData as any).city;
      delete (submissionData as any).state;
      delete (submissionData as any).pincode;
      
      if (isEditing && id) {
        await updateLead(id, submissionData as Partial<Lead>);
        setSuccessMessage('Lead Updated Successfully');
      } else {
        await createLead(submissionData as LeadFormData, user.id);
        setSuccessMessage('Lead Added Successfully');
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Lead form error:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} lead. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-4 pb-20">
      {showSuccess && (
        <SuccessConfirmation 
          message={successMessage}
          subMessage="Returning to home screen"
          autoCloseDelay={2000}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mobile-form">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Student full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="parentName">Parent/Guardian Name *</Label>
          <Input
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            placeholder="Parent/guardian full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Phone number"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email (Optional)</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Email address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class">Class/Grade *</Label>
          <Input
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="e.g., 5th Grade, 10-A"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street/Address *</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Home address"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="source">Lead Source *</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange('source', value)}
            required
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent_referral">Parent Referral</SelectItem>
              <SelectItem value="school_event">School Event</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="followUpDate">Follow-up Date *</Label>
          <Input
            id="followUpDate"
            name="followUpDate"
            type="date"
            value={formData.followUpDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional information about this lead"
            rows={4}
          />
        </div>
        
        <div className="mt-8 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-app-black" />
            <h3 className="text-base font-medium">Location Details</h3>
          </div>
          
          <div className="space-y-3 border border-app-lightGray rounded-md p-3 bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House/Flat No., Street Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="locality">Locality/Area</Label>
              <Input
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Neighborhood, Area"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">Pin Code *</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-app-black h-12 mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? isEditing ? 'Updating...' : 'Adding...' 
            : isEditing ? 'Update Lead' : 'Add Lead'
          }
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;
