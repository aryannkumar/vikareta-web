'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Bell,
  Heart,
  Package,
  Settings,
  LogOut,
  Store,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSSOAuth } from '@/lib/auth/use-sso-auth';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { Badge } from '@/components/ui/badge';
import { notificationsApi } from '@/lib/api/notifications';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useSSOAuth();
  const { totalItems } = useCartStore();
  const { count: wishlistCount, fetchWishlist } = useWishlistStore();

  // Fetch unread notifications count and wishlist
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const response = await notificationsApi.getNotifications({ unreadOnly: true });
          setUnreadNotifications(response.data?.notifications?.length || 0);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };

    const fetchData = async () => {
      if (isAuthenticated) {
        await Promise.all([
          fetchNotifications(),
          fetchWishlist()
        ]);
      }
    };

    fetchData();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchWishlist]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cartItemCount = totalItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/img/logo.png"
              alt="Vikareta Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-gradient-orange-blue">Vikareta</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/marketplace" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Marketplace
            </Link>
            <Link href="/categories" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Categories
            </Link>
            <Link href="/products" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Products
            </Link>
            <Link href="/services" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Services
            </Link>
            <Link href="/providers" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Suppliers
            </Link>
            <Link href="/rfq" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              RFQ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {isAuthenticated && (
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Dashboard Button for Sellers */}
            {isAuthenticated && user?.role === 'seller' && (
              <Button 
                size="sm" 
                variant="outline"
                className="hidden sm:flex items-center space-x-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20"
                onClick={() => {
                  const dashboardUrl = process.env.NODE_ENV === 'development' 
                    ? 'http://localhost:3001/dashboard' 
                    : 'https://dashboard.vikareta.com/dashboard';
                  
                  const token = localStorage.getItem('auth_token');
                  if (token) {
                    const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
                    window.location.href = urlWithAuth;
                  } else {
                    window.location.href = dashboardUrl;
                  }
                }}
              >
                <Store className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <User className="h-5 w-5" />
                    {user?.name && (
                      <span className="ml-2 hidden sm:inline">
                        {user.name.split(' ')[0]}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && (
                        <p className="font-medium">{user.name}</p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/account/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="flex items-center w-full">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/wishlist" className="flex items-center w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/rfq" className="flex items-center w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      My RFQs
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'seller' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        const dashboardUrl = process.env.NODE_ENV === 'development' 
                          ? 'http://localhost:3001/dashboard' 
                          : 'https://dashboard.vikareta.com/dashboard';
                        
                        const token = localStorage.getItem('auth_token');
                        if (token) {
                          const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
                          window.location.href = urlWithAuth;
                        } else {
                          window.location.href = dashboardUrl;
                        }
                      }}>
                        <Store className="mr-2 h-4 w-4" />
                        Supplier Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/notifications" className="flex items-center w-full">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="btn-primary px-6 py-2 font-semibold rounded-lg shadow-lg hover:shadow-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" /> : 
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/marketplace" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/categories" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/providers" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Suppliers
              </Link>
              <Link 
                href="/rfq" 
                className="px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                RFQ
              </Link>
              {isAuthenticated && (
                <>
                  <div className="border-t pt-2 mt-2">
                    {user?.role === 'seller' && (
                      <button 
                        className="w-full px-2 py-2 text-sm font-medium hover:text-orange-500 transition-colors flex items-center text-left"
                        onClick={() => {
                          const dashboardUrl = process.env.NODE_ENV === 'development' 
                            ? 'http://localhost:3001/dashboard' 
                            : 'https://dashboard.vikareta.com/dashboard';
                          
                          const token = localStorage.getItem('auth_token');
                          if (token) {
                            const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
                            window.location.href = urlWithAuth;
                          } else {
                            window.location.href = dashboardUrl;
                          }
                          setIsMenuOpen(false);
                        }}
                      >
                        <Store className="mr-2 h-4 w-4" />
                        Supplier Dashboard
                      </button>
                    )}
                    <Link 
                      href="/orders" 
                      className="px-2 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="px-2 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="px-2 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}