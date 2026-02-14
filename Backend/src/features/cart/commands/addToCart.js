const supabase = require('../../../config/supabase');

// Command: Add to Cart or Update Quantity
const addToCart = async (req, res) => {
    const { id: userId } = req.user;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        // Upsert logic: if exists, we might need to increment or just replace.
        // For simplicity in this command, we'll try to insert, and if conflict, update.
        // However, standard upsert replaces.
        // Let's check if it exists first to increment.

        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('quantity')
            .match({ user_id: userId, product_id })
            .single();

        let newQuantity = quantity;
        if (existingItem) {
            newQuantity = existingItem.quantity + quantity;
        }

        const { data, error } = await supabase
            .from('cart_items')
            .upsert([
                { user_id: userId, product_id, quantity: newQuantity }
            ], { onConflict: 'user_id, product_id' })
            .select()
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = addToCart;
