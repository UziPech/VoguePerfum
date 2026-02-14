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
  id: number | string;
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
  stats?: {
    total_reviews: number;
    average_rating: number;
  };
  product_badges_view?: Array<{
    badge_type: 'NEW' | 'BEST' | null;
  }>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ActivityLog {
  id: string;
  user_name: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'PRODUCT' | 'CATEGORY' | 'BRAND';
  entity_name: string;
  justification?: string;
  created_at: string;
  details?: any;
}