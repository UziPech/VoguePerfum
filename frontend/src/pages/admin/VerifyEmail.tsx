import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';

export const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        const handleSession = async () => {
            try {
                // Supabase handles the hash fragment automatically to set the session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    // Session established (email verified)
                    setStatus('success');

                    // Extract role and name
                    const role = session.user.user_metadata?.role || 'customer';
                    const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario';

                    // Update Redux state
                    dispatch(setCredentials({
                        user: {
                            id: session.user.id,
                            email: session.user.email!,
                            role,
                            name
                        },
                        token: session.access_token
                    }));

                    // Delay slightly for UX so user sees "Verified" message
                    setTimeout(() => {
                        if (role === 'admin' || role === 'superadmin') {
                            navigate('/admin/dashboard');
                        } else {
                            navigate('/');
                        }
                    }, 1500);

                } else {
                    // No session found, maybe link expired or invalid
                    // But if we just loaded the page with a hash, give Supabase a moment to process it
                    // Usually getSession works if the URL contains the access_token
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            setStatus('success');
                            const role = session.user.user_metadata?.role || 'customer';
                            const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario';

                            dispatch(setCredentials({
                                user: {
                                    id: session.user.id,
                                    email: session.user.email!,
                                    role,
                                    name
                                },
                                token: session.access_token
                            }));

                            setTimeout(() => {
                                if (role === 'admin' || role === 'superadmin') {
                                    navigate('/admin/dashboard');
                                } else {
                                    navigate('/');
                                }
                            }, 1500);
                        } else {
                            setStatus('error'); // Only if explicit sign out or error
                        }
                    });
                    return () => subscription.unsubscribe();
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
            }
        };

        handleSession();
    }, [navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-black animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900">Verificando tu cuenta...</h2>
                        <p className="text-gray-500 mt-2">Por favor espera un momento.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                            🎉
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">¡Cuenta Verificada!</h2>
                        <p className="text-gray-500 mt-2">Te estamos redirigiendo...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 text-2xl font-bold">
                            !
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Enlace inválido o expirado</h2>
                        <p className="text-gray-500 mt-2 mb-6">No pudimos verificar tu cuenta. Intenta iniciar sesión o solicitar un nuevo correo.</p>
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
