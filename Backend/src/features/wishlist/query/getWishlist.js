const supabase = require('../../../config/supabase');

// Query: Get User Wishlist
const getWishlist = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select(`
                id,
                product_id,
                created_at,
                product:products (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten structure for frontend if preferred, or keep as is.
        // Returning as is: [{ id, product: {...} }]
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getWishlist;
