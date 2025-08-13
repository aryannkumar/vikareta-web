'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function TestRedirectPage() {
  const [testToken, setTestToken] = useState('test-token-12345');

  const handleTestRedirect = () => {
    const dashboardUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : 'https://dashboard.vikareta.com';
    
    console.log('Test: Redirecting to dashboard with test token');
    
    // Store test token
    localStorage.setItem('auth_token', testToken);
    
    const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(testToken)}&redirect=test&source=test_page`;
    console.log('Test: Redirect URL:', urlWithAuth);
    
    window.location.href = urlWithAuth;
  };

  const handleClearStorage = () => {
    localStorage.clear();
    console.log('Test: Cleared localStorage');
  };

  const checkCurrentStorage = () => {
    const token = localStorage.getItem('auth_token');
    console.log('Test: Current auth_token:', token);
    alert(`Current auth_token: ${token || 'Not found'}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Cross-Domain Redirect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Token</label>
              <Input
                value={testToken}
                onChange={(e) => setTestToken(e.target.value)}
                placeholder="Enter test token"
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleTestRedirect}>
                Test Redirect to Dashboard
              </Button>
              <Button variant="outline" onClick={checkCurrentStorage}>
                Check Storage
              </Button>
              <Button variant="outline" onClick={handleClearStorage}>
                Clear Storage
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Test Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter a test token above</li>
                <li>Click "Test Redirect to Dashboard"</li>
                <li>You should be redirected to dashboard.vikareta.com</li>
                <li>Check the dashboard debug page to see if token was received</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold mb-2">Environment Info:</h3>
              <p className="text-sm">
                <strong>NODE_ENV:</strong> {process.env.NODE_ENV}<br />
                <strong>Dashboard URL:</strong> {process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://dashboard.vikareta.com'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}