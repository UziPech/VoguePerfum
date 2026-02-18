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
import { SearchModal } from '../../components/SearchModal';
import { WishlistDrawer } from '../../components/WishlistDrawer';
import { CartDrawer } from '../../components/CartDrawer';

export const ShopLayout = () => {
    // Logic Extract
    const scrolled = useScroll();
    const { data: categoriesData } = useGetCategoriesQuery(undefined);
    const { user } = useAppSelector((state) => state.auth);
    console.log('ShopLayout User:', user);

    const dynamicCategories = useMemo(() => {
        const dbCategories = categoriesData || [];
        const mapped = dbCategories.map((c: any) => ({ label: c.name, value: c.name }));
        return [{ label: 'Todo', value: 'Todo' }, ...mapped];
    }, [categoriesData]);

    const {
        selectedCategory, setSelectedCategory,
        cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
        wishlist, toggleWishlist, wishlistProducts,
        isCartOpen, setIsCartOpen,
        isWishlistOpen, setIsWishlistOpen,
        isSearchOpen, setIsSearchOpen,
        searchQuery, setSearchQuery, filteredProducts,
        newArrivals, allProducts
    } = useShop();

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar
                scrolled={scrolled}
                cartCount={cartCount}
                wishlistCount={wishlist.size}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                user={user}
            />

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredProducts={filteredProducts}
            />

            <HeroSection />

            <Marquee />

            <ProductTicker products={allProducts} onAddToCart={addToCart} />

            <NewArrivals
                products={newArrivals}
                wishlist={wishlist}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
            />

            <div id="catalog" />

            <CategoryFilter
                categories={dynamicCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <ProductGrid
                products={filteredProducts}
                wishlist={wishlist}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                selectedCategory={selectedCategory}
                onClearSearch={() => {
                    setSelectedCategory('Todo');
                    setSearchQuery('');
                }}
            />

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
