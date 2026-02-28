import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NOIR EXTRÊME",
    brand: "TOM FORD",
    price: 185.00,
    category: "Hombre",
    image: "https://picsum.photos/500/500?random=1",
    isNew: true,
    stock: 10
  },
  {
    id: 2,
    name: "LIBRE INTENSE",
    brand: "YVES SAINT LAURENT",
    price: 140.00,
    category: "Mujer",
    image: "https://picsum.photos/500/500?random=2",
    stock: 10
  },
  {
    id: 3,
    name: "SANTAL 33",
    brand: "LE LABO",
    price: 230.00,
    category: "Unisex",
    image: "https://picsum.photos/500/500?random=3",
    stock: 10
  },
  {
    id: 4,
    name: "SAUVAGE ELIXIR",
    brand: "DIOR",
    price: 165.00,
    category: "Hombre",
    image: "https://picsum.photos/500/500?random=4",
    stock: 10
  },
  {
    id: 5,
    name: "DISCOVERY SET",
    brand: "MAISON FRANCIS KURKDJIAN",
    price: 295.00,
    category: "Sets",
    image: "https://picsum.photos/500/500?random=5",
    isNew: true,
    stock: 10
  },
  {
    id: 6,
    name: "BLACK ORCHID",
    brand: "TOM FORD",
    price: 155.00,
    category: "Mujer",
    image: "https://picsum.photos/500/500?random=6",
    stock: 10
  },
  {
    id: 7,
    name: "AVENTUS",
    brand: "CREED",
    price: 365.00,
    category: "Hombre",
    image: "https://picsum.photos/500/500?random=7",
    stock: 10
  },
  {
    id: 8,
    name: "BACCHARAT ROUGE 540",
    brand: "MAISON FRANCIS KURKDJIAN",
    price: 325.00,
    category: "Unisex",
    image: "https://picsum.photos/500/500?random=8",
    stock: 10
  }
];

export const CATEGORIES: { label: string; value: import('./types').Category }[] = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Hombre', value: 'Hombre' },
  { label: 'Mujer', value: 'Mujer' },
  { label: 'Unisex', value: 'Unisex' },
  { label: 'Sets', value: 'Sets' },
];