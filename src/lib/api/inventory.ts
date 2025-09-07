import { apiClient } from './client';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  location?: string;
  warehouseId?: string;
  lastUpdated: string;
  product: {
    id: string;
    name: string;
    image?: string;
    category: string;
    price: number;
  };
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  capacity: number;
  usedCapacity: number;
  isActive: boolean;
  manager?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string; // Order ID, Purchase ID, etc.
  warehouseId?: string;
  performedBy: string;
  performedByName: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryAdjustment {
  productId: string;
  adjustment: number;
  reason: string;
  notes?: string;
  reference?: string;
}

export interface CreateWarehouseData {
  name: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  capacity: number;
  manager?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface InventoryFilters {
  productId?: string;
  warehouseId?: string;
  category?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  search?: string;
  sortBy?: 'quantity' | 'productName' | 'lastUpdated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InventoryMovementFilters {
  productId?: string;
  type?: 'in' | 'out' | 'adjustment' | 'transfer';
  warehouseId?: string;
  dateFrom?: string;
  dateTo?: string;
  performedBy?: string;
  sortBy?: 'createdAt' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class InventoryService {
  // Get inventory list
  static async getInventory(filters?: InventoryFilters): Promise<{
    items: InventoryItem[];
    total: number;
    page: number;
    totalPages: number;
    summary: {
      totalItems: number;
      lowStockItems: number;
      outOfStockItems: number;
      totalValue: number;
    };
  }> {
    const response = await apiClient.get('/inventory', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch inventory');
    }
    return response.data as {
      items: InventoryItem[];
      total: number;
      page: number;
      totalPages: number;
      summary: {
        totalItems: number;
        lowStockItems: number;
        outOfStockItems: number;
        totalValue: number;
      };
    };
  }

  // Get inventory item by product ID
  static async getInventoryItem(productId: string): Promise<InventoryItem> {
    const response = await apiClient.get(`/inventory/product/${productId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch inventory item');
    }
    return response.data as InventoryItem;
  }

  // Get warehouses
  static async getWarehouses(): Promise<Warehouse[]> {
    const response = await apiClient.get('/inventory/warehouses');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch warehouses');
    }
    return response.data as Warehouse[];
  }

  // Get warehouse by ID
  static async getWarehouse(id: string): Promise<Warehouse> {
    const response = await apiClient.get(`/inventory/warehouses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch warehouse');
    }
    return response.data as Warehouse;
  }

  // Create warehouse
  static async createWarehouse(warehouseData: CreateWarehouseData): Promise<Warehouse> {
    const response = await apiClient.post('/inventory/warehouses', warehouseData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create warehouse');
    }
    return response.data as Warehouse;
  }

  // Update warehouse
  static async updateWarehouse(id: string, warehouseData: Partial<CreateWarehouseData>): Promise<Warehouse> {
    const response = await apiClient.put(`/inventory/warehouses/${id}`, warehouseData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update warehouse');
    }
    return response.data as Warehouse;
  }

  // Delete warehouse
  static async deleteWarehouse(id: string): Promise<void> {
    const response = await apiClient.delete(`/inventory/warehouses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete warehouse');
    }
  }

  // Adjust inventory
  static async adjustInventory(adjustment: InventoryAdjustment): Promise<{
    success: boolean;
    previousQuantity: number;
    newQuantity: number;
    movement: InventoryMovement;
  }> {
    const response = await apiClient.post('/inventory/adjust', adjustment);
    if (!response.success) {
      throw new Error(response.error || 'Failed to adjust inventory');
    }
    return response.data as {
      success: boolean;
      previousQuantity: number;
      newQuantity: number;
      movement: InventoryMovement;
    };
  }

  // Bulk adjust inventory
  static async bulkAdjustInventory(adjustments: InventoryAdjustment[]): Promise<{
    success: boolean;
    results: Array<{
      productId: string;
      success: boolean;
      previousQuantity: number;
      newQuantity: number;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post('/inventory/bulk-adjust', { adjustments });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk adjust inventory');
    }
    return response.data as {
      success: boolean;
      results: Array<{
        productId: string;
        success: boolean;
        previousQuantity: number;
        newQuantity: number;
        error?: string;
      }>;
    };
  }

  // Transfer inventory between warehouses
  static async transferInventory(transfer: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    reason?: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    movement: InventoryMovement;
  }> {
    const response = await apiClient.post('/inventory/transfer', transfer);
    if (!response.success) {
      throw new Error(response.error || 'Failed to transfer inventory');
    }
    return response.data as {
      success: boolean;
      movement: InventoryMovement;
    };
  }

  // Get inventory movements
  static async getInventoryMovements(filters?: InventoryMovementFilters): Promise<{
    movements: InventoryMovement[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/inventory/movements', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch inventory movements');
    }
    return response.data as {
      movements: InventoryMovement[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get low stock alerts
  static async getLowStockAlerts(threshold?: number): Promise<{
    alerts: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      minStockLevel: number;
      warehouse?: string;
      severity: 'low' | 'critical';
    }>;
    total: number;
  }> {
    const response = await apiClient.get('/inventory/alerts/low-stock', { threshold });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch low stock alerts');
    }
    return response.data as {
      alerts: Array<{
        productId: string;
        productName: string;
        currentStock: number;
        minStockLevel: number;
        warehouse?: string;
        severity: 'low' | 'critical';
      }>;
      total: number;
    };
  }

  // Get inventory analytics
  static async getInventoryAnalytics(filters?: {
    dateFrom?: string;
    dateTo?: string;
    warehouseId?: string;
  }): Promise<{
    totalValue: number;
    totalItems: number;
    stockTurnover: number;
    averageStockLevel: number;
    stockouts: number;
    topMovingProducts: Array<{
      productId: string;
      productName: string;
      movements: number;
      value: number;
    }>;
    stockLevelDistribution: {
      inStock: number;
      lowStock: number;
      outOfStock: number;
    };
    monthlyTrends: Array<{
      month: string;
      value: number;
      movements: number;
    }>;
  }> {
    const response = await apiClient.get('/inventory/analytics', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch inventory analytics');
    }
    return response.data as {
      totalValue: number;
      totalItems: number;
      stockTurnover: number;
      averageStockLevel: number;
      stockouts: number;
      topMovingProducts: Array<{
        productId: string;
        productName: string;
        movements: number;
        value: number;
      }>;
      stockLevelDistribution: {
        inStock: number;
        lowStock: number;
        outOfStock: number;
      };
      monthlyTrends: Array<{
        month: string;
        value: number;
        movements: number;
      }>;
    };
  }

  // Reserve inventory for order
  static async reserveInventory(reservation: {
    productId: string;
    quantity: number;
    orderId: string;
    warehouseId?: string;
  }): Promise<{
    success: boolean;
    reservationId: string;
    availableQuantity: number;
    reservedQuantity: number;
  }> {
    const response = await apiClient.post('/inventory/reserve', reservation);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reserve inventory');
    }
    return response.data as {
      success: boolean;
      reservationId: string;
      availableQuantity: number;
      reservedQuantity: number;
    };
  }

  // Release inventory reservation
  static async releaseReservation(reservationId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post('/inventory/release-reservation', { reservationId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to release reservation');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Get inventory reports
  static async getInventoryReport(reportType: 'summary' | 'detailed' | 'movements' | 'valuation', filters?: {
    dateFrom?: string;
    dateTo?: string;
    warehouseId?: string;
    category?: string;
  }): Promise<{
    reportData: any;
    generatedAt: string;
    filters: any;
  }> {
    const response = await apiClient.get('/inventory/reports', { reportType, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate inventory report');
    }
    return response.data as {
      reportData: any;
      generatedAt: string;
      filters: any;
    };
  }

  // Export inventory data
  static async exportInventory(format: 'csv' | 'excel' | 'pdf' = 'csv', filters?: InventoryFilters): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get('/inventory/export', { format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export inventory data');
    }
    return response.data as {
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    };
  }

  // Get inventory dashboard stats
  static async getDashboardStats(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockAlerts: number;
    recentMovements: InventoryMovement[];
    topProducts: Array<{
      productId: string;
      productName: string;
      stockLevel: number;
      value: number;
    }>;
  }> {
    const response = await apiClient.get('/inventory/dashboard');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch inventory dashboard stats');
    }
    return response.data as {
      totalProducts: number;
      totalValue: number;
      lowStockAlerts: number;
      recentMovements: InventoryMovement[];
      topProducts: Array<{
        productId: string;
        productName: string;
        stockLevel: number;
        value: number;
      }>;
    };
  }
}