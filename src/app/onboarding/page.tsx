'use client';

import React from 'react';
import Onboarding from '../../components/onboarding/Onboarding';

export default function OnboardingPage() {
  const handleComplete = () => {
    // Redirect to dashboard or marketplace after onboarding
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen">
      <Onboarding onComplete={handleComplete} />
    </div>
  );
}