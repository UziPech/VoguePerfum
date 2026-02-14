const supabase = require('../../../config/supabase');

const logActivity = require('../../../utils/activityLogger');

// Command: UpdateProduct
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock, category_id, image_url, brand_id, is_new, justification } = req.body;

    if (!id) return res.status(400).json({ error: 'Product ID is required' });
    if (!justification || justification.trim() === '') {
        return res.status(400).json({ error: 'Justification is required for updating products.' });
    }

    try {
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (price !== undefined) updates.price = price;
        if (description !== undefined) updates.description = description;
        if (stock !== undefined) updates.stock = stock;
        if (category_id !== undefined) updates.category_id = category_id;
        if (image_url !== undefined) updates.image_url = image_url;
        if (brand_id !== undefined) updates.brand_id = brand_id;
        if (is_new !== undefined) updates.is_new = is_new;

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Product not found' });

        if (!data) return res.status(404).json({ error: 'Product not found' });

        // Log Activity
        const user = req.user;
        const userName = user?.user_metadata?.name || user?.email || 'Unknown';

        await logActivity({
            user_id: user.id,
            user_name: userName,
            action: 'UPDATE',
            entity: 'PRODUCT',
            entity_id: data.id,
            entity_name: data.name,
            justification: justification,
            details: updates
        });

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = updateProduct;
