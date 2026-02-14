import React, { useState } from 'react';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User as UserType } from '../src/store/slices/authSlice';
import { NavigationDrawer } from './NavigationDrawer';

interface NavbarProps {
    scrolled: boolean;
    cartCount: number;
    wishlistCount: number;
    onOpenCart: () => void;
    onOpenWishlist: () => void;
    onOpenSearch: () => void;
    user?: UserType | null;
}

export const Navbar: React.FC<NavbarProps> = ({
    scrolled,
    cartCount,
    wishlistCount,
    onOpenCart,
    onOpenWishlist,
    onOpenSearch,
    user
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 text-black py-4'
                    : 'bg-transparent text-white py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Mobile/Menu Menu Icon - Now Visible on Desktop too as per request implies "top left" */}
                        <div className="">
                            <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity">
                                <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="text-xl md:text-2xl font-bold tracking-[0.2em] text-center md:text-left flex-1 md:flex-none uppercase absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                            Vogue Perfum
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 md:space-x-6">
                            <button onClick={onOpenSearch} className="hover:opacity-70 transition-opacity">
                                <Search className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {/* User Icon - Now just links to Profile or Login, Admin link is in Drawer */}
                            <Link to={user ? "/profile" : "/admin/login"} className="hover:opacity-70 transition-opacity flex items-center gap-2">
                                {user ? (
                                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold border ${scrolled ? 'border-gray-900 text-gray-900' : 'border-white text-white'}`}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                ) : (
                                    <User className="w-5 h-5 md:w-6 md:h-6" />
                                )}
                            </Link>

                            <button
                                onClick={onOpenWishlist}
                                className="relative hidden md:block group cursor-pointer hover:opacity-70 transition-opacity"
                            >
                                <Heart className={`w-6 h-6 transition-colors ${wishlistCount > 0 ? 'fill-current' : ''}`} />
                                {wishlistCount > 0 && (
                                    <span className={`absolute -top-1 -right-1 text-[10px] w-4 h-4 flex items-center justify-center rounded-full ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={onOpenCart}
                                className="relative hover:opacity-70 transition-opacity"
                            >
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                                {cartCount > 0 && (
                                    <span className={`absolute -top-1 -right-1 text-[10px] w-4 h-4 flex items-center justify-center rounded-full ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <NavigationDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
            />
        </>
    );
};
