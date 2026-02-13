const supabase = require('../../../config/supabase');

const getBrands = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getBrands;
