
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
import { MapPin, School, User } from 'lucide-react';

const CLASS_OPTIONS = [
  { value: 'Nursery', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: '1', label: '1st Grade' },
  { value: '2', label: '2nd Grade' },
  { value: '3', label: '3rd Grade' },
  { value: '4', label: '4th Grade' },
  { value: '5', label: '5th Grade' },
  { value: '6', label: '6th Grade' },
  { value: '7', label: '7th Grade' },
  { value: '8', label: '8th Grade' },
  { value: '9', label: '9th Grade' },
  { value: '10', label: '10th Grade' },
  { value: '11', label: '11th Grade' },
  { value: '12', label: '12th Grade' },
  { value: 'custom', label: 'Other (Custom)' },
];

const LeadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCustomClass, setShowCustomClass] = useState(false);

  const [formData, setFormData] = useState<LeadFormData & {
    pincode?: string;
    locality?: string;
    city?: string;
    state?: string;
    customClass?: string;
  }>({
    studentName: '',
    parentName: '',
    contactNumber: '',
    contactEmail: '',
    class: '',
    customClass: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    // Changed default source to teacher_referral
    source: 'teacher_referral',
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

        // If prefilled class is not in the standard class options, auto-select 'custom'
        const classIsCustom =
          !!lead.class &&
          !CLASS_OPTIONS.find((option) => option.value === lead.class);
        setShowCustomClass(classIsCustom);

        setFormData({
          studentName: lead.studentName,
          parentName: lead.parentName,
          contactNumber: lead.contactNumber,
          contactEmail: lead.contactEmail || '',
          class: classIsCustom ? 'custom' : lead.class,
          customClass: classIsCustom ? lead.class : '',
          street: addressParts.street || lead.street,
          locality: addressParts.locality || '',
          city: addressParts.city || '',
          state: addressParts.state || '',
          pincode: addressParts.pincode || '',
          source: lead.source || 'teacher_referral',
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
    if (name === 'class') {
      if (value === 'custom') {
        setShowCustomClass(true);
        setFormData(prev => ({
          ...prev,
          class: 'custom',
          customClass: '',
        }));
      } else {
        setShowCustomClass(false);
        setFormData(prev => ({
          ...prev,
          class: value,
          customClass: '',
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const combinedAddress = combineAddressComponents();

      // Use customClass if chosen
      const classValue = formData.class === 'custom'
        ? formData.customClass?.trim()
        : formData.class;

      const submissionData = {
        ...formData,
        class: classValue || '',
        street: combinedAddress,
      };

      delete (submissionData as any).locality;
      delete (submissionData as any).city;
      delete (submissionData as any).state;
      delete (submissionData as any).pincode;
      delete (submissionData as any).customClass;

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

        {/* Student Name */}
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Student full name"
            required
            autoComplete="name"
          />
        </div>

        {/* Parent Name */}
        <div className="space-y-2">
          <Label htmlFor="parentName">Parent/Guardian Name *</Label>
          <Input
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            placeholder="Parent/guardian full name"
            required
            autoComplete="name"
          />
        </div>

        {/* Contact Number */}
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
            autoComplete="tel"
            inputMode="tel"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email (Optional)</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Email address"
            autoComplete="email"
          />
        </div>

        {/* Class/Grade (Dropdown + Custom) */}
        <div className="space-y-2">
          <Label htmlFor="class" className="flex items-center gap-1">
            <School className="h-4 w-4 mr-1 text-muted-foreground" /> Class/Grade *
          </Label>
          <Select
            value={formData.class}
            onValueChange={(value) => handleSelectChange('class', value)}
            required
          >
            <SelectTrigger id="class">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomClass && (
            <Input
              className="mt-2"
              id="customClass"
              name="customClass"
              value={formData.customClass}
              onChange={handleChange}
              placeholder="Enter custom grade (e.g., 10-B, Pre-K, etc)"
              required
              autoFocus
            />
          )}
        </div>

        {/* LOCATION DETAILS */}
        <div className="mt-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-app-black" />
            <h3 className="text-base font-medium">Location Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-app-lightGray rounded-md p-4 bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pin Code *</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Postal Code (e.g. 560034)"
                autoComplete="postal-code"
                inputMode="numeric"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street/Flat *</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House/Flat No., Street Name"
                autoComplete="street-address"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="locality">Locality/Area</Label>
              <Input
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Neighborhood or Area (e.g. HSR Layout)"
                autoComplete="address-line2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                autoComplete="address-level1"
                required
              />
            </div>
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Please provide complete and accurate address details for better lead management.
          </div>
        </div>

        {/* Lead Source */}
        <div className="space-y-2">
          <Label htmlFor="source" className="flex items-center gap-1">
            <User className="h-4 w-4 mr-1 text-muted-foreground" /> Lead Source *
          </Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange('source', value)}
            required
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher_referral">Teacher Referral (Name)</SelectItem>
              <SelectItem value="parent_referral">Parent Referral</SelectItem>
              <SelectItem value="school_event">School Event</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Follow-up Date */}
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

        {/* Notes */}
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
