import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
}