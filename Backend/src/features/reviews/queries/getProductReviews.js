const supabase = require('../../../config/supabase');

// Query: Get Product Reviews & Stats
const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        // 1. Get Reviews
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // 2. Get user profiles for these reviews
        const userIds = reviews.map(r => r.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);

        // 3. Merge profiles into reviews
        const reviewsWithProfiles = reviews.map(review => {
            const profile = profiles?.find(p => p.id === review.user_id);
            return {
                ...review,
                profiles: profile ? { full_name: profile.full_name, email: profile.email } : null
            };
        });

        // 4. Calculate Stats (Average & Count)
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        res.json({
            reviews: reviewsWithProfiles,
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
