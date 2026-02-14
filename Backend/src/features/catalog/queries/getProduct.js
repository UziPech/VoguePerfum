const supabase = require('../../../config/supabase');

// Query: Get Single Product by ID (with related data)
const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (id, name, slug),
                brands (id, name)
            `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found (0 rows)
                return res.status(404).json({ error: 'Product not found' });
            }
            throw error;
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getProduct;
