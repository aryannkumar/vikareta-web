'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

const Dialog: React.FC<DialogProps> = ({ open = false, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick, asChild = false }) => {
  const context = React.useContext(DialogContext);

  const handleClick = () => {
    if (onClick) onClick();
    if (context) context.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...children.props
    });
  }

  return (
    <button onClick={handleClick} className="inline-flex">
      {children}
    </button>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ className, children }) => {
  const context = React.useContext(DialogContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!context || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      context.onOpenChange(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      context.onOpenChange(false);
    }
  };

  React.useEffect(() => {
    if (context.open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [context.open]);

  return (
    <AnimatePresence>
      {context.open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={cn(
                'relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700',
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ className, children }) => {
  return (
    <div className={cn('flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h2>
  );
};

const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, children }) => {
  return (
    <p className={cn('mt-1 text-sm text-gray-600 dark:text-gray-400', className)}>
      {children}
    </p>
  );
};

const DialogFooter: React.FC<DialogFooterProps> = ({ className, children }) => {
  return (
    <div className={cn('flex items-center justify-end space-x-2 p-6 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

const DialogClose: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = React.useContext(DialogContext);

  const handleClick = () => {
    if (context) context.onOpenChange(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn('ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200', className)}
    >
      {children}
    </button>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
