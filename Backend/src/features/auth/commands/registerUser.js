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
        const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers();

        if (searchError) {
            console.error('Error checking existing users:', searchError);
            // Proceed to signUp anyway if search fails, or handle error
        } else {
            // Filter out soft-deleted users (deleted_at is not null)
            const activeUsers = existingUsers.users.filter(u => !u.deleted_at);
            const userExists = activeUsers.some(u => u.email === email);
            if (userExists) {
                return res.status(409).json({ error: 'Este correo electrónico ya está registrado.' });
            }
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

        // If signUp returns a user but identities is empty, it might be a silent existing user case,
        // but our admin check above should catch it.
        // Also check if user is already confirmed or not if needed.

        res.status(201).json({ message: 'User created successfully', user: data.user });
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
