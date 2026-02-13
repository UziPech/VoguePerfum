const supabase = require('../../../config/supabase');

// Command: RegisterUser
const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role: 'customer' } // Default role
            }
        });

        if (error) throw error;
        res.status(201).json({ message: 'User created successfully', user: data.user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = registerUser;
