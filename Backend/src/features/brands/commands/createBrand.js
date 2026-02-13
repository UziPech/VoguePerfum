const supabase = require('../../../config/supabase');

const createBrand = async (req, res) => {
    const { name, image_url } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Brand name is required' });
    }

    try {
        const { data, error } = await supabase
            .from('brands')
            .insert([{ name, image_url }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createBrand;
