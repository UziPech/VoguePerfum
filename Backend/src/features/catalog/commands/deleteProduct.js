const supabase = require('../../../config/supabase');
const logActivity = require('../../../utils/activityLogger');

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // First, fetch the product to log its details
        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Log the deletion activity
        if (product) {
            const user = req.user;
            const userName = user?.user_metadata?.name || user?.email || 'Unknown';

            await logActivity({
                user_id: user.id,
                user_name: userName,
                action: 'DELETE',
                entity: 'PRODUCT',
                entity_id: product.id,
                entity_name: product.name,
                details: product
            });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteProduct;
