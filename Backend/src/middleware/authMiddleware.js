const supabase = require('../config/supabase');

// Validar Token JWT de Supabase
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(`[AuthMiddleware] URL: ${req.url}, Method: ${req.method}`);

        if (!authHeader) {
            console.log('[AuthMiddleware] Missing Authorization header');
            return res.status(401).json({ error: 'Missing Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('[AuthMiddleware] Invalid token format');
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Verificar el token obteniendo el usuario
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.log('[AuthMiddleware] Invalid or expired token:', error?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log(`[AuthMiddleware] User authenticated: ${user.email}`);

        // Adjuntar usuario al request
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(500).json({ error: 'Internal Server Error during auth' });
    }
};

// Validar Rol de Admin
const requireAdmin = async (req, res, next) => {
    try {
        // Asumimos que authenticateUser ya corrió
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Consultar tabla profiles o metadata (dependiendo de tu implementación)
        // Opción A: Usar metadata del usuario (más rápido si syncronizas roles)
        // Opción A: Usar metadata del usuario
        let role = req.user.user_metadata?.role || 'customer';

        // Opción B: Consultar tabla 'profiles' para la fuente final de la verdad
        if (role !== 'admin') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();
                
            if (profile && profile.role === 'admin') {
                role = 'admin';
            }
        }

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden: Admins only' });
        }

        next();
    } catch (err) {
        console.error('Role Error:', err);
        res.status(500).json({ error: 'Internal Server Error during role check' });
    }
};

module.exports = { authenticateUser, requireAdmin };
