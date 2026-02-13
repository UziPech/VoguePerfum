import React from 'react';
import { X, Heart, Plus, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    wishlistItems: Product[];
    onAddToCart: (product: Product) => void;
    onRemove: (id: number) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
    isOpen,
    onClose,
    wishlistItems,
    onAddToCart,
    onRemove
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500 border-l border-white/20">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <h2 className="text-lg font-light tracking-[0.2em] uppercase">Favoritos ({wishlistItems.length})</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {wishlistItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                            <Heart className="w-12 h-12 opacity-20" />
                            <p className="font-light">Tu lista de deseos está vacía.</p>
                        </div>
                    ) : (
                        wishlistItems.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-playfair font-medium text-gray-900">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.brand}</p>
                                    <p className="text-xs font-semibold mt-1">${item.price}</p>
                                </div>
                                <button onClick={() => { onAddToCart(item); onClose(); }} className="p-2 bg-black text-white rounded-full hover:scale-105 transition-transform">
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button onClick={() => onRemove(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
