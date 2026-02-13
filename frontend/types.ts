export type Category = string;

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}