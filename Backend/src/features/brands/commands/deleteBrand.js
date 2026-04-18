const supabase = require('../../../config/supabase');

const logActivity = require('../../../utils/activityLogger');

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: brand } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;

        if (brand) {
            const user = req.user;
            const userName = user?.user_metadata?.name || user?.email || 'Unknown';

            await logActivity({
                user_id: user.id,
                user_name: userName,
                action: 'DELETE',
                entity: 'BRAND',
                entity_id: brand.id,
                entity_name: brand.name,
                details: brand
            });
        }

        res.json({ message: 'Brand deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteBrand;
