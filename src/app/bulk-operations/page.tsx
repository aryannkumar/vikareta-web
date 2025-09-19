'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Minus,
  Trash2,
  Upload,
  Download,
  ShoppingCart,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Package,
  Search,
  Filter,
  X,
  Save,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { marketplaceApi } from '@/lib/api/marketplace';
import { cartApi } from '@/lib/api/cart';
import { rfqApi } from '@/lib/api/rfq';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta/hooks/use-vikareta-auth';

interface BulkItem {
  id: string;
  productId: string;
  title: string;
  seller: string;
  price: number;
  quantity: number;
  category: string;
  specifications?: string;
  notes?: string;
}

interface Product {
  id: string;
  title?: string;
  name?: string;
  price: number;
  seller?: {
    businessName?: string;
    name?: string;
  };
  provider?: {
    name?: string;
  };
  category?: string | {
    name?: string;
  };
}

export default function BulkOperationsPage() {
  const { isAuthenticated } = useVikaretaAuthContext();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'cart' | 'rfq'>('cart');
  const [items, setItems] = useState<BulkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const tabs = [
    { id: 'cart', label: 'Bulk Add to Cart', icon: ShoppingCart },
    { id: 'rfq', label: 'Bulk RFQ Creation', icon: FileText }
  ];

  // Search products
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await marketplaceApi.searchMarketplace(query, {
        type: 'products',
        category: selectedCategory
      });

      if (response.success) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error', 'Failed to search products');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory]);

  const addProductToBulk = (product: Product) => {
    const productTitle = product.title || product.name || 'Product';
    const sellerName = product.seller?.businessName || product.seller?.name || product.provider?.name || 'Seller';
    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name || 'General';

    const newItem: BulkItem = {
      id: Date.now().toString(),
      productId: product.id,
      title: productTitle,
      seller: sellerName,
      price: product.price,
      quantity: 1,
      category: categoryName,
      notes: ''
    };

    setItems([...items, newItem]);
    setShowProductSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    toast.success('Added', `${productTitle} added to bulk list`);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Removed', 'Item removed from bulk list');
  };

  const clearAllItems = () => {
    setItems([]);
    toast.success('Cleared', 'All items removed');
  };

  const addAllToCart = async () => {
    if (items.length === 0) {
      toast.error('No items', 'Add some items first');
      return;
    }

    try {
      setLoading(true);
      const cartPromises = items.map(item =>
        cartApi.addItem({
          productId: item.productId,
          quantity: item.quantity
        })
      );

      await Promise.all(cartPromises);
      setItems([]);
      toast.success('Success', `Added ${items.length} items to cart`);
    } catch (error) {
      console.error('Bulk add to cart error:', error);
      toast.error('Error', 'Failed to add items to cart');
    } finally {
      setLoading(false);
    }
  };

  const createBulkRFQ = async () => {
    if (items.length === 0) {
      toast.error('No items', 'Add some items first');
      return;
    }

    try {
      setLoading(true);

      // Create individual RFQs for each item
      const rfqPromises = items.map(async (item) => {
        const rfqData = {
          title: `RFQ: ${item.title}`,
          description: `Bulk purchase inquiry for ${item.quantity} units of ${item.title}. ${item.notes || ''}`,
          categoryId: item.category, // This might need to be mapped to actual category ID
          quantity: item.quantity,
          unit: 'pieces', // Default unit
          deliveryLocation: 'To be specified',
          deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          specifications: {
            productId: item.productId,
            requirements: item.notes || 'Standard specifications',
            specifications: item.specifications
          },
          visibility: 'public' as const,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        };

        return rfqApi.createRFQ(rfqData);
      });

      const results = await Promise.all(rfqPromises);
      const successCount = results.filter(result => result.success).length;

      if (successCount > 0) {
        setItems([]);
        toast.success('Success', `Created ${successCount} RFQ${successCount > 1 ? 's' : ''}`);
      } else {
        toast.error('Error', 'Failed to create RFQs');
      }
    } catch (error) {
      console.error('Bulk RFQ creation error:', error);
      toast.error('Error', 'Failed to create RFQs');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (items.length === 0) {
      toast.error('No items', 'Add some items to export');
      return;
    }

    const csvContent = [
      ['Product', 'Seller', 'Category', 'Quantity', 'Price', 'Total', 'Notes'].join(','),
      ...items.map(item => [
        `"${item.title}"`,
        `"${item.seller}"`,
        `"${item.category}"`,
        item.quantity,
        item.price,
        item.price * item.quantity,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-items.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Exported', 'Items exported to CSV');
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          toast.error('Invalid CSV', 'CSV must have at least a header row and one data row');
          return;
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const expectedHeaders = ['Product', 'Seller', 'Category', 'Quantity', 'Price', 'Notes'];

        // Basic validation - check if first few headers match
        const isValidFormat = expectedHeaders.every(header =>
          headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
        );

        if (!isValidFormat) {
          toast.error('Invalid Format', 'CSV should have columns: Product, Seller, Category, Quantity, Price, Notes');
          return;
        }

        const importedItems: BulkItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          if (values.length >= 5) {
            importedItems.push({
              id: Date.now().toString() + i,
              productId: '', // Will need to be resolved
              title: values[0],
              seller: values[1],
              category: values[2],
              quantity: parseInt(values[3]) || 1,
              price: parseFloat(values[4]) || 0,
              notes: values[5] || ''
            });
          }
        }

        setItems([...items, ...importedItems]);
        toast.success('Imported', `Imported ${importedItems.length} items from CSV`);
      } catch (error) {
        console.error('CSV import error:', error);
        toast.error('Import Error', 'Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Operations</h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to access bulk operations for B2B purchasing
          </p>
          <Link href="/auth/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
              <p className="text-gray-600 mt-1">
                Efficient B2B purchasing with bulk operations
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={exportToCSV} disabled={items.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importFromCSV}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'cart' | 'rfq')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Add Products Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add Products</h2>
                <Button
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {showProductSearch && (
                <div className="mb-4 p-4 border rounded-lg">
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="electronics">Electronics</option>
                      <option value="machinery">Machinery</option>
                      <option value="supplies">Office Supplies</option>
                    </select>
                  </div>

                  {searchLoading ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium">{product.title || product.name}</h3>
                            <p className="text-sm text-gray-600">
                              {product.seller?.businessName || product.seller?.name || product.provider?.name || 'Seller'} • {formatPrice(product.price)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addProductToBulk(product)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <p className="text-center py-4 text-gray-500">No products found</p>
                  ) : null}
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Items ({items.length})
                  </h2>
                  {items.length > 0 && (
                    <Button variant="outline" onClick={clearAllItems}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {items.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items added</h3>
                  <p className="text-gray-600 mb-4">
                    Add products to perform bulk operations
                  </p>
                  <Button onClick={() => setShowProductSearch(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.seller} • {item.category}
                          </p>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="mx-3 font-medium">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="text-sm">
                              <span className="text-gray-600">Price: </span>
                              <span className="font-medium">{formatPrice(item.price)}</span>
                            </div>

                            <div className="text-sm">
                              <span className="text-gray-600">Total: </span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes/Specifications
                            </label>
                            <textarea
                              value={item.notes}
                              onChange={(e) => updateItemNotes(item.id, e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Add any specific requirements or notes..."
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Unique Products</span>
                  <span className="font-medium">{items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Value</span>
                  <span className="font-medium">{formatPrice(totalValue)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Average Price</span>
                  <span className="font-medium">
                    {items.length > 0 ? formatPrice(totalValue / items.length) : formatPrice(0)}
                  </span>
                </div>
              </div>

              {items.length > 0 && (
                <div className="mt-6 space-y-3">
                  {activeTab === 'cart' ? (
                    <Button
                      onClick={addAllToCart}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add All to Cart
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={createBulkRFQ}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating RFQs...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Create Bulk RFQ
                        </>
                      )}
                    </Button>
                  )}

                  <div className="text-xs text-gray-600 text-center">
                    {activeTab === 'cart'
                      ? 'All items will be added to your shopping cart'
                      : 'RFQs will be created grouped by category'
                    }
                  </div>
                </div>
              )}

              {/* Bulk Operations Tips */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Bulk Operations Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Add multiple products at once</li>
                  <li>• Set quantities for each item</li>
                  <li>• Add specifications and notes</li>
                  <li>• Export/import via CSV</li>
                  <li>• Create bulk RFQs by category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}