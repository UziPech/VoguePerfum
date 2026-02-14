const supabase = require('../config/supabase');

/**
 * Logs an administrative activity to the database.
 * @param {Object} params
 * @param {string} params.user_id - UUID of the user performing the action.
 * @param {string} params.user_name - Name of the user.
 * @param {string} params.action - 'CREATE', 'UPDATE', 'DELETE', etc.
 * @param {string} params.entity - 'PRODUCT', 'CATEGORY', 'BRAND', etc.
 * @param {string|number} params.entity_id - ID of the entity.
 * @param {string} params.entity_name - Name/Label of the entity.
 * @param {string} [params.justification] - Reason for the action (required for updates).
 * @param {Object} [params.details] - JSON object with details of the change.
 */
const logActivity = async ({ user_id, user_name, action, entity, entity_id, entity_name, justification, details }) => {
    try {
        const { error } = await supabase
            .from('activity_logs')
            .insert([{
                user_id,
                user_name,
                action,
                entity,
                entity_id,
                entity_name,
                justification,
                details
            }]);

        if (error) {
            console.error('Failed to log activity:', error.message);
        }
    } catch (err) {
        console.error('Error logging activity:', err.message);
    }
};

module.exports = logActivity;
