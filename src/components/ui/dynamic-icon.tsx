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
    category: any; // accepts API Category shape (id, iconName, name)
    size?: number;
    className?: string;
    iconClassName?: string;
}

const CATEGORY_STYLE_MAP: Record<string, { bgClass: string; iconClass: string }> = {
    electronics: { bgClass: 'from-blue-300 to-indigo-400', iconClass: 'text-indigo-600' },
    textiles: { bgClass: 'from-pink-300 to-purple-400', iconClass: 'text-pink-600' },
    machinery: { bgClass: 'from-amber-200 to-amber-500', iconClass: 'text-amber-600' },
    automotive: { bgClass: 'from-rose-300 to-red-500', iconClass: 'text-red-600' },
    construction: { bgClass: 'from-yellow-300 to-orange-400', iconClass: 'text-yellow-600' },
    chemicals: { bgClass: 'from-emerald-300 to-cyan-400', iconClass: 'text-emerald-600' },
    'food-agriculture': { bgClass: 'from-lime-300 to-green-500', iconClass: 'text-green-700' },
    packaging: { bgClass: 'from-violet-300 to-pink-400', iconClass: 'text-purple-600' },
};

export const IconBackground: React.FC<IconBackgroundProps> = ({
    category,
    size = 64,
    className = "w-full h-56 flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50",
    iconClassName = "text-blue-600"
}) => {
    const id = (category && (category.id || (category.name || '').toLowerCase().replace(/\s+/g, '-'))) || '';
    const palette = CATEGORY_STYLE_MAP[id] || { bgClass: 'from-blue-50 to-orange-50', iconClass: 'text-blue-600' };

    // Merge background gradient classes while keeping any custom className provided
    // Ensure we include bg-gradient-to-br and the palette stops
    const finalBgClass = `${className} bg-gradient-to-br ${palette.bgClass} gradient-shift`;
    const finalIconClass = `${palette.iconClass} ${iconClassName} icon-pulse`;

    return (
        <div className={finalBgClass}>
            <CategoryIcon
                category={category}
                size={size}
                className={finalIconClass}
            />
        </div>
    );
};

export default DynamicIcon;