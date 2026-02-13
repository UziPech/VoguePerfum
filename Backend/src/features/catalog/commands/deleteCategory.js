const supabase = require('../../../config/supabase');

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteCategory;
