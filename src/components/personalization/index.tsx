/**
 * Vikareta Platform - Personalization Components
 * UI components for displaying personalized content
 * Shows recently viewed products, recommendations, and preferences
 */

'use client';

import { useEffect, useState } from 'react';
import { usePersonalization } from '../../lib/auth/vikareta/hooks/use-personalization';
import { useVikaretaAuth } from '../../lib/auth/vikareta/hooks/use-vikareta-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion } from 'framer-motion';

interface RecentlyViewedProps {
  maxItems?: number;
  onProductClick?: (productId: string) => void;
}

export function RecentlyViewed({ maxItems = 5, onProductClick }: RecentlyViewedProps) {
  const { personalization, addToRecentlyViewed } = usePersonalization();

  // This would typically be called when viewing a product
  const handleProductView = (productId: string) => {
    addToRecentlyViewed(productId);
    onProductClick?.(productId);
  };

  if (!personalization?.browsingHistory.recentlyViewed.length) {
    return null;
  }

  const recentlyViewed = personalization.browsingHistory.recentlyViewed.slice(0, maxItems);

  return (
    <Card hover className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recently Viewed
          <Badge variant="secondary" animated>
            {recentlyViewed.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {recentlyViewed.map((productId, index) => (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                hover
                interactive
                className="cursor-pointer h-full"
                onClick={() => handleProductView(productId)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl mb-3 flex items-center justify-center shadow-inner">
                    <span className="text-orange-600 font-medium text-sm">
                      Product {productId.slice(-4)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold truncate text-gray-900 mb-2">
                    Product {productId.slice(-4)}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductView(productId);
                    }}
                  >
                    View Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductRecommendationsProps {
  maxItems?: number;
  onProductClick?: (productId: string) => void;
}

export function ProductRecommendations({ maxItems = 6, onProductClick }: ProductRecommendationsProps) {
  const { getRecommendations } = usePersonalization();
  const [recommendations, setRecommendations] = useState<{
    recentlyViewed: string[];
    recommendedProducts: string[];
    trendingCategories: string[];
    suggestedSearches: string[];
  } | null>(null);

  useEffect(() => {
    getRecommendations().then(setRecommendations);
  }, [getRecommendations]);

  if (!recommendations?.recommendedProducts.length) {
    return null;
  }

  const recommendedProducts = recommendations.recommendedProducts.slice(0, maxItems);

  return (
    <Card hover className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recommended for You
          <Badge variant="success" animated>
            {recommendedProducts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommendedProducts.map((productId, index) => (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                hover
                interactive
                className="cursor-pointer h-full"
                onClick={() => onProductClick?.(productId)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-3 flex items-center justify-center shadow-inner">
                    <span className="text-blue-600 font-medium text-sm">
                      Product {productId.slice(-4)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold truncate text-gray-900 mb-2">
                    Product {productId.slice(-4)}
                  </h4>
                  <Badge variant="info" className="text-xs mb-2">
                    Recommended
                  </Badge>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick?.(productId);
                    }}
                  >
                    View Product
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SearchSuggestionsProps {
  onSearchSelect?: (searchTerm: string) => void;
}

export function SearchSuggestions({ onSearchSelect }: SearchSuggestionsProps) {
  const { personalization } = usePersonalization();

  if (!personalization?.browsingHistory.searchHistory.length) {
    return null;
  }

  const searchHistory = personalization.browsingHistory.searchHistory.slice(0, 5);

  return (
    <Card hover className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Searches
          <Badge variant="secondary" animated>
            {searchHistory.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {searchHistory.map((term, index) => (
            <motion.div
              key={`${term}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-orange-50 hover:text-orange-700"
                onClick={() => onSearchSelect?.(term)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                  <span className="truncate">{term}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CartProps {
  onProductClick?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

export function Cart({ onProductClick, onUpdateQuantity, onRemoveItem }: CartProps) {
  const { getCartItems, updateCartQuantity, removeFromCart } = usePersonalization();
  const [cartItems, setCartItems] = useState(getCartItems());

  useEffect(() => {
    setCartItems(getCartItems());
  }, [getCartItems]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    const success = await updateCartQuantity(productId, quantity);
    if (success) {
      setCartItems(getCartItems());
      onUpdateQuantity?.(productId, quantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const success = await removeFromCart(productId);
    if (success) {
      setCartItems(getCartItems());
      onRemoveItem?.(productId);
    }
  };

  if (!cartItems.length) {
    return (
      <Card hover className="w-full">
        <CardContent className="py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to get started!</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card hover className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Your Cart
            <Badge variant="default" animated>
              {totalItems} items
            </Badge>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card hover className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl cursor-pointer flex items-center justify-center shadow-inner"
                      onClick={() => onProductClick?.(item.productId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-orange-600 font-medium text-xs">
                        Product {item.productId.slice(-4)}
                      </span>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold cursor-pointer hover:text-orange-600 truncate"
                        onClick={() => onProductClick?.(item.productId)}
                      >
                        Product {item.productId.slice(-4)}
                      </h4>
                      {item.variant && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center bg-gray-50">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UserSettingsProps {
  onSettingsChange?: () => void;
}

export function UserSettings({ onSettingsChange }: UserSettingsProps) {
  const { getPreferences, updatePreferences } = usePersonalization();
  const [preferences, setPreferences] = useState(getPreferences());

  useEffect(() => {
    setPreferences(getPreferences());
  }, [getPreferences]);

  const handlePreferenceChange = async (key: keyof NonNullable<typeof preferences>, value: any) => {
    if (!preferences) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const success = await updatePreferences({ [key]: value });
    if (success) {
      onSettingsChange?.();
    } else {
      // Revert on failure
      setPreferences(preferences);
    }
  };

  if (!preferences) {
    return null;
  }

  return (
    <Card hover className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          User Settings
          <Badge variant="info" animated>
            Preferences
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-gray-900">Language</label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-gray-900">Currency</label>
            <Select
              value={preferences.currency}
              onValueChange={(value) => handlePreferenceChange('currency', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-gray-900">Theme</label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="space-y-3"
          >
            <label className="text-sm font-semibold text-gray-900">Notifications</label>
            <div className="space-y-3">
              {Object.entries(preferences.notifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm capitalize text-gray-700">{key} notifications</span>
                  <Button
                    variant={value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange('notifications', {
                      ...preferences.notifications,
                      [key]: !value
                    })}
                  >
                    {value ? 'On' : 'Off'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}