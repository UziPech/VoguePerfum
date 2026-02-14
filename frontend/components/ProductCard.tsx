import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
    isInWishlist: boolean;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (id: number | string) => void;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    isInWishlist,
    onAddToCart,
    onToggleWishlist,
    className = ""
}) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className={`group flex flex-col relative cursor-pointer ${className}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-gray-100 mb-3 overflow-hidden rounded-lg">
                <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                {/* Badge (Top Left) */}
                {(product.is_new || product.isNew) ? (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                        New
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                        Bestseller
                    </span>
                )}

                {/* Wishlist Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                >
                    <Heart
                        className={`w-4 h-4 ${isInWishlist ? 'fill-black text-black' : 'text-gray-900'}`}
                    />
                </button>

                {/* Cart Button (Bottom Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm text-black rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
                >
                    <ShoppingCart className="w-4 h-4" />
                </button>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow px-1">
                {/* Star Rating (Optional - specific query needed for average) */}
                {/* For now, hiding fake stars or showing empty */}
                {/* Star Rating */}
                <div className="flex gap-0.5 mb-1.5 opacity-80">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.round(product.stats?.average_rating || 0) ? 'text-black fill-black' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-[10px] text-gray-500 ml-1">({product.stats?.total_reviews || 0})</span>
                </div>

                <h3 className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">{product.brands?.name || product.brand}</h3>
                <h2 className="text-sm font-medium text-gray-900 leading-tight mb-2 truncate font-playfair">{product.name}</h2>

                <div className="mt-auto">
                    <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};
