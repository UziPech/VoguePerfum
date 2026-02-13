const supabase = require('../../../config/supabase');

// Command: UpdateProduct
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock, category_id, image_url, brand_id, is_new } = req.body;

    if (!id) return res.status(400).json({ error: 'Product ID is required' });

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

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = updateProduct;
