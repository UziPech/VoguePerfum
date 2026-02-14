import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (!user) {
        navigate('/admin/login');
        return null; // Or return a loading/redirecting component
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar
                scrolled={true}
                cartCount={0} // Placeholder, ideally from store logic but simpler here 
                wishlistCount={0}
                onOpenCart={() => { }}
                onOpenWishlist={() => { }}
                onOpenSearch={() => { }}
                user={user}
            />

            <div className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                <div className="max-w-2xl mx-auto mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        <User className="w-4 h-4 rotate-180" /> {/* Reusing User icon as arrow or just text */}
                        <span>Volver al Catálogo</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-gray-900">{user.name || user.full_name || 'Usuario'}</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full uppercase tracking-wider font-medium">
                                {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h2 className="text-lg font-bold mb-4">Información de la Cuenta</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">ID de Usuario</span>
                                    <span className="font-mono text-sm">{user.id}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</span>
                                    <span className="font-medium">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
