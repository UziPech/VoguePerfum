import React from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredProducts: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    filteredProducts
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Search Container */}
            <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-top-10 duration-500">
                <div className="flex items-center gap-4">
                    <Search className="w-6 h-6 text-white/70" />
                    <input
                        type="text"
                        placeholder="Buscar perfumes, marcas..."
                        className="w-full bg-transparent border-none text-xl md:text-2xl text-white placeholder-white/50 focus:ring-0 outline-none font-playfair italic"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Quick Results Preview (Optional) */}
                {searchQuery && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Resultados</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.slice(0, 4).map(product => (
                                <div key={product.id} className="flex items-center gap-4 group cursor-pointer" onClick={onClose}>
                                    <img src={product.image_url || product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md opacity-80 group-hover:opacity-100" />
                                    <div>
                                        <p className="text-white text-sm font-medium">{product.name}</p>
                                        <p className="text-white/50 text-xs">{product.brand}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <p className="text-white/70 italic">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
