'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface OnboardingStep {
  key: string;
  label: string;
  description?: string;
  required: boolean;
  completed: boolean;
  current?: boolean;
  icon?: React.ReactNode;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep?: string;
  className?: string;
}

export default function OnboardingProgress({
  steps,
  currentStep,
  className
}: OnboardingProgressProps) {
  const getStepIcon = (step: OnboardingStep) => {
    if (step.completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    if (step.key === currentStep) {
      return <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;
    }

    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStepStatusLocal = (step: OnboardingStep) => {
    if (step.completed) return 'completed';
    if (step.key === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, currentStep);

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center space-x-4 p-4 rounded-lg border transition-all',
                {
                  'border-green-200 bg-green-50': status === 'completed',
                  'border-amber-200 bg-amber-50': status === 'current',
                  'border-gray-200 bg-white': status === 'pending',
                }
              )}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className={cn(
                    'text-sm font-medium',
                    {
                      'text-green-800': status === 'completed',
                      'text-amber-800': status === 'current',
                      'text-gray-700': status === 'pending',
                    }
                  )}>
                    {step.label}
                  </h3>
                  {step.required && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Required
                    </span>
                  )}
                </div>

                {step.description && (
                  <p className={cn(
                    'text-sm mt-1',
                    {
                      'text-green-600': status === 'completed',
                      'text-amber-600': status === 'current',
                      'text-gray-500': status === 'pending',
                    }
                  )}>
                    {step.description}
                  </p>
                )}
              </div>

              {/* Progress indicator */}
              <div className="flex-shrink-0">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  {
                    'bg-green-500': status === 'completed',
                    'bg-amber-500': status === 'current',
                    'bg-gray-300': status === 'pending',
                  }
                )} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>
            {steps.filter(step => step.completed).length} of {steps.length} steps completed
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(steps.filter(step => step.completed).length / steps.length) * 100}%`
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// Compact version for headers/navigation
interface OnboardingProgressCompactProps {
  steps: OnboardingStep[];
  currentStep?: string;
  className?: string;
}

export function OnboardingProgressCompact({
  steps,
  currentStep,
  className
}: OnboardingProgressCompactProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">Onboarding Progress</span>
          <span className="text-gray-600">
            {completedSteps}/{steps.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-amber-600">
          {Math.round(progress)}%
        </div>
        <div className="text-xs text-gray-500">Complete</div>
      </div>
    </div>
  );
}

// Step indicator with numbers
interface OnboardingStepIndicatorProps {
  steps: OnboardingStep[];
  currentStep?: string;
  onStepClick?: (stepKey: string) => void;
  className?: string;
}

export function OnboardingStepIndicator({
  steps,
  currentStep,
  onStepClick,
  className
}: OnboardingStepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(step, currentStep);
        const isClickable = onStepClick && (step.completed || step.key === currentStep);

        return (
          <React.Fragment key={step.key}>
            <motion.button
              onClick={() => isClickable && onStepClick(step.key)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all',
                {
                  'bg-green-500 text-white': status === 'completed',
                  'bg-amber-500 text-white': status === 'current',
                  'bg-gray-200 text-gray-600': status === 'pending',
                  'cursor-pointer hover:scale-105': isClickable,
                  'cursor-not-allowed': !isClickable,
                }
              )}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {status === 'completed' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </motion.button>

            {index < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5',
                {
                  'bg-green-500': steps[index + 1].completed,
                  'bg-amber-500': steps[index + 1].key === currentStep,
                  'bg-gray-200': !steps[index + 1].completed && steps[index + 1].key !== currentStep,
                }
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function getStepStatus(step: OnboardingStep, currentStep?: string) {
  if (step.completed) return 'completed';
  if (step.key === currentStep) return 'current';
  return 'pending';
}