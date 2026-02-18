import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';

export const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'waiting'>('verifying');
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Get email and message from navigation state
    const stateEmail = (location.state as any)?.email || '';
    const stateMessage = (location.state as any)?.message || '';
    const isFromRegistration = !!stateMessage;

    useEffect(() => {
        // If coming from registration, show waiting message
        if (isFromRegistration) {
            setStatus('waiting');
            return;
        }

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
    }, [navigate, dispatch, isFromRegistration]);

    const handleResendEmail = async () => {
        if (!stateEmail) {
            alert('No se encontró el correo electrónico.');
            return;
        }

        setResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: stateEmail
            });

            if (error) throw error;

            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 5000);
        } catch (err) {
            console.error('Error resending email:', err);
            alert('Error al reenviar el correo. Intenta más tarde.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">

                {status === 'waiting' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Revisa tu correo!</h2>
                        <p className="text-gray-600 mb-4">{stateMessage}</p>
                        <p className="text-sm text-gray-500 mb-6">
                            Te enviamos un enlace de verificación a <strong>{stateEmail}</strong>
                        </p>

                        {resendSuccess && (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                ¡Correo reenviado exitosamente!
                            </div>
                        )}

                        <button
                            onClick={handleResendEmail}
                            disabled={resending}
                            className="mb-4 text-blue-600 hover:text-blue-800 underline text-sm disabled:opacity-50"
                        >
                            {resending ? 'Reenviando...' : '¿No recibiste el correo? Reenviar'}
                        </button>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-sm text-gray-600">
                            <p className="font-semibold mb-2">💡 Consejos:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Revisa tu carpeta de spam</li>
                                <li>Puede tardar unos minutos en llegar</li>
                                <li>Verifica que el correo esté correcto</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/admin/login')}
                            className="mt-6 text-gray-600 hover:text-black text-sm"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                )}

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
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
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
