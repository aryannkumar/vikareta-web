'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Clock,
  Trash2,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultCount?: number;
}

interface SearchHistoryProps {
  onLoadSearch: (query: string) => void;
  onClearHistory: () => void;
  maxItems?: number;
}

export default function SearchHistory({
  onLoadSearch,
  onClearHistory,
  maxItems = 10
}: SearchHistoryProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('vikareta_search_history');
      if (saved) {
        const history = JSON.parse(saved);
        // Sort by timestamp (most recent first) and limit to maxItems
        const sortedHistory = history
          .sort((a: SearchHistoryItem, b: SearchHistoryItem) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, maxItems);
        setSearchHistory(sortedHistory);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (query: string, resultCount?: number) => {
    if (!query.trim()) return;

    try {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date().toISOString(),
        resultCount
      };

      const existing = localStorage.getItem('vikareta_search_history');
      let history: SearchHistoryItem[] = [];

      if (existing) {
        history = JSON.parse(existing);
        // Remove duplicate queries (keep most recent)
        history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      }

      // Add new item at the beginning
      history.unshift(newItem);

      // Keep only the most recent items
      const limitedHistory = history.slice(0, maxItems);

      localStorage.setItem('vikareta_search_history', JSON.stringify(limitedHistory));
      setSearchHistory(limitedHistory);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const removeFromHistory = (id: string) => {
    try {
      const updatedHistory = searchHistory.filter(item => item.id !== id);
      setSearchHistory(updatedHistory);
      localStorage.setItem('vikareta_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to remove from search history:', error);
    }
  };

  const clearAllHistory = () => {
    try {
      setSearchHistory([]);
      localStorage.removeItem('vikareta_search_history');
      onClearHistory();
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - searchTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return searchTime.toLocaleDateString();
  };

  const handleSearchClick = (query: string) => {
    onLoadSearch(query);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Searches</h3>
          <Badge variant="secondary">{searchHistory.length}</Badge>
        </div>

        {searchHistory.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllHistory}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search History List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-4 bg-muted rounded w-4"></div>
                <div className="h-4 bg-muted rounded flex-1"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : searchHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No recent searches</h4>
            <p className="text-muted-foreground text-sm">
              Your recent searches will appear here
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {searchHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <button
                    onClick={() => handleSearchClick(item.query)}
                    className="flex-1 text-left hover:text-primary transition-colors"
                  >
                    <p className="font-medium text-sm truncate">{item.query}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.timestamp)}
                      </p>
                      {item.resultCount !== undefined && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            {item.resultCount} results
                          </p>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromHistory(item.id)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// Export utility functions for external use
export const searchHistoryUtils = {
  addToHistory: (query: string, resultCount?: number) => {
    if (!query.trim()) return;

    try {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date().toISOString(),
        resultCount
      };

      const existing = localStorage.getItem('vikareta_search_history');
      let history: SearchHistoryItem[] = [];

      if (existing) {
        history = JSON.parse(existing);
        // Remove duplicate queries (keep most recent)
        history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      }

      // Add new item at the beginning
      history.unshift(newItem);

      // Keep only the most recent 10 items
      const limitedHistory = history.slice(0, 10);

      localStorage.setItem('vikareta_search_history', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  },

  getHistory: (): SearchHistoryItem[] => {
    try {
      const saved = localStorage.getItem('vikareta_search_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
    return [];
  },

  clearHistory: () => {
    try {
      localStorage.removeItem('vikareta_search_history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }
};