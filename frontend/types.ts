export type Category = string;

export interface CategoryAttr {
  id: string;
  name: string;
  slug: string;
}

export interface BrandAttr {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand: string; // Keep for compatibility if used, but API returns 'brands' object
  brands?: BrandAttr;
  price: number;
  category: Category; // Keep for compatibility
  categories?: CategoryAttr;
  image: string; // Keep for compatibility
  image_url?: string;
  stock: number;
  isNew?: boolean; // deprecated
  is_new?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}