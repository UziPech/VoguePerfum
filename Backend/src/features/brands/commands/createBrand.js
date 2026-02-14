const supabase = require('../../../config/supabase');
const logActivity = require('../../../utils/activityLogger');

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

        // Log Activity
        await logActivity({
            user_id: req.user.id,
            user_name: req.user.user_metadata?.name || req.user.email,
            action: 'CREAR',
            entity: 'MARCA',
            entity_id: data.id,
            entity_name: data.name,
            details: { image_url: data.image_url }
        });

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createBrand;
