const supabase = require('../../../config/supabase');

// Query: Get Product Reviews & Stats
const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        // 1. Get Reviews with User Profile
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // 2. Calculate Stats (Average & Count)
        // We could do this with a database function, but for now JS calculation is fine for MVP
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        res.json({
            reviews,
            stats: {
                totalReviews,
                averageRating: parseFloat(averageRating)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getProductReviews;
