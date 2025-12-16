const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const EnergyData = require('../models/EnergyData');

router.get('/history', auth, async (req, res) => {
    try {
        // Fetch history for the logged-in user, sorted by most recent first
        // Limit to 50 for the chart
        const history = await EnergyData.find({ user: req.user.id })
            .sort({ timestamp: 1 })
            .limit(50); // Get last 50

        // If we get "last 50" by sort -1, we need to reverse them to be chronological
        const recentHistory = await EnergyData.find({ user: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(recentHistory.reverse());
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
