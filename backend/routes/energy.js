const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const EnergyData = require('../models/EnergyData');

// @route   GET api/energy/history
// @desc    Get historic energy data
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        // Mock data or real DB query
        // const history = await EnergyData.find({ user: req.user.id }).sort({ timestamp: -1 }).limit(100);
        // For now just return empty array or simulated if DB is empty
        res.json([]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
