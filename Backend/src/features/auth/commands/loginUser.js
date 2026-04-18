const { createClient } = require('@supabase/supabase-js');
const supabase = require('../../../config/supabase');

// Command: LoginUser
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        // Create a temporary client so we don't poison the global service_role client's in-memory session
        const authSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const { data, error } = await authSupabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Fetch user role from metadata or profiles table.
        // Priority: Profiles -> Metadata -> Default 'customer'
        let role = data.user.user_metadata?.role;

        // Intentar SIEMPRE obtener el rol de la tabla profiles, ya que es donde el usuario lo edita manualmente.
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileData && !profileError && profileData.role) {
                // Si existe rol en profiles, USARLO (sobrescribe metadata)
                role = profileData.role;
                console.log('Role fetched from profiles:', role);
            }
        } catch (roleCatchError) {
            console.warn('Error fetching role from profiles:', roleCatchError);
        }

        role = role || 'customer';

        // Intentar obtener el nombre de metadata, o fallback a tabla profiles
        let name = data.user.user_metadata?.name || data.user.user_metadata?.full_name || '';

        if (!name) {
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('name, full_name, nombre')
                    .eq('id', data.user.id)
                    .single();

                if (profileData && !profileError) {
                    name = profileData.name || profileData.full_name || profileData.nombre || '';
                }
            } catch (profileCatchError) {
                console.warn('Error fetching profile:', profileCatchError);
            }
        }

        const userResponse = {
            id: data.user.id,
            email: data.user.email,
            role: role,
            name: name
        };
        console.log('Login Response User:', userResponse);

        res.json({
            user: userResponse,
            token: data.session.access_token
        });
    } catch (err) {
        console.error('Login Error:', err);
        if (err.message) {
            if (err.message.includes('Invalid login credentials') || err.message.includes('Invalid grant')) {
                return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
            }
            if (err.message.includes('Email not confirmed')) {
                return res.status(401).json({
                    error: 'Tu correo aún no está confirmado. Por favor revisa tu bandeja de entrada y confirma tu correo electrónico.'
                });
            }
        }
        res.status(401).json({ error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    }
};

module.exports = loginUser;
