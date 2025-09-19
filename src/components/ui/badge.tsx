'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from 'framer-motion';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 hover:shadow-md",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-md",
        outline: "text-foreground border-gray-300 hover:bg-gray-50",
        success:
          "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-md",
        warning:
          "border-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-md",
        info:
          "border-transparent bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>,
    VariantProps<typeof badgeVariants>,
    HTMLMotionProps<"div"> {
  animated?: boolean;
  pulse?: boolean;
}

function Badge({ className, variant, animated = false, pulse = false, ...props }: BadgeProps) {
  return (
    <motion.div
      className={cn(badgeVariants({ variant }), className)}
      whileHover={animated ? {
        scale: 1.05,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={animated ? {
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      animate={pulse ? {
        scale: [1, 1.05, 1],
        opacity: 1,
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {
        opacity: 1,
        scale: 1
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };