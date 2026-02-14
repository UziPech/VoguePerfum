const supabase = require('../../../config/supabase');

// Query: Get Cart
const getCart = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                product:product_id (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getCart;
