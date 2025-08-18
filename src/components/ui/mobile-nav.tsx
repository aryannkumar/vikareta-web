'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth';
import { useCartStore } from '@/lib/stores/cart';
import { 
  Menu, X, Home, Package, MapPin, Search, User, 
  ShoppingCart, Bell, Settings, LogOut, Star,
  TrendingUp, Grid, List, Filter, ChevronRight
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/categories', label: 'Categories', icon: Grid },
    { href: '/nearby', label: 'Nearby', icon: MapPin },
    { href: '/search', label: 'Search', icon: Search },
  ];

  const handleLogout = () => {
    logout();
    onToggle();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onToggle} />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-l border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gradient-primary">Menu</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* User Section */}
              {isAuthenticated && user && (
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center shadow-medium">
                      <span className="text-sm font-bold text-white">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.verificationTier && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                      {user.verificationTier.charAt(0).toUpperCase() + user.verificationTier.slice(1)}
                    </Badge>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-6 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onToggle}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50 dark:hover:from-orange-900/20 dark:hover:to-blue-900/20 transition-all duration-200 group"
                    >
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        {item.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                    </Link>
                  ))}
                </nav>

                {/* Quick Actions */}
                {isAuthenticated && (
                  <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link
                        href="/cart"
                        onClick={onToggle}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">Cart</span>
                        </div>
                        {cartItemCount > 0 && (
                          <Badge className="bg-orange-500 text-white">
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                      
                      <Link
                        href="/account/notifications"
                        onClick={onToggle}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                      >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                      </Link>
                      
                      <Link
                        href="/account"
                        onClick={onToggle}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                      >
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-green-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Account</span>
                      </Link>
                      
                      <Link
                        href="/account/settings"
                        onClick={onToggle}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                      >
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Settings</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                {isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" onClick={onToggle}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={onToggle}>
                      <Button className="w-full btn-premium">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}