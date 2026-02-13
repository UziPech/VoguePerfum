import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
// import { setCredentials } from '../../store/slices/authSlice'; // Register usually doesn't auto-login unless API returns token
import { useLoginMutation } from '../../store/api/catalogApi'; // We might want to auto-login

// We need a register mutation in catalogApi
import { catalogApi } from '../../store/api/catalogApi';

export const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [register, { isLoading, error }] = catalogApi.useRegisterMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ email, password, name }).unwrap();
            alert('Cuenta creada exitosamente. Por favor inicia sesión.');
            navigate('/admin/login');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
                    <p className="text-gray-500 mt-2">Únete a Vogue Perfum</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            Error al crear cuenta. Intenta nuevamente.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creando...' : 'Registrarse'}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/admin/login" className="text-sm text-gray-600 hover:text-black hover:underline">
                            ¿Ya tienes cuenta? Inicia Sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
