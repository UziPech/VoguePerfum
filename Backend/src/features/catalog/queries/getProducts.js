const supabase = require('../../../config/supabase');

// Query: GetProducts
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, category_slug } = req.query;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('products')
            .select(`
        *,
        categories!inner(id, name, slug),
        brands(id, name)
      `, { count: 'exact' });

        // Exclude stock for public view (if not admin)
        // NOTE: RLS should handle this, but for now we filter fields if needed.
        // Ideally, we'd have separate endpoint for Admin GetProducts which includes stock.

        if (category_slug) {
            query = query.eq('categories.slug', category_slug);
        }

        const { data, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            data,
            meta: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getProducts;
