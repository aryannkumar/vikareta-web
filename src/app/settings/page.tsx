'use client';

import React, { useState, useEffect } from 'react';
import { 
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { useTheme } from '@/components/theme-provider';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';
import { settingsApi } from '@/lib/api/settings';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    autoSave: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: false,
      newsletter: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      autoSave: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);

  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const { user } = useVikaretaAuthContext();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getUserSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error', 'Failed to load settings');
    } finally {
      setInitialLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.updateUserSettings(settings);
      if (response.success) {
        setHasChanges(false);
        toast.success('Success', 'Settings saved successfully');
      } else {
        toast.error('Error', response.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const resetToDefaults = async () => {
    try {
      const response = await settingsApi.resetUserSettings();
      if (response.success) {
        setSettings(response.data);
        setHasChanges(true);
        toast.info('Reset', 'Settings reset to defaults');
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Error', 'Failed to reset settings');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Monitor }
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="bg-muted rounded-lg h-64"></div>
              <div className="lg:col-span-3 bg-muted rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and privacy settings
              </p>
            </div>
            
            {hasChanges && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  You have unsaved changes
                </div>
                <Button
                  onClick={saveSettings}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border p-6">
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Delivery Methods</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Email Notifications</div>
                              <div className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.email}
                              onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Push Notifications</div>
                              <div className="text-sm text-muted-foreground">
                                Receive push notifications in your browser
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.push}
                              onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">SMS Notifications</div>
                              <div className="text-sm text-muted-foreground">
                                Receive important updates via SMS
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.sms}
                              onChange={(e) => updateSetting('notifications', 'sms', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Notification Types</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Order Updates</div>
                              <div className="text-sm text-muted-foreground">
                                Get notified about order status changes
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.orderUpdates}
                              onChange={(e) => updateSetting('notifications', 'orderUpdates', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Promotions & Offers</div>
                              <div className="text-sm text-muted-foreground">
                                Receive notifications about special offers
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.promotions}
                              onChange={(e) => updateSetting('notifications', 'promotions', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Newsletter</div>
                              <div className="text-sm text-muted-foreground">
                                Weekly newsletter with market insights
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.newsletter}
                              onChange={(e) => updateSetting('notifications', 'newsletter', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Profile Visibility</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Who can see your profile?</label>
                            <select
                              value={settings.privacy.profileVisibility}
                              onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            >
                              <option value="public">Public - Anyone can see</option>
                              <option value="private">Private - Only you can see</option>
                            </select>
                          </div>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Show Email Address</div>
                              <div className="text-sm text-muted-foreground">
                                Display your email on your public profile
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.showEmail}
                              onChange={(e) => updateSetting('privacy', 'showEmail', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Show Phone Number</div>
                              <div className="text-sm text-muted-foreground">
                                Display your phone number on your public profile
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.showPhone}
                              onChange={(e) => updateSetting('privacy', 'showPhone', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Communication</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Allow Direct Messages</div>
                              <div className="text-sm text-muted-foreground">
                                Let other users send you direct messages
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.allowMessages}
                              onChange={(e) => updateSetting('privacy', 'allowMessages', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Language</label>
                          <select
                            value={settings.preferences.language}
                            onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="mr">मराठी (Marathi)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Currency</label>
                          <select
                            value={settings.preferences.currency}
                            onChange={(e) => updateSetting('preferences', 'currency', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          >
                            <option value="INR">₹ Indian Rupee (INR)</option>
                            <option value="USD">$ US Dollar (USD)</option>
                            <option value="EUR">€ Euro (EUR)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Timezone</label>
                          <select
                            value={settings.preferences.timezone}
                            onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          >
                            <option value="Asia/Kolkata">India Standard Time (IST)</option>
                            <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                            <option value="UTC">Coordinated Universal Time (UTC)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Auto-save Drafts</div>
                            <div className="text-sm text-muted-foreground">
                              Automatically save form drafts as you type
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.preferences.autoSave}
                            onChange={(e) => updateSetting('preferences', 'autoSave', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Theme</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => setTheme('light')}
                            className={`p-4 border rounded-lg text-left transition-colors ${
                              theme === 'light'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Sun className="h-5 w-5" />
                              <span className="font-medium">Light</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Clean and bright interface
                            </p>
                          </button>
                          
                          <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 border rounded-lg text-left transition-colors ${
                              theme === 'dark'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Moon className="h-5 w-5" />
                              <span className="font-medium">Dark</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Easy on the eyes in low light
                            </p>
                          </button>
                          
                          <button
                            onClick={() => setTheme('system')}
                            className={`p-4 border rounded-lg text-left transition-colors ${
                              theme === 'system'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Monitor className="h-5 w-5" />
                              <span className="font-medium">System</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Matches your device settings
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={resetToDefaults}
                  >
                    Reset to Defaults
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    {hasChanges && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        Unsaved changes
                      </div>
                    )}
                    <Button
                      onClick={saveSettings}
                      disabled={loading || !hasChanges}
                      className="btn-primary"
                    >
                      {loading ? (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}