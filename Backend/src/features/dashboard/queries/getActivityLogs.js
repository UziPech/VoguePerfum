const supabase = require('../../../config/supabase');

// Query: Get Activity Logs
const getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('activity_logs')
            .select('*', { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            data,
            meta: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getActivityLogs;
