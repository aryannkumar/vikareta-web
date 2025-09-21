'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

interface OnboardingStatus {
  completed: boolean;
  userType: 'normal' | 'business';
  progress: number;
}

export function OnboardingGuard({ children, redirectTo = '/onboarding' }: OnboardingGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useVikaretaAuthContext();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated || !user || isLoading) return;

      // Only check onboarding for business users
      if (user.userType !== 'business') {
        setOnboardingStatus({ completed: true, userType: user.userType === 'guest' ? 'normal' : 'normal', progress: 100 });
        return;
      }

      setCheckingOnboarding(true);
      try {
        const response = await fetch('/api/onboarding/status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setOnboardingStatus({
              completed: data.data.completed,
              userType: data.data.userType,
              progress: data.data.progress,
            });

            // Redirect if onboarding is not completed
            if (!data.data.completed) {
              console.log('Onboarding not completed, redirecting to:', redirectTo);
              router.push(redirectTo);
              return;
            }
          }
        } else {
          console.warn('Failed to fetch onboarding status:', response.status);
          // If we can't check status, allow access to avoid blocking users
          setOnboardingStatus({ completed: true, userType: 'business', progress: 100 });
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error, allow access to avoid blocking users
        setOnboardingStatus({ completed: true, userType: 'business', progress: 100 });
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user, isLoading, router, redirectTo]);

  // Show loading while checking auth or onboarding
  if (isLoading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking onboarding status...</span>
        </div>
      </div>
    );
  }

  // Allow access for unauthenticated users and non-business users
  if (!isAuthenticated || !user || user.userType !== 'business') {
    return <>{children}</>;
  }

  // If onboarding is not completed, show redirect message
  if (onboardingStatus && !onboardingStatus.completed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Redirecting to complete onboarding...</span>
        </div>
      </div>
    );
  }

  // Render children if onboarding is completed
  return <>{children}</>;
}