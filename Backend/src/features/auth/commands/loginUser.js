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
        // If you have a separate profiles table, you should query it here.
        const role = data.user.user_metadata?.role || 'customer';

        res.json({
            user: {
                id: data.user.id,
                email: data.user.email,
                role: role
            },
            token: data.session.access_token
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

module.exports = loginUser;
