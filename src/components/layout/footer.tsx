'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Award,
  Heart,
  Star
} from 'lucide-react';
import { Logo } from '../ui/logo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

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
    <footer className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        {/* Trust Indicators */}
        <motion.div 
          className="py-16 border-b border-gray-200 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-lexend">
              Why Choose <span className="text-gradient">Vikareta</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of businesses who trust us for their B2B marketplace needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Payments",
                description: "256-bit SSL Encryption",
                color: "text-green-500",
                bgColor: "bg-green-100 dark:bg-green-900/20"
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Pan India Network",
                color: "text-blue-500",
                bgColor: "bg-blue-100 dark:bg-blue-900/20"
              },
              {
                icon: CreditCard,
                title: "Easy Returns",
                description: "15 Day Return Policy",
                color: "text-purple-500",
                bgColor: "bg-purple-100 dark:bg-purple-900/20"
              },
              {
                icon: Award,
                title: "Quality Assured",
                description: "Verified Suppliers",
                color: "text-blue-500",
                bgColor: "bg-blue-100 dark:bg-blue-900/20"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div 
                  className={`w-16 h-16 mx-auto mb-4 ${item.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ y: -4 }}
                >
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Logo className="h-12 w-12" showText={false} />
              <div>
                <h2 className="text-2xl font-bold text-gradient font-lexend">Vikareta</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium B2B Marketplace</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              India's most trusted B2B marketplace connecting businesses across industries. 
              Discover premium products, verified suppliers, and scale your business with confidence.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Stay Ahead with Market Insights
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubscribing}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubscribing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get exclusive deals, market insights, and product updates. Unsubscribe anytime.
                </p>
              </form>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "https://facebook.com/vikareta", color: "hover:text-blue-600", label: "Facebook" },
                  { icon: Twitter, href: "https://twitter.com/vikareta", color: "hover:text-blue-400", label: "Twitter" },
                  { icon: Instagram, href: "https://instagram.com/vikareta", color: "hover:text-pink-600", label: "Instagram" },
                  { icon: Linkedin, href: "https://linkedin.com/company/vikareta", color: "hover:text-blue-700", label: "LinkedIn" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    whileHover={{ y: -2 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          {[
            {
              title: "Marketplace",
              links: [
                { href: "/categories", label: "Browse Categories" },
                { href: "/products", label: "All Products" },
                { href: "/services", label: "Services" },
                { href: "/businesses", label: "Find Suppliers" },
                { href: "/rfq", label: "Post RFQ" }
              ]
            },
            {
              title: "For Sellers",
              links: [
                { href: "/auth/register?type=supplier", label: "Become a Seller" },
                { href: "/dashboard", label: "Seller Dashboard" },
                { href: "/seller-guide", label: "Seller Guide" },
                { href: "/advertising", label: "Advertising" },
                { href: "/seller-support", label: "Support" }
              ]
            },
            {
              title: "Support",
              links: [
                { href: "/help", label: "Help Center" },
                { href: "/contact", label: "Contact Us" },
                { href: "/shipping", label: "Shipping Info" },
                { href: "/returns", label: "Returns & Refunds" },
                { href: "/faq", label: "FAQ" }
              ]
            }
          ].map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex}
              variants={itemVariants} 
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-lexend">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info Section */}
        <motion.div 
          className="py-12 border-t border-gray-200 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Our Office</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                123 Business District,<br />
                Mumbai, Maharashtra 400001<br />
                India
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Contact</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="tel:+919934109996" className="hover:text-blue-600 transition-colors">
                  +91-9934109996
                </a>
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-3 mb-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="mailto:support@vikareta.com" className="hover:text-blue-600 transition-colors">
                  support@vikareta.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div 
          className="py-8 border-t border-gray-200 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
            >
              <span>© {currentYear} Vikareta. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>in India. All rights reserved.</span>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.8/5 Customer Rating</span>
              </div>
              <div className="flex space-x-6">
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/legal/google-oauth" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Google OAuth Data Use
                </Link>
                <Link 
                  href="/cookies" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}