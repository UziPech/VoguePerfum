import React, { useMemo } from 'react';
import { useScroll } from '../../hooks/useScroll';
import { useShop } from '../../hooks/useShop';
import { useGetCategoriesQuery } from '../store/api/catalogApi';
import { useAppSelector } from '../store/hooks';

// Components
import { Navbar } from '../../components/Navbar';
import { HeroSection } from '../../components/HeroSection';
import { Marquee } from '../../components/Marquee';
import { ProductTicker } from '../../components/ProductTicker';
import { NewArrivals } from '../../components/NewArrivals';
import { CategoryFilter } from '../../components/CategoryFilter';
import { ProductGrid } from '../../components/ProductGrid';
import { Footer } from '../../components/Footer';
import { BrandPresentation } from '../../components/BrandPresentation';
import { SearchModal } from '../../components/SearchModal';
import { WishlistDrawer } from '../../components/WishlistDrawer';
import { CartDrawer } from '../../components/CartDrawer';

export const ShopLayout = () => {
    // Logic Extract
    const scrolled = useScroll();
    const { data: categoriesData } = useGetCategoriesQuery(undefined);
    const { user } = useAppSelector((state) => state.auth);

    const {
        selectedCategory,
        selectedCategoryName,
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
        isLoadingMore,
        loadMore,
        hasMore
    } = useShop();

    // Map categories for the filter component
    // Assuming backend returns array of categories directly or { data: [] }
    const categoryOptions = useMemo(() => {
        const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);

        return [{ label: 'Todo', value: 'Todo' }, ...categories.map((c: any) => ({
            label: c.name,
            value: c.slug || c.name // Use slug if available
        }))];
    }, [categoriesData]);

    const handleLogoClick = () => {
        setSelectedCategory('Todo');
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar */}
            <Navbar
                scrolled={scrolled}
                cartCount={cartCount}
                wishlistCount={wishlist.size}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onLogoClick={handleLogoClick}
                user={user}
            />

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredProducts={filteredProducts}
            />

            {/* Hero Section - Only show when no search is active */}
            {!searchQuery && (
                <HeroSection />
            )}

            <Marquee />

            <ProductTicker products={filteredProducts} onAddToCart={addToCart} />

            <NewArrivals
                products={newArrivals}
                wishlist={wishlist}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
            />

            <div id="catalog" />

            {/* Category Filter */}
            <CategoryFilter
                categories={categoryOptions}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Main Content */}
            {isLoading && filteredProducts.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <ProductGrid
                    products={filteredProducts}
                    wishlist={wishlist}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    selectedCategory={selectedCategory}
                    selectedCategoryName={selectedCategoryName} // Pass name
                    onClearSearch={() => setSearchQuery('')}
                    onLoadMore={loadMore} // Pass
                    hasMore={hasMore}     // Pass
                    isLoadingMore={isLoadingMore} // Pass
                />
            )}

            <BrandPresentation />

            <Footer />

            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistProducts}
                onAddToCart={addToCart}
                onRemove={toggleWishlist}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
            />
        </div>
    );
};
