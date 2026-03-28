const supabase = require('../../../config/supabase');

// Query: GetProducts
const getProducts = async (req, res) => {
    try {
        console.log('[getProducts] req.query completo:', req.query);
        console.log('[getProducts] search value:', req.query.search);
        console.log('[getProducts] search type:', typeof req.query.search);

        const { page: rawPage = 1, limit: rawLimit = 12, category_slug, search } = req.query;
        const page = parseInt(rawPage);
        const limit = parseInt(rawLimit);
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

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data: products, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch Stats and Badges manually for these products
        const productIds = products.map(p => p.id);

        const { data: stats } = await supabase
            .from('product_stats_view')
            .select('*')
            .in('product_id', productIds);

        const { data: badges } = await supabase
            .from('product_badges_view')
            .select('*')
            .in('product_id', productIds);

        // Merge stats and badges into products
        const productsWithStats = products.map(p => {
            const stat = stats?.find(s => s.product_id === p.id);
            const badge = badges?.find(b => b.product_id === p.id);
            return {
                ...p,
                stats: {
                    total_reviews: stat ? stat.total_reviews : 0,
                    average_rating: stat ? Number(stat.average_rating) : 0
                },
                product_badges_view: badge ? [{ badge_type: badge.badge_type }] : []
            };
        });

        res.json({
            data: productsWithStats,
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
