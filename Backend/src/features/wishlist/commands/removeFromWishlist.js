const supabase = require('../../../config/supabase');

// Command: Remove from Wishlist
const removeFromWishlist = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;

    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .match({ user_id: userId, product_id: productId });

        if (error) throw error;

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = removeFromWishlist;
