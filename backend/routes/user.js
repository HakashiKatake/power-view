const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   PUT api/user/settings
// @desc    Update user settings (budget)
// @access  Private
router.put('/settings', auth, async (req, res) => {
    const { budgetLimit } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (budgetLimit) user.budgetLimit = budgetLimit;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
