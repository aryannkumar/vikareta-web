'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Loader2,
  AlertCircle,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  userType: 'buyer' | 'business';
  verified: boolean;
  joinedDate: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    reviewsGiven: number;
    averageRating: number;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  const toast = useToast();
  const { user, refreshToken } = useVikaretaAuthContext();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Import the profile API
      const { profileApi } = await import('@/lib/api/profile');
      const response = await profileApi.getProfile();
      
      if (response.success && response.data) {
        const profileData: UserProfile = {
          id: response.data.id,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          avatar: response.data.avatar,
          company: response.data.businessName || '',
          location: response.data.location || '',
          bio: response.data.bio || '',
          website: response.data.website || '',
          userType: response.data.userType === 'business' ? 'business' : 'buyer',
          verified: response.data.isVerified || false,
          joinedDate: response.data.createdAt || new Date().toISOString(),
          stats: response.data.stats || {
            totalOrders: 0,
            totalSpent: 0,
            reviewsGiven: 0,
            averageRating: 0
          }
        };
        setProfile(profileData);
        setEditData(profileData);
      } else {
        throw new Error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!editData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!editData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (editData.website && !/^https?:\/\/.+/.test(editData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Import the profile API
      const { profileApi } = await import('@/lib/api/profile');
      
      // Prepare update data
      const updateData = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
        businessName: editData.company,
        location: editData.location,
        bio: editData.bio,
        website: editData.website,
        avatar: editData.avatar,
      };

      const response = await profileApi.updateProfile(updateData);
      
      if (response.success && response.data) {
        // Update local state with response data
        const updatedProfile: UserProfile = {
          ...profile!,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
          company: response.data.businessName || '',
          location: response.data.location || '',
          bio: response.data.bio || '',
          website: response.data.website || '',
          avatar: response.data.avatar,
        };
        
        setProfile(updatedProfile);
        setEditing(false);
        toast.success('Success', 'Profile updated successfully');
        
        // Refresh user data in auth context
        if (refreshToken) {
          await refreshToken();
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setErrors({});
    setEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Error', 'Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Error', 'Please select an image file');
      return;
    }

    try {
      // For now, use base64 encoding for avatar
      // In production, you would upload to a file storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        setEditData(prev => ({ ...prev, avatar: avatarUrl }));
        toast.success('Success', 'Avatar uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error', 'Failed to upload avatar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative min-h-screen px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg h-32 sm:h-40 lg:h-48 mb-6 sm:mb-8 border"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg h-64 sm:h-80 border"></div>
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg h-64 sm:h-80 border"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-4 sm:mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg h-20 sm:h-24 border"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg h-20 sm:h-24 border"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg h-20 sm:h-24 border"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg h-20 sm:h-24 border"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative text-center bg-white/80 backdrop-blur-sm rounded-lg border p-6 sm:p-8 lg:p-12 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">Unable to load your profile information.</p>
          <Button onClick={loadProfile} className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 min-h-[44px]">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 leading-tight">
                My Profile
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                Manage your account information and preferences
              </p>
            </div>
            
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] shadow-sm">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            ) : (
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] border-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:items-start lg:flex-shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                    {(editing ? editData.avatar : profile.avatar) ? (
                      <Image
                        src={(editing ? editData.avatar : profile.avatar) || ''}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 lg:p-2.5 cursor-pointer hover:bg-primary/90 shadow-lg border-2 border-white">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="text-center lg:text-left mt-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                    <Badge variant={profile.userType === 'business' ? 'default' : 'secondary'} className="text-xs px-2 py-1 font-medium">
                      {profile.userType === 'business' ? 'Business' : 'Buyer'}
                    </Badge>
                    {profile.verified && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs px-2 py-1">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Member since {new Date(profile.joinedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">First Name</label>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          value={editData.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm ${
                            errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                          disabled={saving}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">{profile.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">Last Name</label>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          value={editData.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm ${
                            errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                          disabled={saving}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">
                      <Mail className="h-4 w-4 inline mr-2 text-gray-500" />
                      Email
                    </label>
                    {editing ? (
                      <div>
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm ${
                            errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                          disabled={saving}
                          placeholder="Enter email address"
                        />
                        {errors.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        {profile.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">
                      <Phone className="h-4 w-4 inline mr-2 text-gray-500" />
                      Phone
                    </label>
                    {editing ? (
                      <div>
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm ${
                            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                          disabled={saving}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        {profile.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">
                      <Building className="h-4 w-4 inline mr-2 text-gray-500" />
                      Company
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm"
                        placeholder="Your company name"
                        disabled={saving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        {profile.company || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">
                      <MapPin className="h-4 w-4 inline mr-2 text-gray-500" />
                      Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm"
                        placeholder="Your location"
                        disabled={saving}
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        {profile.location || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">Website</label>
                  {editing ? (
                    <div>
                      <input
                        type="url"
                        value={editData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base min-h-[44px] shadow-sm ${
                          errors.website ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://your-website.com"
                        disabled={saving}
                      />
                      {errors.website && (
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          {errors.website}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                          {profile.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2 text-gray-700">Bio</label>
                  {editing ? (
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm sm:text-base shadow-sm resize-vertical"
                      rows={3}
                      placeholder="Tell us about yourself..."
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                      {profile.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-3 sm:p-4 lg:p-6 text-center hover:shadow-xl transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                {profile.stats.totalOrders}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Total Orders</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-3 sm:p-4 lg:p-6 text-center hover:shadow-xl transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                ₹{(profile.stats.totalSpent || 0).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Total Spent</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-3 sm:p-4 lg:p-6 text-center hover:shadow-xl transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                {profile.stats.reviewsGiven}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Reviews Given</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-3 sm:p-4 lg:p-6 text-center hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400 fill-current" />
                {profile.stats.averageRating.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}