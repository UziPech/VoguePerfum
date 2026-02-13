const supabase = require('../../../config/supabase');

// Command: CreateProduct
const createProduct = async (req, res) => {
    const { name, price, description, stock, category_id, image_url, brand_id } = req.body;

    // Basic Validation
    if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                description,
                price,
                stock: stock || 0,
                category_id,
                image_url,
                brand_id,
                is_new: true
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createProduct;
