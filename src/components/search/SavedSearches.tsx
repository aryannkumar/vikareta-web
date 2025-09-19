'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Search,
  Filter,
  Clock,
  Star,
  X,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast-provider';

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    type?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    rating?: number;
    verified?: boolean;
    sortBy?: string;
  };
  createdAt: string;
  lastUsed?: string;
  useCount: number;
  isFavorite: boolean;
  notificationsEnabled: boolean;
}

interface SavedSearchesProps {
  currentQuery: string;
  currentFilters: any;
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onToggleFavorite: (searchId: string) => void;
  onToggleNotifications: (searchId: string) => void;
}

export default function SavedSearches({
  currentQuery,
  currentFilters,
  onLoadSearch,
  onDeleteSearch,
  onToggleFavorite,
  onToggleNotifications
}: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const toast = useToast();

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      // This would typically come from an API call
      // For now, we'll use localStorage as a fallback
      const saved = localStorage.getItem('vikareta_saved_searches');
      if (saved) {
        setSavedSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!newSearchName.trim()) {
      toast.error('Error', 'Please enter a name for your search');
      return;
    }

    try {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName.trim(),
        query: currentQuery,
        filters: currentFilters,
        createdAt: new Date().toISOString(),
        useCount: 0,
        isFavorite: false,
        notificationsEnabled: false
      };

      const updatedSearches = [...savedSearches, newSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem('vikareta_saved_searches', JSON.stringify(updatedSearches));

      setShowSaveDialog(false);
      setNewSearchName('');
      toast.success('Success', 'Search saved successfully!');
    } catch (error) {
      toast.error('Error', 'Failed to save search');
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const updatedSearches = savedSearches.filter(s => s.id !== searchId);
      setSavedSearches(updatedSearches);
      localStorage.setItem('vikareta_saved_searches', JSON.stringify(updatedSearches));
      onDeleteSearch(searchId);
      toast.success('Success', 'Search deleted successfully!');
    } catch (error) {
      toast.error('Error', 'Failed to delete search');
    }
  };

  const toggleFavorite = async (searchId: string) => {
    try {
      const updatedSearches = savedSearches.map(search =>
        search.id === searchId
          ? { ...search, isFavorite: !search.isFavorite }
          : search
      );
      setSavedSearches(updatedSearches);
      localStorage.setItem('vikareta_saved_searches', JSON.stringify(updatedSearches));
      onToggleFavorite(searchId);
    } catch (error) {
      toast.error('Error', 'Failed to update favorite status');
    }
  };

  const toggleNotifications = async (searchId: string) => {
    try {
      const updatedSearches = savedSearches.map(search =>
        search.id === searchId
          ? { ...search, notificationsEnabled: !search.notificationsEnabled }
          : search
      );
      setSavedSearches(updatedSearches);
      localStorage.setItem('vikareta_saved_searches', JSON.stringify(updatedSearches));
      onToggleNotifications(searchId);
    } catch (error) {
      toast.error('Error', 'Failed to update notification settings');
    }
  };

  const loadSearch = (search: SavedSearch) => {
    // Update use count and last used
    const updatedSearches = savedSearches.map(s =>
      s.id === search.id
        ? { ...s, useCount: s.useCount + 1, lastUsed: new Date().toISOString() }
        : s
    );
    setSavedSearches(updatedSearches);
    localStorage.setItem('vikareta_saved_searches', JSON.stringify(updatedSearches));

    onLoadSearch(search);
  };

  const filteredSearches = savedSearches.filter(search => {
    switch (filter) {
      case 'favorites':
        return search.isFavorite;
      case 'recent':
        return search.lastUsed && new Date(search.lastUsed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const getFilterSummary = (search: SavedSearch) => {
    const parts = [];
    if (search.filters.type) parts.push(search.filters.type);
    if (search.filters.category) parts.push(search.filters.category);
    if (search.filters.minPrice || search.filters.maxPrice) {
      parts.push(`₹${search.filters.minPrice || 0} - ₹${search.filters.maxPrice || '∞'}`);
    }
    if (search.filters.location) parts.push(search.filters.location);
    return parts.join(', ');
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bookmark className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Saved Searches</h3>
            <Badge variant="secondary">{savedSearches.length}</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              disabled={!currentQuery.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Current Search
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', icon: Search },
            { key: 'favorites', label: 'Favorites', icon: Star },
            { key: 'recent', label: 'Recent', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(key as any)}
              className="flex-1"
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Saved Searches List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredSearches.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No saved searches</h4>
              <p className="text-muted-foreground mb-4">
                {filter === 'favorites' ? 'No favorite searches yet' :
                 filter === 'recent' ? 'No recent searches' :
                 'Save your search queries to access them quickly later'}
              </p>
              {filter === 'all' && (
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!currentQuery.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Your First Search
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredSearches.map((search) => (
                <motion.div
                  key={search.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-sm truncate">{search.name}</h4>
                          {search.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {search.notificationsEnabled && (
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          "{search.query}"
                        </p>

                        {getFilterSummary(search) && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {getFilterSummary(search)}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Used {search.useCount} times</span>
                          {search.lastUsed && (
                            <span>Last used {new Date(search.lastUsed).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(search.id)}
                          className="h-8 w-8 p-0"
                        >
                          {search.isFavorite ? (
                            <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadSearch(search)}
                          className="h-8 w-8 p-0"
                        >
                          <Search className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSearch(search.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Save Search</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Name</label>
                <Input
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  placeholder="e.g., Electronics in Mumbai"
                  onKeyPress={(e) => e.key === 'Enter' && saveSearch()}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Current search: "{currentQuery}"</p>
                {getFilterSummary({ filters: currentFilters } as any) && (
                  <p>Filters: {getFilterSummary({ filters: currentFilters } as any)}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveSearch} disabled={!newSearchName.trim()}>
                Save Search
              </Button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </>
  );
}