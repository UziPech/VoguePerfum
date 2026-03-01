import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, CartItem, Category } from '../types';
import { useGetProductsQuery, useGetCartQuery, useGetWishlistQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetCategoriesQuery } from '../src/store/api/catalogApi';
import { useAppSelector } from '../src/store/hooks';

export function useShop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categorySlugFromUrl = searchParams.get('category');
    const { user } = useAppSelector((state) => state.auth);

    // Fetch categories to map slug -> name for UI
    const { data: categoriesData } = useGetCategoriesQuery();

    // Initialize from URL or default to 'Todo'
    const [selectedCategory, setSelectedCategoryState] = useState<string>(categorySlugFromUrl || 'Todo');

    // Sync state when URL changes
    useEffect(() => {
        if (categorySlugFromUrl) {
            setSelectedCategoryState(categorySlugFromUrl);
        } else {
            setSelectedCategoryState('Todo');
        }
    }, [categorySlugFromUrl]);

    const setSelectedCategory = (categorySlug: string) => {
        setSelectedCategoryState(categorySlug);
        if (categorySlug === 'Todo') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ ...Object.fromEntries(searchParams), category: categorySlug });
        }
    };

    // Pagination State
    const [page, setPage] = useState(1);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // Reset pagination when category changes
    useEffect(() => {
        setPage(1);
        setAllProducts([]);
        setHasMore(true);
    }, [selectedCategory]);

    // Derived Name for UI
    const selectedCategoryName = useMemo(() => {
        if (selectedCategory === 'Todo') return 'Todo';

        const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);

        // Try to find matching category by slug or name (fallback)
        const found = categories.find((c: any) => c.slug === selectedCategory || c.name === selectedCategory);
        return found ? found.name : selectedCategory;
    }, [selectedCategory, categoriesData]);

    const apiCategorySlug = selectedCategory === 'Todo' ? undefined : selectedCategory;

    // Fetch Products (Paginated)
    const { data, isLoading, isFetching } = useGetProductsQuery({
        page,
        limit: 12,
        category_slug: apiCategorySlug
    });

    // Accumulate Products
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllProducts(data.data);
            } else {
                setAllProducts(prev => {
                    // Prevent duplicates if strict mode causes double render
                    const newIds = new Set(data.data.map((p: any) => p.id));
                    const filteredPrev = prev.filter(p => !newIds.has(p.id));
                    return [...filteredPrev, ...data.data];
                });
            }

            // Determine if there are more products to load
            if (data.data.length < 12) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        }
    }, [data, page]);

    const loadMore = () => {
        if (!isFetching && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    // --- State Management (Dual Strategy: Auth vs Local) ---

    // Local State (for guests)
    const [localCart, setLocalCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [localWishlistItems, setLocalWishlistItems] = useState<Product[]>(() => {
        const saved = localStorage.getItem('wishlist_products');
        if (saved) return JSON.parse(saved);
        // Clean up old format (was only IDs, can't recover product data)
        localStorage.removeItem('wishlist');
        return [];
    });
    const localWishlist = useMemo(() => new Set(localWishlistItems.map(p => p.id)), [localWishlistItems]);

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
            localStorage.setItem('wishlist_products', JSON.stringify(localWishlistItems));
        }
    }, [localCart, localWishlistItems, user]);

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


    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Use allProducts for display
    const products: Product[] = allProducts;

    // Filtering (Search only - Category is now server-side)
    const filteredProducts = useMemo(() => {
        // We filter the loaded products by search query
        return products.filter(product => {
            const brandName = product.brands?.name || product.brand || '';
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                brandName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [searchQuery, products]);

    const wishlistProducts = useMemo(() => {
        if (user && serverWishlistData) {
            // Auth users: use the full product data from the server response
            // Each item is { id, product_id, created_at, product: { ...full product... } }
            return serverWishlistData
                .filter((w: any) => w.product)
                .map((w: any) => ({
                    ...w.product,
                    image: w.product.image_url || w.product.image,
                }));
        }
        // Guests: use the full product objects stored in localStorage
        return localWishlistItems;
    }, [user, serverWishlistData, localWishlistItems]);

    // Fetches for New Arrivals (Global, independent of filters)
    const { data: newArrivalsData } = useGetProductsQuery({ limit: 20, page: 1 });

    const newArrivals = useMemo(() => {
        if (!newArrivalsData?.data) return [];
        // Create a copy and shuffle
        const shuffled = [...newArrivalsData.data].sort(() => 0.5 - Math.random());
        return shuffled;
    }, [newArrivalsData]);

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
            setLocalWishlistItems(prev => {
                let updated: Product[];
                if (prev.some(p => p.id === id)) {
                    // Remove
                    updated = prev.filter(p => p.id !== id);
                } else {
                    // Add — find the full product from any loaded source
                    const product = products.find(p => p.id === id)
                        || (newArrivalsData?.data || []).find((p: Product) => p.id === id);
                    if (product) {
                        updated = [...prev, product];
                    } else {
                        return prev;
                    }
                }
                localStorage.setItem('wishlist_products', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return {
        selectedCategory,
        selectedCategoryName, // Export name for UI
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
        isLoadingMore: isFetching && page > 1,
        loadMore,
        hasMore,
        allProducts: products
    };
}
