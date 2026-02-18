import React from 'react';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    cartCount: number;
    cartTotal: number;
    onRemove: (id: number | string) => void;
    onUpdateQuantity: (id: number | string, delta: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    cart,
    cartCount,
    cartTotal,
    onRemove,
    onUpdateQuantity
}) => {
    if (!isOpen) return null;

    // WhatsApp Checkout
    const handleCheckout = () => {
        const message = `Hola, me gustaría ordenar los siguientes productos:\n\n${cart.map(item => `- ${item.name} (${item.quantity}) - $${item.price * item.quantity}`).join('\n')}\n\nTotal: $${cartTotal.toFixed(2)}`;
        const url = `https://wa.me/529994841525?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer - Glassmorphism Applied */}
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500 border-l border-white/20">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <h2 className="text-lg font-light tracking-[0.2em] uppercase">Tu Bolsa ({cartCount})</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                            <ShoppingBag className="w-12 h-12 opacity-20" />
                            <p className="font-light">Tu bolsa está vacía.</p>
                            <button
                                onClick={onClose}
                                className="text-black font-medium border-b border-black text-sm pb-1 uppercase tracking-wider"
                            >
                                Descubrir Aromas
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-24 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                                    <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-sm text-gray-900 tracking-wide font-playfair">{item.name}</h3>
                                            <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-black transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{item.brand}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center border border-gray-300">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                                className="p-1.5 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-3 text-xs font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                                className="p-1.5 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Drawer Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200/50 p-6 space-y-4 bg-gray-50/50 backdrop-blur-md">
                        <div className="flex justify-between items-center text-base font-medium text-gray-900">
                            <span className="uppercase tracking-widest text-sm">Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center uppercase tracking-wider">Impuestos y envío calculados al finalizar.</p>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-3"
                        >
                            Finalizar en WhatsApp
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
