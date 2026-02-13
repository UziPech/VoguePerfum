import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Tag, Package, LogOut } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Categorías', icon: Tag, path: '/admin/categories' },
        { name: 'Marcas', icon: Tag, path: '/admin/brands' }, // Using Tag for brands too
        { name: 'Productos', icon: Package, path: '/admin/products' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <h1 className="text-xl font-serif font-bold tracking-wider">VOGUE ADMIN</h1>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={(props: any) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${props.isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
