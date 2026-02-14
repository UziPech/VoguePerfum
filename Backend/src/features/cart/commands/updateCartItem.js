const supabase = require('../../../config/supabase');

// Command: Update Cart Item Quantity
const updateCartItem = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity required' });
    }

    try {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .match({ user_id: userId, product_id: productId })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = updateCartItem;
