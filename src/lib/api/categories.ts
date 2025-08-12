const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  iconName?: string; // Dynamic icon name for Lucide React
  featured: boolean;
  productCount: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[];
}

export interface CategoryWithProducts extends Category {
  products?: any[];
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  productCount: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getSubcategoryById(subcategoryId: string): Promise<Subcategory | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch subcategory: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return null;
  }
}

export async function getCategoriesWithSubcategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategories(): Promise<{ success: boolean; data: Category[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, data: [] };
  }
}

export async function getSubcategoriesByCategoryId(categoryId: string): Promise<Subcategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/category/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export async function getCategoryWithProducts(categoryId: string, options?: {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<CategoryWithProducts | null> {
  try {
    const category = await getCategoryById(categoryId);
    if (!category) return null;

    // For now, return the category without products since we don't have a products API yet
    // This can be extended when the products API is implemented
    return {
      ...category,
      products: []
    };
  } catch (error) {
    console.error('Error fetching category with products:', error);
    return null;
  }
}

// Legacy API object for backward compatibility
export const categoriesApi = {
  getCategoryById,
  getSubcategoryById,
  getCategoriesWithSubcategories,
  getSubcategoriesByCategoryId,
  getCategoryWithProducts,
  getCategories,
};