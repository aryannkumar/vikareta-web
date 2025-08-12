'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  iconName?: string;
  fallback?: keyof typeof LucideIcons;
}

/**
 * Dynamic Icon Component using Option 1: Dynamic Import with Icon Map
 * 
 * This component dynamically renders Lucide React icons based on the iconName prop.
 * It provides a fallback icon if the specified icon doesn't exist.
 * 
 * Usage:
 * <DynamicIcon iconName="Zap" className="w-6 h-6" />
 * <DynamicIcon iconName={category.iconName} size={24} />
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  iconName, 
  fallback = 'Package',
  className = "w-6 h-6",
  ...props 
}) => {
  // Get the icon component dynamically from Lucide Icons
  const getIconComponent = (name?: string) => {
    if (!name) return LucideIcons[fallback];
    
    // Check if the icon exists in LucideIcons
    const IconComponent = (LucideIcons as any)[name];
    
    // Return the icon component or fallback
    return IconComponent || LucideIcons[fallback];
  };

  const IconComponent = getIconComponent(iconName);

  return <IconComponent className={className} {...props} />;
};

/**
 * Category Icon Component - Specialized for category display
 * 
 * This component is specifically designed for displaying category icons
 * with consistent styling and fallback behavior.
 */
interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  category: {
    iconName?: string;
    name: string;
  };
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24,
  className = "",
  ...props 
}) => {
  return (
    <DynamicIcon
      iconName={category.iconName}
      size={size}
      className={`text-current ${className}`}
      fallback="Package"
      {...props}
    />
  );
};

/**
 * Icon Background Component - For category cards with icon backgrounds
 */
interface IconBackgroundProps {
  category: {
    iconName?: string;
    name: string;
  };
  size?: number;
  className?: string;
  iconClassName?: string;
}

export const IconBackground: React.FC<IconBackgroundProps> = ({
  category,
  size = 64,
  className = "w-full h-56 flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-700",
  iconClassName = "text-blue-600 dark:text-blue-400"
}) => {
  return (
    <div className={className}>
      <CategoryIcon
        category={category}
        size={size}
        className={iconClassName}
      />
    </div>
  );
};

export default DynamicIcon;