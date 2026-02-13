import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface NewArrivalsProps {
    products: Product[];
    wishlist: Set<number>;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (id: number) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
    products,
    wishlist,
    onAddToCart,
    onToggleWishlist
}) => {
    return (
        <section className="py-16 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
                <h3 className="text-3xl md:text-4xl font-playfair italic text-gray-900">
                    New Arrivals
                </h3>
                <div className="hidden md:flex gap-2">
                    <span className="text-xs tracking-widest uppercase text-gray-400">Drag to explore</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* The Slider Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-8 pb-8 no-scrollbar">
                {products.map((product) => (
                    <div
                        key={`new-${product.id}`}
                        className="snap-center flex-shrink-0 w-[60vw] md:w-[300px]"
                    >
                        <ProductCard
                            product={product}
                            isInWishlist={wishlist.has(product.id)}
                            onAddToCart={onAddToCart}
                            onToggleWishlist={onToggleWishlist}
                        />
                    </div>
                ))}
                {/* Spacer for end of list */}
                <div className="w-4 flex-shrink-0" />
            </div>
        </section>
    );
};
