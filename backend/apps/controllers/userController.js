
const User = require('../models/userModel');

module.exports = {
    // Get current user's profile (using ID from JWT token)
    async getCurrentUser(req, res) {
        try {
            // Use object destructuring to exclude sensitive fields
            const { password, _id, __v, createdAt, updatedAt, role, ...userData } = req.user.toObject();

            return res.status(200).json(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: 'Failed to fetch user.', errors: error.message });
        }
    },

    // Get user by specific ID (admin only)
    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: 'Failed to fetch user.', errors: error.message });
        }
    },

};

