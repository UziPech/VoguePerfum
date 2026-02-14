const supabase = require('../../../config/supabase');

// Command: Create Review
const createReview = async (req, res) => {
    // User is attached by authMiddleware
    const { id: userId } = req.user;
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
        return res.status(400).json({ error: 'Product ID and Rating (1-5) are required' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                { user_id: userId, product_id, rating, comment }
            ])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(409).json({ error: 'You have already reviewed this product' });
            }
            throw error;
        }

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = createReview;
