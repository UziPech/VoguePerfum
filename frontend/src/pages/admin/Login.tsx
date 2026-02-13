import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../store/api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Vogue Perfum</h1>
                    <p className="text-gray-500 mt-2">Acceso Administrativo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            Credenciales inválidas o error de conexión
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/admin/register" className="text-sm text-gray-600 hover:text-black hover:underline">
                            ¿No tienes cuenta? Regístrate
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
