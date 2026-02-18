import React from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    wishlist: Set<number | string>;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (id: number | string) => void;
    selectedCategory: Category;
    onClearSearch?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    wishlist,
    onAddToCart,
    onToggleWishlist,
    selectedCategory,
    onClearSearch
}) => {
    return (
        <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-10 w-full bg-white">
            <div className="flex justify-between items-end mb-8 px-2">
                <h2 className="text-2xl font-light text-gray-900 tracking-wide uppercase">
                    {selectedCategory === 'Todo' ? 'Catálogo' : selectedCategory}
                </h2>
                <span className="text-xs text-gray-400 tracking-widest uppercase">{products.length} items</span>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
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
