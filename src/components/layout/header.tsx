'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  Star,
  Globe,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSSOAuth } from '@/lib/auth/use-sso-auth';
import { syncSSOToSubdomains, hasDashboardAccess } from '@/lib/utils/cross-domain-auth';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { Badge } from '@/components/ui/badge';
import { notificationsApi } from '@/lib/api/notifications';

// Animation variants for premium header experience
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll effect for premium header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30'
      }`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium announcement bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>🎉 Special Launch Offer: Get 20% off on first order! Use code: WELCOME20</span>
          <Star className="w-4 h-4" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Premium Logo Section */}
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 5 }} 
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="relative"
              >
                <Logo className="h-12 w-12" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <div className="flex flex-col">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.15 }}
                  className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-lexend"
                >
                  Vikareta
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.25 }}
                  className="text-xs text-gray-600 dark:text-gray-400 font-medium"
                >
                  Premium B2B Marketplace
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Premium Search Bar - Desktop */}
          <motion.div variants={itemVariants} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <input
                type="text"
                placeholder="Search products, suppliers, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/25 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500 shadow-sm hover:shadow-md relative z-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded border text-gray-500 dark:text-gray-400">⌘K</kbd>
              </div>
            </form>
          </motion.div>

          {/* Premium Navigation - Desktop */}
          <motion.nav variants={itemVariants} className="hidden lg:flex items-center space-x-1">
            {[
              { href: '/marketplace', label: 'Marketplace', icon: Globe },
              { href: '/categories', label: 'Categories', icon: Package },
              { href: '/products', label: 'Products', icon: Star },
              { href: '/services', label: 'Services', icon: TrendingUp },
              { href: '/businesses', label: 'Businesses', icon: Store },
              { href: '/rfqs', label: 'RFQs', icon: FileText }
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link 
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 rounded-xl transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Premium Actions Section */}
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            {/* Notifications */}
            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="relative p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                      </span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/wishlist">
                  <Button variant="ghost" size="sm" className="relative p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>

            {/* Dashboard Button for Sellers/Admin */}
            {isAuthenticated && ((user && hasDashboardAccess(user)) || (user?.role === 'admin' && process.env.NEXT_PUBLIC_ADMIN_STANDALONE !== 'true')) && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hidden sm:flex items-center space-x-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20"
                  onClick={async () => {
                    try {
                      try { localStorage.setItem('auth_return_url', window.location.href); } catch {}
                      const targets = [process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'];
                      await syncSSOToSubdomains(targets);
                      const dashboardUrl = process.env.NODE_ENV === 'development' 
                        ? 'http://localhost:3001' 
                        : `https://${process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'}`;
                      window.location.href = dashboardUrl;
                    } catch (err) {
                      console.error('Failed to open dashboard via SSO:', err);
                      const fallback = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : `https://${process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'}`;
                      window.location.href = fallback;
                    }
                  }}
                >
                  <Store className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </motion.div>
            )}

            {/* Premium Auth Section */}
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative flex items-center space-x-2 p-3">
                      <User className="h-5 w-5" />
                      {user?.name && (
                        <span className="hidden sm:inline font-medium">
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
                    { ((user && hasDashboardAccess(user)) || (user?.role === 'admin' && process.env.NEXT_PUBLIC_ADMIN_STANDALONE !== 'true')) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {
                          try {
                            try { localStorage.setItem('auth_return_url', window.location.href); } catch {}
                            const targets = [process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'];
                            await syncSSOToSubdomains(targets);
                            const dashboardUrl = process.env.NODE_ENV === 'development' 
                              ? 'http://localhost:3001' 
                              : `https://${process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'}`;
                            window.location.href = dashboardUrl;
                          } catch (err) {
                            console.error('Failed to open dashboard via SSO:', err);
                            const fallback = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : `https://${process.env.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com'}`;
                            window.location.href = fallback;
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
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold">
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/register">
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl">
                      Sign Up Free
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Premium Mobile Menu Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-3"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-6 bg-white dark:bg-gray-900 overflow-hidden"
            >
              {/* Mobile Search */}
              <motion.form 
                onSubmit={handleSearch} 
                className="relative mb-6"
                variants={itemVariants}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/25 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                />
              </motion.form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {[
                  { href: '/marketplace', label: 'Marketplace', icon: Globe, color: 'orange' },
                  { href: '/categories', label: 'Categories', icon: Package, color: 'blue' },
                  { href: '/products', label: 'Products', icon: Star, color: 'purple' },
                  { href: '/services', label: 'Services', icon: TrendingUp, color: 'green' },
                  { href: '/businesses', label: 'Businesses', icon: Store, color: 'indigo' },
                  { href: '/rfqs', label: 'RFQs', icon: FileText, color: 'orange' }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Link 
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              {!isAuthenticated ? (
                <motion.div variants={itemVariants} className="mt-6 space-y-3">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center py-4 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20">
                      Login to Your Account
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-center py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl">
                      Create Free Account
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link 
                    href="/orders" 
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </Link>
                  <Link 
                    href="/notifications" 
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    {unreadNotifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log out</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}