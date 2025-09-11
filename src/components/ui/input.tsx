'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from 'framer-motion';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof HTMLMotionProps<"input">>, HTMLMotionProps<"input"> {
  error?: string;
  label?: string;
  helperText?: string;
  animated?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, animated = true, ...props }, ref) => {
    const id = React.useId();
    const inputId = props.id || id;
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <motion.label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
              isFocused && "text-blue-600 dark:text-blue-400"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </motion.label>
        )}
        <motion.input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-medium focus:shadow-medium",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={inputId}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          whileFocus={animated ? {
            scale: 1.01,
            transition: { duration: 0.2 }
          } : {}}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          {...props}
        />
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {error && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export { Input };