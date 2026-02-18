import React from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    wishlist: Set<number | string>;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (id: number | string) => void;
    selectedCategory: Category;
    selectedCategoryName?: string; // Add this
    onClearSearch?: () => void;
    onLoadMore?: () => void; // Add this
    hasMore?: boolean;       // Add this
    isLoadingMore?: boolean; // Add this
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    wishlist,
    onAddToCart,
    onToggleWishlist,
    selectedCategory,
    selectedCategoryName, // Destructure
    onClearSearch,
    onLoadMore, // Destructure
    hasMore,    // Destructure
    isLoadingMore // Destructure
}) => {
    // Use name if available, fallback to selectedCategory (which might be slug or 'Todo')
    const displayCategory = selectedCategoryName || (selectedCategory === 'Todo' ? 'Catálogo' : selectedCategory);

    return (
        <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-10 w-full bg-white">
            <div className="flex justify-between items-end mb-8 px-2">
                <h2 className="text-2xl font-light text-gray-900 tracking-wide uppercase">
                    {displayCategory === 'Todo' ? 'Catálogo' : displayCategory}
                </h2>
                <span className="text-xs text-gray-400 tracking-widest uppercase">{products.length} items</span>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isInWishlist={wishlist.has(product.id)}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                            />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && onLoadMore && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                className="px-8 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoadingMore ? 'Cargando...' : 'Cargar Más'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-gray-500 font-light">No se encontraron productos.</p>
                    {onClearSearch && (
                        <button onClick={onClearSearch} className="mt-4 text-black border-b border-black text-sm uppercase tracking-wider pb-1">Ver todo</button>
                    )}
                </div>
            )}
        </main>
    );
};
