import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, CartItem, Category } from '../types';
import { useGetProductsQuery, useGetCartQuery, useGetWishlistQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../src/store/api/catalogApi';
import { useAppSelector } from '../src/store/hooks';

export function useShop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category');
    const { user } = useAppSelector((state) => state.auth);

    // Initialize from URL or default to 'Todo'
    const [selectedCategory, setSelectedCategoryState] = useState<Category>(categoryFromUrl || 'Todo');

    // Sync state when URL changes
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategoryState(categoryFromUrl);
        } else {
            setSelectedCategoryState('Todo');
        }
    }, [categoryFromUrl]);

    const setSelectedCategory = (category: Category) => {
        setSelectedCategoryState(category);
        if (category === 'Todo') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ ...Object.fromEntries(searchParams), category });
        }
    };

    // --- State Management (Dual Strategy: Auth vs Local) ---

    // Local State (for guests)
    const [localCart, setLocalCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [localWishlist, setLocalWishlist] = useState<Set<string | number>>(() => {
        const saved = localStorage.getItem('wishlist');
        return new Set(saved ? JSON.parse(saved) : []);
    });

    // API Hooks (for auth users)
    const { data: serverCartData } = useGetCartQuery(undefined, { skip: !user });
    const { data: serverWishlistData } = useGetWishlistQuery(undefined, { skip: !user });

    const [addToCartMutation] = useAddToCartMutation();
    const [updateCartItemMutation] = useUpdateCartItemMutation();
    const [removeFromCartMutation] = useRemoveFromCartMutation();
    const [addToWishlistMutation] = useAddToWishlistMutation();
    const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

    // Persist Local State
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(localCart));
            localStorage.setItem('wishlist', JSON.stringify(Array.from(localWishlist)));
        }
    }, [localCart, localWishlist, user]);

    // Derived State (Unified)
    const cart: CartItem[] = useMemo(() => {
        if (user && serverCartData) {
            return serverCartData.map((item: any) => ({
                ...item.product,
                image: item.product.image_url || item.product.image, // Handle fallback
                quantity: item.quantity
            }));
        }
        return localCart;
    }, [user, serverCartData, localCart]);

    const wishlist: Set<string | number> = useMemo(() => {
        if (user && serverWishlistData) {
            return new Set(serverWishlistData.map((w: any) => w.product_id));
        }
        return localWishlist;
    }, [user, serverWishlistData, localWishlist]);


    // Fetch Products
    const { data, isLoading } = useGetProductsQuery({ limit: 100 });
    const products: Product[] = data?.data || [];

    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filtering
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

    const wishlistProducts = useMemo(() => {
        return products.filter(product => wishlist.has(product.id));
    }, [wishlist, products]);

    const newArrivals = useMemo(() => products.slice(0, 5), [products]);

    // Actions
    const addToCart = async (product: Product) => {
        if (user) {
            try {
                await addToCartMutation({ product_id: product.id, quantity: 1 }).unwrap();
                setIsCartOpen(true);
            } catch (error) {
                console.error('Failed to add to cart:', error);
            }
        } else {
            setLocalCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prev, { ...product, quantity: 1 }];
            });
            setIsCartOpen(true);
        }
    };

    const removeFromCart = async (id: number | string) => {
        if (user) {
            try {
                await removeFromCartMutation(id).unwrap();
            } catch (error) {
                console.error('Failed to remove from cart:', error);
            }
        } else {
            setLocalCart(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateQuantity = async (id: number | string, delta: number) => {
        if (user) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            const newQuantity = Math.max(1, item.quantity + delta);
            try {
                await updateCartItemMutation({ productId: id, quantity: newQuantity }).unwrap();
            } catch (error) {
                console.error('Failed to update quantity:', error);
            }
        } else {
            setLocalCart(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            }));
        }
    };

    const toggleWishlist = async (id: number | string) => {
        if (user) {
            if (wishlist.has(id)) {
                await removeFromWishlistMutation(id);
            } else {
                await addToWishlistMutation(id);
            }
        } else {
            setLocalWishlist(prev => {
                const newWishlist = new Set(prev);
                if (newWishlist.has(id)) {
                    newWishlist.delete(id);
                } else {
                    newWishlist.add(id);
                }
                localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
                return newWishlist;
            });
        }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
