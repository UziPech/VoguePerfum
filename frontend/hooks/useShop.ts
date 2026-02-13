import { useState, useMemo } from 'react';
import { Product, CartItem, Category } from '../types';
import { MOCK_PRODUCTS } from '../constants';

export function useShop() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('Todo');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());

    // Modals State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    // Filter Products
    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(product => {
            const matchesCategory = selectedCategory === 'Todo' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Wishlist Products
    const wishlistProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(product => wishlist.has(product.id));
    }, [wishlist]);

    // New Arrivals (Just for the Slider)
    const newArrivals = MOCK_PRODUCTS.slice(0, 5); // Take first 5 as "New"

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
        toggleWishlist
    };
}
