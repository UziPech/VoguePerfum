import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../store/api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';

export const Login: React.FC = () => {
    // ... state ...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        // ... submit logic ...
        e.preventDefault();

        // Custom Validation
        if (!email.includes('@') || !email.includes('.com')) {
            alert('Por favor, ingresa un correo electrónico válido (debe contener "@" y ".com")');
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-black transition-colors">
                <ChevronLeft size={20} className="mr-1" />
                <span className="font-medium">Volver al catálogo</span>
            </Link>

            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    {/* Placeholder for Logo - User to place logo.png in public folder */}
                    <img src="/logo.png" alt="Glow & essence" className="h-16 mx-auto mb-4 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />

                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-[0.2em] font-sans">Glow & essence</h1>
                    <p className="text-gray-500 mt-2 text-sm tracking-wide">Se parte de nuestra comunidad</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {(() => {
                                if ('status' in error) {
                                    if (error.status === 'FETCH_ERROR') return 'No se pudo conectar con el servidor. Intenta más tarde.';
                                    if ('data' in error && (error.data as any).error) {
                                        const errorMsg = (error.data as any).error;
                                        // Check if email not confirmed
                                        if (errorMsg.includes('Email not confirmed') || errorMsg.includes('no confirmado')) {
                                            return (
                                                <div className="space-y-2">
                                                    <p>Tu correo aún no está verificado.</p>
                                                    <p className="text-xs">Por favor revisa tu bandeja de entrada y confirma tu correo electrónico.</p>
                                                    <Link
                                                        to="/admin/verify-email"
                                                        state={{ email }}
                                                        className="text-blue-600 underline text-xs block mt-2"
                                                    >
                                                        ¿No recibiste el correo? Haz clic aquí
                                                    </Link>
                                                </div>
                                            );
                                        }
                                        return errorMsg;
                                    }
                                }
                                return 'Error al iniciar sesión. Verifica tus datos.';
                            })()}
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
                        <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
                        <Link to="/admin/register" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                            Regístrate
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
