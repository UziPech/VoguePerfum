import { useState, useMemo } from 'react';
import { Product, CartItem, Category } from '../types';
import { useGetProductsQuery } from '../src/store/api/catalogApi';

export function useShop() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('Todo');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());

    // Fetch Products from API
    const { data, isLoading } = useGetProductsQuery({ limit: 100 });
    const products: Product[] = data?.data || [];

    // Modals State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    // Filter Products
    const filteredProducts = useMemo(() => {
        if (isLoading) return [];
        return products.filter(product => {
            const categoryName = product.categories?.name || product.category;
            const matchesCategory = selectedCategory === 'Todo' || categoryName === selectedCategory;

            const brandName = product.brands?.name || product.brand || '';
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                brandName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, products, isLoading]);

    // Wishlist Products
    const wishlistProducts = useMemo(() => {
        return products.filter(product => wishlist.has(product.id));
    }, [wishlist, products]);

    // New Arrivals (Just for the Slider)
    const newArrivals = useMemo(() => {
        return products.slice(0, 5);
    }, [products]);

    // Cart Actions
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Wishlist Actions
    const toggleWishlist = (id: number) => {
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(id)) {
                newWishlist.delete(id);
            } else {
                newWishlist.add(id);
            }
            return newWishlist;
        });
    };

    return {
        selectedCategory,
        setSelectedCategory,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        wishlistProducts,
        newArrivals,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        toggleWishlist,
        isLoading,
        allProducts: products
    };
}
