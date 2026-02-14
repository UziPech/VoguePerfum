const supabase = require('../../../config/supabase');

// Command: Add to Wishlist
const addToWishlist = async (req, res) => {
    const { id: userId } = req.user;
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const { data, error } = await supabase
            .from('wishlists')
            .insert([{ user_id: userId, product_id }])
            .select()
            .single();

        if (error) {
            // Check for duplicate entry
            if (error.code === '23505') {
                return res.status(200).json({ message: 'Already in wishlist' });
            }
            throw error;
        }

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = addToWishlist;
