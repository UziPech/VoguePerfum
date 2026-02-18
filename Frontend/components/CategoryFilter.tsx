import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
    categories: { label: string; value: Category }[];
    selectedCategory: Category;
    onSelectCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelectCategory
}) => {
    return (
        <div className="bg-white sticky top-[72px] z-30 pt-4 pb-2 border-b border-gray-100/50 backdrop-blur-sm bg-white/90">
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
                <div className="flex space-x-8 py-4 whitespace-nowrap min-w-max">
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => onSelectCategory(cat.value)}
                            className={`text-sm tracking-[0.1em] uppercase transition-all duration-300 ${selectedCategory === cat.value
                                ? 'text-black font-bold border-b border-black pb-1'
                                : 'text-gray-400 hover:text-gray-800'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
