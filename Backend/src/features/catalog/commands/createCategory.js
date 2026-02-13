const supabase = require('../../../config/supabase');

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Command: CreateCategory
const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    try {
        const slug = generateSlug(name);

        // Check if slug exists
        const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            return res.status(409).json({ error: 'Category with this name already exists' });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, slug }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createCategory;
