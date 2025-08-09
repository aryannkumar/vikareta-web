import { 
  Building, 
  Shirt, 
  Laptop, 
  Car, 
  Pill, 
  Leaf, 
  Package,
  Factory,
  LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
  featured: boolean;
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Technology',
    description: 'Electronic components, devices, and technology products',
    icon: Laptop,
    featured: true,
    productCount: 15420,
    subcategories: [
      { id: 'computers', name: 'Computers & Laptops', description: 'Desktop computers, laptops, and accessories', productCount: 3240 },
      { id: 'mobile', name: 'Mobile Phones & Accessories', description: 'Smartphones, tablets, and mobile accessories', productCount: 2180 },
      { id: 'electronics-components', name: 'Electronic Components', description: 'Semiconductors, circuits, and electronic parts', productCount: 4560 },
      { id: 'audio-video', name: 'Audio & Video Equipment', description: 'Sound systems, cameras, and AV equipment', productCount: 1890 },
      { id: 'home-appliances', name: 'Home Appliances', description: 'Kitchen appliances, air conditioners, and home electronics', productCount: 3550 }
    ]
  },
  {
    id: 'textiles',
    name: 'Textiles & Apparel',
    description: 'Fabrics, clothing, and textile products',
    icon: Shirt,
    featured: true,
    productCount: 12890,
    subcategories: [
      { id: 'fabrics', name: 'Fabrics & Raw Materials', description: 'Cotton, silk, synthetic fabrics, and textile materials', productCount: 4320 },
      { id: 'garments', name: 'Ready-made Garments', description: 'Clothing for men, women, and children', productCount: 3670 },
      { id: 'home-textiles', name: 'Home Textiles', description: 'Bed sheets, curtains, and home textile products', productCount: 2890 },
      { id: 'accessories', name: 'Fashion Accessories', description: 'Bags, belts, jewelry, and fashion accessories', productCount: 2010 }
    ]
  },
  {
    id: 'machinery',
    name: 'Machinery & Equipment',
    description: 'Industrial machinery and manufacturing equipment',
    icon: Factory,
    featured: true,
    productCount: 8760,
    subcategories: [
      { id: 'industrial-machinery', name: 'Industrial Machinery', description: 'Manufacturing and production machinery', productCount: 2340 },
      { id: 'construction-equipment', name: 'Construction Equipment', description: 'Heavy machinery for construction and infrastructure', productCount: 1890 },
      { id: 'agricultural-machinery', name: 'Agricultural Machinery', description: 'Farming equipment and agricultural tools', productCount: 1560 },
      { id: 'packaging-machinery', name: 'Packaging Machinery', description: 'Equipment for packaging and processing', productCount: 1230 },
      { id: 'printing-machinery', name: 'Printing & Publishing Equipment', description: 'Printing presses and publishing machinery', productCount: 1740 }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive & Transportation',
    description: 'Vehicles, auto parts, and transportation equipment',
    icon: Car,
    featured: true,
    productCount: 9450,
    subcategories: [
      { id: 'auto-parts', name: 'Auto Parts & Components', description: 'Engine parts, electrical components, and auto accessories', productCount: 4560 },
      { id: 'commercial-vehicles', name: 'Commercial Vehicles', description: 'Trucks, buses, and commercial transportation', productCount: 1230 },
      { id: 'two-wheelers', name: 'Two Wheelers & Parts', description: 'Motorcycles, scooters, and spare parts', productCount: 2340 },
      { id: 'automotive-tools', name: 'Automotive Tools & Equipment', description: 'Garage equipment and automotive tools', productCount: 1320 }
    ]
  },
  {
    id: 'construction',
    name: 'Construction & Building Materials',
    description: 'Building materials, construction supplies, and hardware',
    icon: Building,
    featured: true,
    productCount: 11230,
    subcategories: [
      { id: 'cement-concrete', name: 'Cement & Concrete Products', description: 'Cement, ready-mix concrete, and concrete products', productCount: 2890 },
      { id: 'steel-metals', name: 'Steel & Metal Products', description: 'Steel bars, metal sheets, and structural steel', productCount: 3450 },
      { id: 'tiles-flooring', name: 'Tiles & Flooring', description: 'Ceramic tiles, marble, and flooring materials', productCount: 2340 },
      { id: 'plumbing-electrical', name: 'Plumbing & Electrical Supplies', description: 'Pipes, wires, and electrical fittings', productCount: 2550 }
    ]
  },
  {
    id: 'chemicals',
    name: 'Chemicals & Pharmaceuticals',
    description: 'Industrial chemicals, pharmaceuticals, and chemical products',
    icon: Pill,
    featured: false,
    productCount: 6780,
    subcategories: [
      { id: 'industrial-chemicals', name: 'Industrial Chemicals', description: 'Basic chemicals and industrial raw materials', productCount: 2340 },
      { id: 'pharmaceuticals', name: 'Pharmaceutical Products', description: 'Medicines, APIs, and pharmaceutical ingredients', productCount: 1890 },
      { id: 'agrochemicals', name: 'Agrochemicals', description: 'Fertilizers, pesticides, and agricultural chemicals', productCount: 1560 },
      { id: 'specialty-chemicals', name: 'Specialty Chemicals', description: 'Dyes, pigments, and specialty chemical products', productCount: 990 }
    ]
  },
  {
    id: 'food-agriculture',
    name: 'Food & Agriculture',
    description: 'Food products, agricultural produce, and farming supplies',
    icon: Leaf,
    featured: true,
    productCount: 8920,
    subcategories: [
      { id: 'grains-cereals', name: 'Grains & Cereals', description: 'Rice, wheat, and other food grains', productCount: 2340 },
      { id: 'fruits-vegetables', name: 'Fresh Fruits & Vegetables', description: 'Fresh produce and agricultural products', productCount: 1890 },
      { id: 'processed-foods', name: 'Processed Foods', description: 'Packaged foods, snacks, and processed products', productCount: 2560 },
      { id: 'spices-condiments', name: 'Spices & Condiments', description: 'Spices, herbs, and food seasonings', productCount: 1230 },
      { id: 'dairy-products', name: 'Dairy Products', description: 'Milk products, cheese, and dairy items', productCount: 900 }
    ]
  },
  {
    id: 'packaging',
    name: 'Packaging & Printing',
    description: 'Packaging materials, printing supplies, and related products',
    icon: Package,
    featured: false,
    productCount: 4560,
    subcategories: [
      { id: 'packaging-materials', name: 'Packaging Materials', description: 'Boxes, bags, and packaging supplies', productCount: 1890 },
      { id: 'printing-supplies', name: 'Printing Supplies', description: 'Inks, papers, and printing materials', productCount: 1340 },
      { id: 'labels-stickers', name: 'Labels & Stickers', description: 'Product labels and adhesive materials', productCount: 890 },
      { id: 'flexible-packaging', name: 'Flexible Packaging', description: 'Plastic films and flexible packaging solutions', productCount: 440 }
    ]
  }
];

export const getFeaturedCategories = () => categories.filter(cat => cat.featured);

export const featuredCategories = categories.filter(cat => cat.featured);

export const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getTotalProductCount = () => categories.reduce((total, cat) => total + cat.productCount, 0);