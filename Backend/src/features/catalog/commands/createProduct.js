const supabase = require('../../../config/supabase');
const logActivity = require('../../../utils/activityLogger');

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
        if (error) throw error;

        // Log Activity
        // Note: req.user should be populated by authMiddleware. 
        // If user_name is not available directly, we might need to fetch it or store it in token.
        const user = req.user;
        const userName = user?.user_metadata?.name || user?.email || 'Unknown';

        await logActivity({
            user_id: user.id,
            user_name: userName,
            action: 'CREATE',
            entity: 'PRODUCT',
            entity_id: data.id,
            entity_name: data.name,
            details: data
        });

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createProduct;
