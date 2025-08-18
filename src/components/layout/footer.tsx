'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { useTheme } from '@/components/providers/theme-provider';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      // TODO: Implement newsletter subscription API
      console.log('Newsletter subscription:', email);
      setEmail('');
      // Show success message
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4">
        {/* Trust Indicators */}
        <div className="py-8 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Secure Payments</span>
              <span className="text-xs text-muted-foreground">SSL Encrypted</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium">Fast Delivery</span>
              <span className="text-xs text-muted-foreground">Pan India</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium">Easy Returns</span>
              <span className="text-xs text-muted-foreground">7 Day Policy</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Award className="h-8 w-8 text-orange-600" />
              <span className="text-sm font-medium">Quality Assured</span>
              <span className="text-xs text-muted-foreground">Verified Suppliers</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-8 rounded-lg logo-hover" />
              <span className="text-xl font-bold text-gradient">Vikareta</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              India's leading B2B marketplace connecting buyers and sellers across industries. 
              Discover quality products, reliable suppliers, and grow your business with us.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Stay Updated with Latest Deals</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  required
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="btn-primary"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://facebook.com/vikareta" 
                target="_blank"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/vikareta" 
                target="_blank"
                className="text-muted-foreground hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://instagram.com/vikareta" 
                target="_blank"
                className="text-muted-foreground hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="https://linkedin.com/company/vikareta" 
                target="_blank"
                className="text-muted-foreground hover:text-blue-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find Suppliers
                </Link>
              </li>
              <li>
                <Link href="/rfq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Post RFQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register?type=supplier" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/seller-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link href="/seller-support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seller Support
                </Link>
              </li>
              <li>
                <Link href="/advertising" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Advertising
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Business District,<br />Mumbai, Maharashtra 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  support@vikareta.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Vikareta. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}