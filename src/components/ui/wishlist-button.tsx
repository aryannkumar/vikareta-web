'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  itemId: string;
  type: 'product' | 'service';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export function WishlistButton({
  itemId,
  type,
  className,
  size = 'md',
  variant = 'outline',
  showText = false,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  const { isAuthenticated } = useVikaretaAuthContext();
  const { 
    addToWishlist, 
    removeItemFromWishlist, 
    checkWishlist,
    isInWishlist: checkLocalWishlist 
  } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Check local state first for immediate feedback
      const inLocal = checkLocalWishlist(type, itemId);
      setIsInWishlist(inLocal);
      
      // Then verify with server
      checkWishlist(type, itemId).then(setIsInWishlist);
    }
  }, [itemId, type, isAuthenticated, checkWishlist, checkLocalWishlist]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Sign In Required', 'Please sign in to add items to your wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const success = await removeItemFromWishlist(type, itemId);
        if (success) {
          setIsInWishlist(false);
          toast.success('Removed', 'Item removed from wishlist');
        } else {
          toast.error('Error', 'Failed to remove from wishlist');
        }
      } else {
        const success = await addToWishlist(itemId, type);
        if (success) {
          setIsInWishlist(true);
          toast.success('Added', 'Item added to wishlist');
        } else {
          toast.error('Error', 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <Button
      variant={variant}
      size={buttonSize}
      onClick={handleToggleWishlist}
      disabled={loading}
      className={cn(
        'transition-colors duration-200',
        isInWishlist && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart 
        className={cn(
          'h-4 w-4',
          size === 'sm' && 'h-3 w-3',
          size === 'lg' && 'h-5 w-5',
          isInWishlist && 'fill-current',
          showText && 'mr-2'
        )} 
      />
      {showText && (
        <span>
          {loading ? 'Loading...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}