const supabase = require('../../../config/supabase');

// Command: RegisterUser
const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    // Validaciones Backend
    if (!email || !password || !name) return res.status(400).json({ error: 'Todos los campos son obligatorios.' });

    if (name.length > 50) return res.status(400).json({ error: 'El nombre es demasiado largo (máximo 50 caracteres).' });
    if (/\d/.test(name)) return res.status(400).json({ error: 'El nombre no debe contener números.' });
    if (!email.includes('@') || !email.includes('.com')) return res.status(400).json({ error: 'Correo electrónico inválido.' });

    try {
        // 1. Check if user already exists (using Admin API)
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return res.status(409).json({ error: 'Este correo electrónico ya está registrado.' });
        }


        // 2. Create user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role: 'customer' } // Default role
            }
        });

        if (error) throw error;

        // Check if we got a session (means email confirmation is disabled or auto-confirmed)
        // If email confirmation is enabled, data.session will be null
        const hasSession = data.session !== null;

        // Prepare user response
        const userResponse = {
            id: data.user.id,
            email: data.user.email,
            role: 'customer',
            name: name
        };

        if (hasSession) {
            // Email confirmation disabled - return session for auto-login
            res.status(201).json({
                message: 'User created successfully',
                user: userResponse,
                token: data.session.access_token,
                autoLogin: true
            });
        } else {
            // Email confirmation enabled - user needs to verify email
            res.status(201).json({
                message: 'User created successfully. Please check your email to verify your account.',
                user: userResponse,
                autoLogin: false
            });
        }
    } catch (err) {
        console.error('Registration Error:', err);
        // ... rest of error handling
        if (err.message && err.message.includes('User already registered')) {
            return res.status(409).json({ error: 'Este correo electrónico ya está registrado.' });
        }
        res.status(400).json({ error: 'Error al registrar usuario. Inténtalo de nuevo.' });
    }
};

module.exports = registerUser;
