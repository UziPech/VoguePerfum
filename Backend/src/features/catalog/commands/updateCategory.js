const supabase = require('../../../config/supabase');

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Command: UpdateCategory
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, is_active } = req.body;

    if (!id) return res.status(400).json({ error: 'Category ID is required' });

    try {
        const updates = {};
        if (is_active !== undefined) updates.is_active = is_active;

        if (name) {
            updates.name = name;
            const slug = generateSlug(name);

            // Check if slug exists in OTHER categories
            const { data: existing } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', slug)
                .neq('id', id)
                .single();

            if (existing) {
                return res.status(409).json({ error: 'Category with this name already exists' });
            }
            updates.slug = slug;
        }

        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = updateCategory;
