const supabase = require('../../../config/supabase');

// Command: LoginUser
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Fetch user role from metadata or profiles table if needed.
        // For now, assuming role is in user_metadata or default to 'customer'.
        const role = data.user.user_metadata?.role || 'customer';

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
        if (err.message && (err.message.includes('Invalid login credentials') || err.message.includes('Invalid grant'))) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }
        res.status(401).json({ error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    }
};

module.exports = loginUser;
