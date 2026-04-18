const supabase = require('../../../config/supabase');

const logActivity = require('../../../utils/activityLogger');

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: category } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        if (category) {
            const user = req.user;
            const userName = user?.user_metadata?.name || user?.email || 'Unknown';

            await logActivity({
                user_id: user.id,
                user_name: userName,
                action: 'DELETE',
                entity: 'CATEGORY',
                entity_id: category.id,
                entity_name: category.name,
                details: category
            });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteCategory;
