const supabase = require('../../../config/supabase');

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Brand deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteBrand;
