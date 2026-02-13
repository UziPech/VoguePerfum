import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductTickerProps {
    onAddToCart: (product: Product) => void;
}

export const ProductTicker: React.FC<ProductTickerProps> = ({ onAddToCart }) => {
    // Duplicate products to ensure seamless scrolling
    const tickerProducts = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS];

    return (
        <div className="bg-white py-8 overflow-hidden border-b border-gray-100">
            <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          animation: marquee-scroll 40s linear infinite;
        }
      `}</style>

            <div className="flex w-max animate-marquee-scroll hover:pause">
                {tickerProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="flex-shrink-0 mx-3 group cursor-pointer"
                        onClick={() => onAddToCart(product)}
                    >
                        <div className="w-24 h-32 md:w-28 md:h-36 overflow-hidden bg-gray-100 border border-gray-100 mb-2 relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] bg-white/90 px-2 py-1 uppercase tracking-widest font-bold text-black border border-black/10 shadow-sm">
                                    Comprar
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
