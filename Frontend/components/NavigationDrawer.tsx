import React from 'react';
import { X, LayoutDashboard, Home, ShoppingBag, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../src/store/slices/authSlice';
import { useAppDispatch } from '../src/store/hooks';
import { logout } from '../src/store/slices/authSlice';
import { useGetCategoriesQuery } from '../src/store/api/catalogApi';

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
    isOpen,
    onClose,
    user
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data: categories } = useGetCategoriesQuery(undefined);

    const handleLogout = () => {
        dispatch(logout());
        onClose();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-start">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer - Glassmorphism Applied */}
            <div className="relative w-full max-w-xs bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-500 border-r border-white/20">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <h2 className="text-lg font-serif font-bold tracking-wider uppercase">Menu</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <nav className="space-y-4">
                        <Link
                            to="/"
                            onClick={onClose}
                            className="flex items-center gap-3 text-gray-800 hover:text-black transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium text-lg">Inicio</span>
                        </Link>

                        <Link
                            to="/#catalog"
                            onClick={onClose}
                            className="flex items-center gap-3 text-gray-800 hover:text-black transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-medium text-lg">Catálogo Completo</span>
                        </Link>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Categorías</h3>
                            <div className="space-y-3 pl-2">
                                {categories?.map((cat: any) => (
                                    <Link
                                        key={cat.id}
                                        to={`/?category=${encodeURIComponent(cat.name)}#catalog`}
                                        onClick={onClose}
                                        className="block text-gray-600 hover:text-black transition-colors text-base"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Admin Panel Link - Exclusive for Admins */}
                        {user?.role === 'admin' && (
                            <div className="pt-4 border-t border-gray-200/50">
                                <Link
                                    to="/admin/dashboard"
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-black hover:text-gray-700 transition-colors bg-gray-50 p-3 rounded-lg"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span className="font-medium text-lg">Panel de Admin</span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Drawer Footer - User Actions */}
                <div className="border-t border-gray-200/50 p-6 bg-gray-50/50 backdrop-blur-md">
                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{user.name || 'Usuario'}</span>
                                    <span className="text-xs">{user.email}</span>
                                </div>
                            </div>
                            <Link to="/profile" className="block text-xs text-center text-gray-500 hover:underline mb-2" onClick={onClose}>Ver Perfil</Link>
                            <button
                                onClick={handleLogout}
                                className="w-full mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/admin/login"
                            onClick={onClose}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
