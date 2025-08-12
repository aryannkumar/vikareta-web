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
import { useAuth } from '@/lib/hooks/useAuth';

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
  userType: 'buyer' | 'seller';
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
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from API
      // For now, use the auth user data
      if (user) {
        const mockProfile: UserProfile = {
          id: user.id,
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phone || '',
          avatar: user.avatar,
          company: user.profile?.company || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          website: '',
          userType: (user.role === 'admin' ? 'seller' : user.role) || 'buyer',
          verified: user.verified || false,
          joinedDate: user.createdAt || new Date().toISOString(),
          stats: {
            totalOrders: 12,
            totalSpent: 125000,
            reviewsGiven: 8,
            averageRating: 4.5
          }
        };
        setProfile(mockProfile);
        setEditData(mockProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error', 'Failed to load profile');
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
      // Update user profile via API
      // await profileApi.updateProfile(editData);
      await refreshUser();
      setProfile(prev => prev ? { ...prev, ...editData } : null);
      setEditing(false);
      toast.success('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error', 'Failed to update profile');
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
      // In a real app, upload to server
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Mock upload - in reality, this would be an API call
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-muted rounded h-4"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted rounded h-4"></div>
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
            
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-card rounded-lg border p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
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
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="text-center mt-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Badge variant={profile.userType === 'seller' ? 'default' : 'secondary'}>
                      {profile.userType === 'seller' ? 'Seller' : 'Buyer'}
                    </Badge>
                    {profile.verified && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Member since {new Date(profile.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          value={editData.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                            errors.firstName ? 'border-red-500' : ''
                          }`}
                          disabled={saving}
                        />
                        {errors.firstName && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-foreground">{profile.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          value={editData.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                            errors.lastName ? 'border-red-500' : ''
                          }`}
                          disabled={saving}
                        />
                        {errors.lastName && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-foreground">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    {editing ? (
                      <div>
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                          disabled={saving}
                        />
                        {errors.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-foreground">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    {editing ? (
                      <div>
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                            errors.phone ? 'border-red-500' : ''
                          }`}
                          disabled={saving}
                        />
                        {errors.phone && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-foreground">{profile.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="Your company name"
                        disabled={saving}
                      />
                    ) : (
                      <p className="text-foreground">{profile.company || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="Your location"
                        disabled={saving}
                      />
                    ) : (
                      <p className="text-foreground">{profile.location || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  {editing ? (
                    <div>
                      <input
                        type="url"
                        value={editData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                          errors.website ? 'border-red-500' : ''
                        }`}
                        placeholder="https://your-website.com"
                        disabled={saving}
                      />
                      {errors.website && (
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.website}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-foreground">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {profile.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      rows={3}
                      placeholder="Tell us about yourself..."
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-foreground">{profile.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {profile.stats.totalOrders}
              </div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>

            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                ₹{(profile.stats.totalSpent || 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>

            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {profile.stats.reviewsGiven}
              </div>
              <div className="text-sm text-muted-foreground">Reviews Given</div>
            </div>

            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                {profile.stats.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}