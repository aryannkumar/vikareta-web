import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        outline:
          "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 shadow-sm hover:shadow-md",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
        ghost: "hover:bg-orange-50 hover:text-orange-600",
        link: "text-orange-600 underline-offset-4 hover:underline hover:text-orange-700",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    VariantProps<typeof buttonVariants>,
    Omit<HTMLMotionProps<"button">, "color"> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    const Comp = asChild ? Slot : motion.button;

    const motionProps = asChild ? {} : {
      whileHover: !isDisabled ? { scale: 1.02 } : {},
      whileTap: !isDisabled ? { scale: 0.98 } : {},
      transition: { duration: 0.2, ease: "easeOut" }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...motionProps}
        {...props}
      >
        {/* Shine effect for gradient buttons */}
        {(variant === "default" || variant === "destructive" || variant === "success" || variant === "warning") && !isDisabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        <motion.div
          className="flex items-center justify-center gap-2 relative z-10"
          animate={{ opacity: loading ? 0.7 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {!loading && icon && iconPosition === "left" && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.span>
          )}

          <motion.span
            animate={{ opacity: loading && loadingText ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {loading && loadingText ? loadingText : children}
          </motion.span>

          {!loading && icon && iconPosition === "right" && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };