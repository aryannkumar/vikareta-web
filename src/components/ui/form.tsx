'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
    ghost: 'text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...(props as any)}
    >
      {loading && (
        <motion.div
          className="mr-2"
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </motion.div>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <motion.span
          className="mr-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {loading && loadingText ? loadingText : children}
      </motion.span>

      {!loading && icon && iconPosition === 'right' && (
        <motion.span
          className="ml-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

// Form components with loading states
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        <motion.input
          className={cn(
            'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200',
            'hover:border-orange-400',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            isDisabled && 'bg-gray-50 cursor-not-allowed',
            icon && 'pl-12',
            className
          )}
          disabled={isDisabled}
          whileFocus={{ scale: 1.01 }}
          {...(props as any)}
        />

        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          </motion.div>
        )}
      </div>

      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  loading?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        <motion.textarea
          className={cn(
            'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none',
            'hover:border-orange-400',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            isDisabled && 'bg-gray-50 cursor-not-allowed',
            className
          )}
          disabled={isDisabled}
          whileFocus={{ scale: 1.01 }}
          {...(props as any)}
        />

        {loading && (
          <motion.div
            className="absolute right-3 top-3"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          </motion.div>
        )}
      </div>

      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
