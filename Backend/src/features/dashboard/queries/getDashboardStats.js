const supabase = require('../../../config/supabase');

const getDashboardStats = async (req, res) => {
    try {
        // Fetch counts for Products, Categories, and Brands
        const [
            { count: productsCount, error: productsError },
            { count: categoriesCount, error: categoriesError },
            { count: brandsCount, error: brandsError },
            { data: stockData, error: stockError } // For total stock calculation
        ] = await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true }),
            supabase.from('categories').select('*', { count: 'exact', head: true }),
            supabase.from('brands').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('stock') // Fetch stock to sum it up
        ]);

        if (productsError) throw productsError;
        if (categoriesError) throw categoriesError;
        if (brandsError) throw brandsError;
        if (stockError) throw stockError;

        // Calculate total stock
        const totalStock = stockData.reduce((acc, curr) => acc + (curr.stock || 0), 0);

        // Calculate total sales (Mock for now, or fetch from orders table if/when it exists)
        // For now returning 0 or a placeholder as we don't have orders table yet.
        const totalSales = 0;

        res.json({
            totalProducts: productsCount || 0,
            activeCategories: categoriesCount || 0,
            totalBrands: brandsCount || 0,
            totalStock: totalStock,
            totalSales: totalSales
        });

    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = getDashboardStats;
